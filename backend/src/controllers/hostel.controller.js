const pool = require("../config/db");

const createHostel = async (req, res) => {
  try {
    const { name, address } = req.body;

    const result = await pool.query(
      `
      INSERT INTO hostels(name,address)
      VALUES($1,$2)
      RETURNING *
      `,
      [name, address]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getHostels = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM hostels
      ORDER BY created_at DESC
      `
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  createHostel,
  getHostels,
};