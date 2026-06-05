const pool = require("../config/db");

const createComplaint = async (req, res) => {
  try {
    const { title, description } = req.body;

    const result = await pool.query(
      `
      INSERT INTO complaints(
        student_id,
        title,
        description
      )
      VALUES($1,$2,$3)
      RETURNING *
      `,
      [
        req.user.userId,
        title,
        description
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

const getMyComplaints = async (req, res) => {
  try {

    const result = await pool.query(
      `
      SELECT *
      FROM complaints
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

const getAllComplaints = async (req, res) => {
  try {

    const result = await pool.query(
      `
      SELECT
        complaints.*,
        users.name
      FROM complaints
      JOIN users
      ON complaints.student_id = users.id
      ORDER BY complaints.created_at DESC
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

const updateComplaintStatus = async (req, res) => {
  try {

    const { id } = req.params;

    const { status } = req.body;

    const result = await pool.query(
      `
      UPDATE complaints
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
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaintStatus
};