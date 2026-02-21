require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const pino = require('pino');
const pinoHttp = require('pino-http');

const app = express();
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

const allowedOrigins = (process.env.CORS_ORIGINS || '').split(',').filter(Boolean);

app.use(helmet());
app.use(cors({
  origin: allowedOrigins.length ? allowedOrigins : false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));
app.use(pinoHttp({ logger }));

const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Missing authorization token' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    return next();
  } catch (error) {
    req.log.warn({ err: error }, 'Invalid JWT');
    return res.status(401).json({ message: 'Invalid token' });
  }
};

app.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT 1 as ok');
    res.status(200).json({
      status: 'ok',
      database: result.rows[0].ok === 1 ? 'up' : 'down',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    req.log.error({ err: error }, 'Health check failed');
    res.status(503).json({ status: 'degraded', database: 'down' });
  }
});

app.post('/auth/register', async (req, res) => {
  const { email, password, fullName } = req.body;

  if (!email || !password || !fullName) {
    return res.status(400).json({ message: 'email, password, and fullName are required' });
  }

  try {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rowCount > 0) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const inserted = await pool.query(
      'INSERT INTO users (email, password_hash, full_name) VALUES ($1, $2, $3) RETURNING id, email, full_name, created_at',
      [email, passwordHash, fullName]
    );

    return res.status(201).json({ user: inserted.rows[0] });
  } catch (error) {
    req.log.error({ err: error }, 'Failed to register user');
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' });
  }

  try {
    const result = await pool.query('SELECT id, email, password_hash, full_name FROM users WHERE email = $1', [email]);
    if (result.rowCount === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const matched = await bcrypt.compare(password, user.password_hash);
    if (!matched) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { sub: user.id, email: user.email, name: user.full_name },
      process.env.JWT_SECRET,
      { expiresIn: '1h', issuer: 'project-management-api' }
    );

    return res.status(200).json({ token });
  } catch (error) {
    req.log.error({ err: error }, 'Failed to login user');
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/projects', authMiddleware, async (req, res) => {
  try {
    const projects = await pool.query(
      `SELECT id, name, description, owner_id, status, due_date, created_at
       FROM projects
       WHERE owner_id = $1
       ORDER BY created_at DESC`,
      [req.user.sub]
    );

    return res.status(200).json({ data: projects.rows });
  } catch (error) {
    req.log.error({ err: error }, 'Failed to list projects');
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/projects', authMiddleware, async (req, res) => {
  const { name, description, dueDate } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'name is required' });
  }

  try {
    const inserted = await pool.query(
      `INSERT INTO projects (name, description, owner_id, due_date)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, description, owner_id, status, due_date, created_at`,
      [name, description || null, req.user.sub, dueDate || null]
    );

    return res.status(201).json({ data: inserted.rows[0] });
  } catch (error) {
    req.log.error({ err: error }, 'Failed to create project');
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.use((error, req, res, next) => {
  req.log.error({ err: error }, 'Unhandled error');
  res.status(500).json({ message: 'Internal server error' });
  next();
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  logger.info({ port }, 'Backend service listening');
});