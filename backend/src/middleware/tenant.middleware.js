const pool = require("../config/db");

const requireTenant = async (req, res, next) => {
  try {
    if (!req.user?.organizationId) {
      return res.status(403).json({ message: "Organization context missing" });
    }

    const result = await pool.query(
      "SELECT id, name, slug, plan, subscription_status FROM organizations WHERE id=$1",
      [req.user.organizationId]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ message: "Organization not found" });
    }

    req.organization = result.rows[0];
    req.organizationId = result.rows[0].id;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to resolve organization" });
  }
};

module.exports = requireTenant;
