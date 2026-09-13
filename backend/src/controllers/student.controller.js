const bcrypt = require("bcryptjs");
const pool = require("../config/db");

const listStudents = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.name, u.email, u.role, u.created_at,
              sp.college_id, sp.course, sp.year, sp.guardian_name, sp.guardian_phone,
              r.id AS room_id, r.room_number, h.id AS hostel_id, h.name AS hostel_name
       FROM users u
       LEFT JOIN student_profiles sp ON sp.user_id=u.id
       LEFT JOIN rooms r ON r.id=sp.room_id
       LEFT JOIN hostels h ON h.id=r.hostel_id
       WHERE u.organization_id=$1 AND u.role='STUDENT'
       ORDER BY u.created_at DESC`,
      [req.organizationId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to load students" });
  }
};

const createStudent = async (req, res) => {
  const client = await pool.connect();
  try {
    const {
      name, email, password, college_id, course, year,
      guardian_name, guardian_phone, hostel_id, room_id,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    await client.query("BEGIN");

    const existing = await client.query("SELECT id FROM users WHERE email=$1", [email.trim().toLowerCase()]);
    if (existing.rows.length) {
      await client.query("ROLLBACK");
      return res.status(409).json({ message: "A user with this email already exists" });
    }

    let validRoomId = room_id || null;
    if (validRoomId) {
      const room = await client.query(
        `SELECT r.id, r.capacity, r.hostel_id
         FROM rooms r JOIN hostels h ON h.id=r.hostel_id
         WHERE r.id=$1 AND h.organization_id=$2`,
        [validRoomId, req.organizationId]
      );
      if (!room.rows.length) {
        await client.query("ROLLBACK");
        return res.status(404).json({ message: "Room not found in this organization" });
      }
      if (hostel_id && hostel_id !== room.rows[0].hostel_id) {
        await client.query("ROLLBACK");
        return res.status(400).json({ message: "Selected room does not belong to the selected hostel" });
      }
      const occupancy = await client.query("SELECT COUNT(*) FROM student_profiles WHERE room_id=$1", [validRoomId]);
      if (Number(occupancy.rows[0].count) >= Number(room.rows[0].capacity)) {
        await client.query("ROLLBACK");
        return res.status(409).json({ message: "Selected room is already at full capacity" });
      }
    }

    if (hostel_id && !validRoomId) {
      const hostel = await client.query("SELECT id FROM hostels WHERE id=$1 AND organization_id=$2", [hostel_id, req.organizationId]);
      if (!hostel.rows.length) {
        await client.query("ROLLBACK");
        return res.status(404).json({ message: "Hostel not found in this organization" });
      }
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const userResult = await client.query(
      `INSERT INTO users(name,email,password_hash,role,organization_id)
       VALUES($1,$2,$3,'STUDENT',$4)
       RETURNING id,name,email,role,organization_id,created_at`,
      [name.trim(), email.trim().toLowerCase(), passwordHash, req.organizationId]
    );

    const student = userResult.rows[0];
    const profileResult = await client.query(
      `INSERT INTO student_profiles(user_id,room_id,college_id,course,year,guardian_name,guardian_phone)
       VALUES($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [student.id, validRoomId, college_id || null, course || null, year ? Number(year) : null, guardian_name || null, guardian_phone || null]
    );

    await client.query("COMMIT");

    res.status(201).json({
      message: "Student account created successfully",
      user: student,
      profile: profileResult.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    console.error(error);
    if (error.code === "23505") return res.status(409).json({ message: "A user with this email already exists" });
    res.status(500).json({ message: "Unable to create student account" });
  } finally {
    client.release();
  }
};

module.exports = { listStudents, createStudent };
