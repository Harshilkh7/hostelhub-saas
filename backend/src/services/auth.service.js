const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const ACCESS_TTL = process.env.ACCESS_TOKEN_EXPIRES_IN || '15m';
const REFRESH_TTL_DAYS = 7;
const accessSecret = () => process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
const refreshSecret = () => process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
const hash = (value) => crypto.createHash('sha256').update(value).digest('hex');

async function ensureAuthSessionsTable() {
  await pool.query(`
    CREATE EXTENSION IF NOT EXISTS pgcrypto;
    CREATE TABLE IF NOT EXISTS auth_sessions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      refresh_jti_hash TEXT UNIQUE NOT NULL,
      refresh_expires_at TIMESTAMPTZ NOT NULL,
      revoked_at TIMESTAMPTZ NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_auth_sessions_user ON auth_sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_auth_sessions_active ON auth_sessions(refresh_jti_hash, revoked_at);
  `);
}
async function createTokenPair(user) {
  const sessionId = crypto.randomUUID(); const refreshJti = crypto.randomUUID();
  const refreshToken = jwt.sign({ userId: user.id, role: user.role, organizationId: user.organization_id, type: 'refresh', jti: refreshJti }, refreshSecret(), { expiresIn: `${REFRESH_TTL_DAYS}d` });
  const accessToken = jwt.sign({ userId: user.id, role: user.role, organizationId: user.organization_id, type: 'access', sid: sessionId }, accessSecret(), { expiresIn: ACCESS_TTL });
  await pool.query(`INSERT INTO auth_sessions(id,user_id,refresh_jti_hash,refresh_expires_at) VALUES($1,$2,$3,NOW()+INTERVAL '7 days')`, [sessionId, user.id, hash(refreshJti)]);
  return { accessToken, refreshToken };
}
async function rotateRefreshToken(token) {
  const decoded = jwt.verify(token, refreshSecret());
  if (decoded.type !== 'refresh' || !decoded.userId || !decoded.jti) throw new Error('Invalid refresh token');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const sessionResult = await client.query(`SELECT id FROM auth_sessions WHERE refresh_jti_hash=$1 AND user_id=$2 AND revoked_at IS NULL AND refresh_expires_at > NOW() FOR UPDATE`, [hash(decoded.jti), decoded.userId]);
    if (!sessionResult.rows.length) throw new Error('Refresh session revoked or expired');
    await client.query(`UPDATE auth_sessions SET revoked_at=NOW() WHERE id=$1`, [sessionResult.rows[0].id]);
    const userResult = await client.query(`SELECT u.*, o.name AS organization_name, o.slug AS organization_slug, o.plan, o.subscription_status FROM users u JOIN organizations o ON o.id=u.organization_id WHERE u.id=$1`, [decoded.userId]);
    if (!userResult.rows.length) throw new Error('User not found');
    const user = userResult.rows[0]; const sessionId = crypto.randomUUID(); const refreshJti = crypto.randomUUID();
    const nextRefresh = jwt.sign({ userId: user.id, role: user.role, organizationId: user.organization_id, type: 'refresh', jti: refreshJti }, refreshSecret(), { expiresIn: `${REFRESH_TTL_DAYS}d` });
    const nextAccess = jwt.sign({ userId: user.id, role: user.role, organizationId: user.organization_id, type: 'access', sid: sessionId }, accessSecret(), { expiresIn: ACCESS_TTL });
    await client.query(`INSERT INTO auth_sessions(id,user_id,refresh_jti_hash,refresh_expires_at) VALUES($1,$2,$3,NOW()+INTERVAL '7 days')`, [sessionId, user.id, hash(refreshJti)]);
    await client.query('COMMIT'); return { user, accessToken: nextAccess, refreshToken: nextRefresh };
  } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
}
async function revokeSessionByRefreshToken(token) { try { const decoded = jwt.verify(token, refreshSecret()); if (decoded.jti) await pool.query(`UPDATE auth_sessions SET revoked_at=NOW() WHERE refresh_jti_hash=$1 AND revoked_at IS NULL`, [hash(decoded.jti)]); } catch (_) {} }
module.exports = { ensureAuthSessionsTable, createTokenPair, rotateRefreshToken, revokeSessionByRefreshToken, accessSecret, refreshSecret };
