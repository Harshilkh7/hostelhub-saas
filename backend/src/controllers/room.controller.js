const pool = require("../config/db");

const createRoom = async (req, res) => {
  try {
    const {
      hostel_id,
      room_number,
      floor,
      capacity
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO rooms(
        hostel_id,
        room_number,
        floor,
        capacity
      )
      VALUES($1,$2,$3,$4)
      RETURNING *
      `,
      [
        hostel_id,
        room_number,
        floor,
        capacity
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

const getRooms = async (req, res) => {
  try {

    const result = await pool.query(
      `
      SELECT
        rooms.*,
        hostels.name AS hostel_name
      FROM rooms
      JOIN hostels
      ON rooms.hostel_id = hostels.id
      ORDER BY rooms.created_at DESC
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

const deleteRoom = async (req, res) => {
  try {

    const { id } = req.params;

    await pool.query(
      `
      DELETE FROM rooms
      WHERE id = $1
      `,
      [id]
    );

    res.json({
      message: "Room deleted"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};

module.exports = {
  createRoom,
  getRooms,
  deleteRoom
};