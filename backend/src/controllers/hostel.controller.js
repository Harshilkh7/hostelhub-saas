const pool = require("../config/db");

const createHostel = async (req, res) => {
  try {
    const { name, address } = req.body;
    const result = await pool.query(
      `INSERT INTO hostels(name,address,organization_id) VALUES($1,$2,$3) RETURNING *`,
      [name, address, req.organizationId]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    if (error.code === "23505") return res.status(409).json({ message: "Hostel name already exists in this organization" });
    res.status(500).json({ message: "Server Error" });
  }
};

const getHostels = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM hostels WHERE organization_id=$1 ORDER BY created_at DESC`,
      [req.organizationId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { createHostel, getHostels };
