const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const createToken = (user) => jwt.sign(
  {
    userId: user.id,
    role: user.role,
    organizationId: user.organization_id,
  },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);

const register = async (req, res) => {
  const client = await pool.connect();
  try {
    const { name, email, password, organizationName } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    await client.query("BEGIN");
    const existingUser = await client.query("SELECT id FROM users WHERE email=$1", [email]);
    if (existingUser.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Email already exists" });
    }

    const slugBase = (organizationName || `${name}'s Hostel`)
      .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 150) || "hostel";
    const slug = `${slugBase}-${Date.now().toString(36)}`;
    const orgResult = await client.query(
      `INSERT INTO organizations(name, slug) VALUES($1,$2) RETURNING id,name,slug,plan,subscription_status`,
      [organizationName || `${name}'s Hostel`, slug]
    );

    const hashedPassword = await bcrypt.hash(password, 12);
    const userResult = await client.query(
      `INSERT INTO users(name,email,password_hash,role,organization_id)
       VALUES($1,$2,$3,'HOSTEL_ADMIN',$4)
       RETURNING id,name,email,role,organization_id`,
      [name, email, hashedPassword, orgResult.rows[0].id]
    );

    await client.query(
      `INSERT INTO subscriptions(organization_id,plan,status) VALUES($1,'FREE','active') ON CONFLICT (organization_id) DO NOTHING`,
      [orgResult.rows[0].id]
    );
    await client.query("COMMIT");

    const user = userResult.rows[0];
    res.status(201).json({ token: createToken(user), user, organization: orgResult.rows[0] });
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  } finally {
    client.release();
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query(
      `SELECT u.*, o.name AS organization_name, o.slug AS organization_slug, o.plan,
              o.subscription_status
       FROM users u JOIN organizations o ON o.id=u.organization_id WHERE u.email=$1`,
      [email]
    );
    if (result.rows.length === 0) return res.status(401).json({ message: "Invalid credentials" });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = createToken(user);
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, organizationId: user.organization_id },
      organization: {
        id: user.organization_id, name: user.organization_name, slug: user.organization_slug,
        plan: user.plan, subscriptionStatus: user.subscription_status,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { register, login };
