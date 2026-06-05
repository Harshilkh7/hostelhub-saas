const pool = require("../config/db");

const createLeave = async (req, res) => {
  try {
    const {
      reason,
      from_date,
      to_date
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO leave_requests(
        student_id,
        reason,
        from_date,
        to_date
      )
      VALUES($1,$2,$3,$4)
      RETURNING *
      `,
      [
        req.user.userId,
        reason,
        from_date,
        to_date
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};

const getMyLeaves = async (req, res) => {
  try {

    const result = await pool.query(
      `
      SELECT *
      FROM leave_requests
      WHERE student_id = $1
      ORDER BY created_at DESC
      `,
      [req.user.userId]
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};

const getAllLeaves = async (req, res) => {
  try {

    const result = await pool.query(
      `
      SELECT
      leave_requests.*,
      users.name
      FROM leave_requests
      JOIN users
      ON leave_requests.student_id = users.id
      ORDER BY created_at DESC
      `
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};

const updateLeaveStatus = async (req, res) => {
  try {

    const { id } = req.params;

    const { status } = req.body;

    const result = await pool.query(
      `
      UPDATE leave_requests
      SET status = $1
      WHERE id = $2
      RETURNING *
      `,
      [status, id]
    );

    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};

module.exports = {
  createLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus
};