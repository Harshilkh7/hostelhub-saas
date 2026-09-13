const pool = require("../config/db");

const getOverview = async (req, res) => {
  try {
    const [orgs, users, hostels, rooms, pendingLeaves, openComplaints] = await Promise.all([
      pool.query(`SELECT o.id, o.name, o.slug, o.plan, o.subscription_status,
                         o.created_at,
                         COUNT(DISTINCT u.id)::int AS user_count,
                         COUNT(DISTINCT h.id)::int AS hostel_count
                  FROM organizations o
                  LEFT JOIN users u ON u.organization_id=o.id
                  LEFT JOIN hostels h ON h.organization_id=o.id
                  GROUP BY o.id
                  ORDER BY o.created_at DESC`),
      pool.query("SELECT COUNT(*)::int AS count FROM users"),
      pool.query("SELECT COUNT(*)::int AS count FROM hostels"),
      pool.query("SELECT COUNT(*)::int AS count FROM rooms"),
      pool.query("SELECT COUNT(*)::int AS count FROM leave_requests WHERE status='PENDING'"),
      pool.query("SELECT COUNT(*)::int AS count FROM complaints WHERE status IN ('OPEN','IN_PROGRESS')"),
    ]);

    res.json({
      stats: {
        organizations: orgs.rows.length,
        users: users.rows[0].count,
        hostels: hostels.rows[0].count,
        rooms: rooms.rows[0].count,
        pendingLeaves: pendingLeaves.rows[0].count,
        openComplaints: openComplaints.rows[0].count,
      },
      organizations: orgs.rows,
    });
  } catch (error) {
    console.error("Super admin overview error:", error);
    res.status(500).json({ message: "Unable to load platform overview" });
  }
};

module.exports = { getOverview };
