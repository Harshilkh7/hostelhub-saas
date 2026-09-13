const pool = require("../config/db");

const emit = (req, event, payload) => {
  const io = req.app.get("io");
  if (io) io.to(`org:${req.organizationId}`).emit(event, payload);
};

const createLeave = async (req, res) => {
  try {
    const { reason, from_date, to_date } = req.body;
    const result = await pool.query(
      `INSERT INTO leave_requests(student_id,reason,from_date,to_date)
       SELECT $1,$2,$3,$4 WHERE EXISTS(SELECT 1 FROM users WHERE id=$1 AND organization_id=$5)
       RETURNING *`,
      [req.user.userId, reason, from_date, to_date, req.organizationId]
    );
    if (!result.rows.length) return res.status(403).json({ message: "Student is outside this organization" });
    const leave = result.rows[0];
    emit(req, "leave:created", leave);
    res.status(201).json(leave);
  } catch (error) {
    console.error(error); res.status(500).json({ message: "Server Error" });
  }
};

const getMyLeaves = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM leave_requests WHERE student_id=$1 AND EXISTS(SELECT 1 FROM users WHERE id=student_id AND organization_id=$2) ORDER BY created_at DESC`,
      [req.user.userId, req.organizationId]
    );
    res.json(result.rows);
  } catch (error) { console.error(error); res.status(500).json({ message: "Server Error" }); }
};

const getAllLeaves = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT lr.*, u.name FROM leave_requests lr JOIN users u ON lr.student_id=u.id WHERE u.organization_id=$1 ORDER BY lr.created_at DESC`,
      [req.organizationId]
    );
    res.json(result.rows);
  } catch (error) { console.error(error); res.status(500).json({ message: "Server Error" }); }
};

const updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["PENDING", "APPROVED", "REJECTED", "CANCELLED"].includes(status)) return res.status(400).json({ message: "Invalid leave status" });
    const result = await pool.query(
      `UPDATE leave_requests lr SET status=$1 FROM users u WHERE lr.id=$2 AND lr.student_id=u.id AND u.organization_id=$3 RETURNING lr.*`,
      [status, req.params.id, req.organizationId]
    );
    if (!result.rows.length) return res.status(404).json({ message: "Leave request not found" });
    const leave = result.rows[0];
    emit(req, "leave:updated", leave);
    res.json(leave);
  } catch (error) { console.error(error); res.status(500).json({ message: "Server Error" }); }
};

module.exports = { createLeave, getMyLeaves, getAllLeaves, updateLeaveStatus };
