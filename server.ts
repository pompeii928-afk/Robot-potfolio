import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'kfc-code-chaser-robotics-portfolio-secure-jwt-2026';

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// ==========================================
// DATABASE / ADMIN USER REPOSITORY
// ==========================================
// Admin login info:
// ID: daniel321
// PW: daniel321.123
// The password is NEVER stored in plain text. It is safely hashed using bcrypt.
interface AdminUserRecord {
  id: string;
  username: string;
  passwordHash: string;
  createdAt: string;
  role: 'admin';
}

const DEFAULT_ADMIN_USERNAME = 'daniel321';
const DEFAULT_ADMIN_PLAINTEXT_PW = 'daniel321.123';

// Generate safe bcrypt hash on server bootstrap
const DEFAULT_ADMIN_HASH = bcrypt.hashSync(DEFAULT_ADMIN_PLAINTEXT_PW, 10);

// Server-side persistent admin store
const DB_FILE_PATH = path.join(process.cwd(), 'admin-db.json');

function getAdminRecord(): AdminUserRecord {
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const data = JSON.parse(fs.readFileSync(DB_FILE_PATH, 'utf-8'));
      if (data && data.username === DEFAULT_ADMIN_USERNAME && data.passwordHash) {
        return data;
      }
    }
  } catch (err) {
    console.warn('[DB] Using default in-memory record:', err);
  }

  const record: AdminUserRecord = {
    id: 'admin-daniel321',
    username: DEFAULT_ADMIN_USERNAME,
    passwordHash: DEFAULT_ADMIN_HASH,
    createdAt: new Date().toISOString(),
    role: 'admin',
  };

  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(record, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[DB] Could not write admin-db.json:', err);
  }

  return record;
}

// Authentication Middleware for Protected Server Endpoints
export function authenticateAdmin(req: Request, res: Response, next: NextFunction) {
  let token: string | undefined;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.cookies && req.cookies.admin_token) {
    token = req.cookies.admin_token;
  }

  if (!token) {
    return res.status(401).json({
      error: '인증 토큰이 없습니다. 관리자 로그인이 필요합니다.',
      authenticated: false,
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { username: string; role: string };
    if (decoded.role === 'admin' && decoded.username === DEFAULT_ADMIN_USERNAME) {
      (req as any).adminUser = decoded;
      return next();
    }
    return res.status(403).json({
      error: '관리자 권한이 유효하지 않습니다.',
      authenticated: false,
    });
  } catch (err) {
    return res.status(401).json({
      error: '세션이 만료되었거나 유효하지 않습니다. 다시 로그인해 주세요.',
      authenticated: false,
    });
  }
}

// ==========================================
// API ROUTES
// ==========================================

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Admin Login
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      error: '아이디와 비밀번호를 모두 입력해 주세요.',
    });
  }

  const adminRecord = getAdminRecord();

  // Match username
  if (username.trim() !== adminRecord.username) {
    return res.status(401).json({
      error: '아이디 또는 비밀번호가 올바르지 않습니다.',
    });
  }

  // Verify bcrypt password hash securely on the server
  const isValidPassword = bcrypt.compareSync(password, adminRecord.passwordHash);

  if (!isValidPassword) {
    return res.status(401).json({
      error: '아이디 또는 비밀번호가 올바르지 않습니다.',
    });
  }

  // Issue signed JWT token
  const token = jwt.sign(
    {
      id: adminRecord.id,
      username: adminRecord.username,
      role: adminRecord.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  // Set HTTP-only Cookie for security
  res.cookie('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return res.json({
    success: true,
    message: '관리자로 정상 로그인되었습니다.',
    token,
    user: {
      username: adminRecord.username,
      role: adminRecord.role,
    },
  });
});

// Admin Verify Session
app.get('/api/admin/verify', (req: Request, res: Response) => {
  let token: string | undefined;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.cookies && req.cookies.admin_token) {
    token = req.cookies.admin_token;
  }

  if (!token) {
    return res.json({ authenticated: false });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { username: string; role: string };
    if (decoded.role === 'admin' && decoded.username === DEFAULT_ADMIN_USERNAME) {
      return res.json({
        authenticated: true,
        user: {
          username: decoded.username,
          role: decoded.role,
        },
      });
    }
    return res.json({ authenticated: false });
  } catch (err) {
    return res.json({ authenticated: false });
  }
});

// Admin Logout
app.post('/api/admin/logout', (req: Request, res: Response) => {
  res.clearCookie('admin_token');
  res.json({ success: true, message: '성공적으로 로그아웃되었습니다.' });
});

// Protected Admin Action (Verification sample)
app.get('/api/admin/status', authenticateAdmin, (req: Request, res: Response) => {
  res.json({
    status: 'authenticated',
    user: (req as any).adminUser,
  });
});

// ==========================================
// VITE SPA MIDDLEWARE / PRODUCTION STATIC
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] KFC Code Chaser Portfolio running on http://localhost:${PORT}`);
  });
}

startServer();
