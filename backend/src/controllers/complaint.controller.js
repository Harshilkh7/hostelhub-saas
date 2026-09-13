const pool = require("../config/db");
const emit = (req, event, payload) => { const io = req.app.get("io"); if (io) io.to(`org:${req.organizationId}`).emit(event, payload); };

const createComplaint = async (req, res) => {
  try {
    const { title, description } = req.body;
    const result = await pool.query(
      `INSERT INTO complaints(student_id,title,description)
       SELECT $1,$2,$3 WHERE EXISTS(SELECT 1 FROM users WHERE id=$1 AND organization_id=$4) RETURNING *`,
      [req.user.userId, title, description, req.organizationId]
    );
    if (!result.rows.length) return res.status(403).json({ message: "Student is outside this organization" });
    emit(req, "complaint:created", result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (error) { console.error(error); res.status(500).json({ message: "Server Error" }); }
};

const getMyComplaints = async (req, res) => {
  try {
    const result = await pool.query(`SELECT c.* FROM complaints c JOIN users u ON c.student_id=u.id WHERE c.student_id=$1 AND u.organization_id=$2 ORDER BY c.created_at DESC`, [req.user.userId, req.organizationId]);
    res.json(result.rows);
  } catch (error) { console.error(error); res.status(500).json({ message: "Server Error" }); }
};

const getAllComplaints = async (req, res) => {
  try {
    const result = await pool.query(`SELECT c.*,u.name FROM complaints c JOIN users u ON c.student_id=u.id WHERE u.organization_id=$1 ORDER BY c.created_at DESC`, [req.organizationId]);
    res.json(result.rows);
  } catch (error) { console.error(error); res.status(500).json({ message: "Server Error" }); }
};

const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"].includes(status)) return res.status(400).json({ message: "Invalid complaint status" });
    const result = await pool.query(`UPDATE complaints c SET status=$1 FROM users u WHERE c.id=$2 AND c.student_id=u.id AND u.organization_id=$3 RETURNING c.*`, [status, req.params.id, req.organizationId]);
    if (!result.rows.length) return res.status(404).json({ message: "Complaint not found" });
    emit(req, "complaint:updated", result.rows[0]);
    res.json(result.rows[0]);
  } catch (error) { console.error(error); res.status(500).json({ message: "Server Error" }); }
};

module.exports = { createComplaint, getMyComplaints, getAllComplaints, updateComplaintStatus };
