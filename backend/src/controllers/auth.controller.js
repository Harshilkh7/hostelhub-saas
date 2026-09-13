const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const { createTokenPair, rotateRefreshToken, revokeSessionByRefreshToken, accessSecret } = require("../services/auth.service");

const ACCESS_COOKIE = "accessToken";
const REFRESH_COOKIE = "refreshToken";

function parseCookies(req) {
  const header = req.headers.cookie || "";
  return header.split(";").reduce((out, part) => {
    const i = part.indexOf("=");
    if (i < 0) return out;
    out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
    return out;
  }, {});
}

function cookieAttributes(maxAge) {
  const production = process.env.NODE_ENV === "production";
  return `Max-Age=${Math.floor(maxAge / 1000)}; Path=/; HttpOnly; SameSite=${production ? "None" : "Lax"}${production ? "; Secure" : ""}`;
}
function setAuthCookies(res, accessToken, refreshToken) {
  res.append("Set-Cookie", `${ACCESS_COOKIE}=${encodeURIComponent(accessToken)}; ${cookieAttributes(15 * 60 * 1000)}`);
  res.append("Set-Cookie", `${REFRESH_COOKIE}=${encodeURIComponent(refreshToken)}; ${cookieAttributes(7 * 24 * 60 * 60 * 1000)}`);
}
function clearAuthCookies(res) {
  const production = process.env.NODE_ENV === "production";
  const attrs = `Max-Age=0; Path=/; HttpOnly; SameSite=${production ? "None" : "Lax"}${production ? "; Secure" : ""}`;
  res.append("Set-Cookie", `${ACCESS_COOKIE}=; ${attrs}`);
  res.append("Set-Cookie", `${REFRESH_COOKIE}=; ${attrs}`);
}

const publicUser = (user) => ({ id: user.id, name: user.name, email: user.email, role: user.role, organizationId: user.organization_id });
const publicOrganization = (user) => ({ id: user.organization_id, name: user.organization_name, slug: user.organization_slug, plan: user.plan, subscriptionStatus: user.subscription_status });

const register = async (req, res) => {
  const client = await pool.connect();
  try {
    const { name, email, password, organizationName } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Name, email and password are required" });
    if (password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters" });
    await client.query("BEGIN");
    const existingUser = await client.query("SELECT id FROM users WHERE email=$1", [email]);
    if (existingUser.rows.length) { await client.query("ROLLBACK"); return res.status(400).json({ message: "Email already exists" }); }
    const slugBase = (organizationName || `${name}'s Hostel`).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 150) || "hostel";
    const slug = `${slugBase}-${Date.now().toString(36)}`;
    const orgResult = await client.query(`INSERT INTO organizations(name, slug) VALUES($1,$2) RETURNING id,name,slug,plan,subscription_status`, [organizationName || `${name}'s Hostel`, slug]);
    const hashedPassword = await bcrypt.hash(password, 12);
    const userResult = await client.query(`INSERT INTO users(name,email,password_hash,role,organization_id) VALUES($1,$2,$3,'HOSTEL_ADMIN',$4) RETURNING id,name,email,role,organization_id`, [name, email, hashedPassword, orgResult.rows[0].id]);
    await client.query(`INSERT INTO subscriptions(organization_id,plan,status) VALUES($1,'FREE','active') ON CONFLICT (organization_id) DO NOTHING`, [orgResult.rows[0].id]);
    await client.query("COMMIT");
    const user = userResult.rows[0];
    const { accessToken, refreshToken } = await createTokenPair(user);
    setAuthCookies(res, accessToken, refreshToken);
    res.status(201).json({ user: publicUser(user), organization: orgResult.rows[0] });
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  } finally { client.release(); }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query(`SELECT u.*, o.name AS organization_name, o.slug AS organization_slug, o.plan, o.subscription_status FROM users u JOIN organizations o ON o.id=u.organization_id WHERE u.email=$1`, [email]);
    if (!result.rows.length) return res.status(401).json({ message: "Invalid credentials" });
    const user = result.rows[0];
    if (!(await bcrypt.compare(password, user.password_hash))) return res.status(401).json({ message: "Invalid credentials" });
    const { accessToken, refreshToken } = await createTokenPair(user);
    setAuthCookies(res, accessToken, refreshToken);
    res.json({ user: publicUser(user), organization: publicOrganization(user) });
  } catch (error) { console.error(error); res.status(500).json({ message: "Server Error" }); }
};

const refresh = async (req, res) => {
  try {
    const cookies = parseCookies(req);
    if (!cookies[REFRESH_COOKIE]) return res.status(401).json({ message: "Refresh token required" });
    const result = await rotateRefreshToken(cookies[REFRESH_COOKIE]);
    setAuthCookies(res, result.accessToken, result.refreshToken);
    res.json({ user: publicUser(result.user), organization: publicOrganization(result.user) });
  } catch (error) { res.status(401).json({ message: "Invalid or expired refresh token" }); }
};

const logout = async (req, res) => {
  const cookies = parseCookies(req);
  await revokeSessionByRefreshToken(cookies[REFRESH_COOKIE]);
  clearAuthCookies(res);
  res.json({ message: "Logged out successfully" });
};

const me = async (req, res) => {
  try {
    const result = await pool.query(`SELECT u.*, o.name AS organization_name, o.slug AS organization_slug, o.plan, o.subscription_status FROM users u JOIN organizations o ON o.id=u.organization_id WHERE u.id=$1`, [req.user.userId]);
    if (!result.rows.length) return res.status(401).json({ message: "User not found" });
    const user = result.rows[0];
    res.json({ user: publicUser(user), organization: publicOrganization(user) });
  } catch (error) { res.status(500).json({ message: "Server Error" }); }
};

module.exports = { register, login, refresh, logout, me, parseCookies, ACCESS_COOKIE, accessSecret };
