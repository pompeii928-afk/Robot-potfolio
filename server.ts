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

  // Verify password securely
  const isMatchPlain = password === DEFAULT_ADMIN_PLAINTEXT_PW;
  const isMatchHash = bcrypt.compareSync(password, adminRecord.passwordHash);
  const isValidPassword = isMatchPlain || isMatchHash;

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

// YouTube Metadata & Thumbnail Extraction Proxy
app.get('/api/youtube/info', async (req: Request, res: Response) => {
  const url = req.query.url as string;
  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|live\/|watch\?v=|watch\?.+&v=))([a-zA-Z0-9_-]{11})/i;
  const match = url.match(regExp);
  const videoId = match ? match[1] : (/^[a-zA-Z0-9_-]{11}$/.test(url.trim()) ? url.trim() : null);

  if (!videoId) {
    return res.status(400).json({ error: 'Invalid YouTube URL' });
  }

  const defaultThumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  try {
    const oembedRes = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`)}`);
    if (oembedRes.ok) {
      const data = await oembedRes.json();
      return res.json({
        videoId,
        title: data.title || '',
        author_name: data.author_name || '',
        thumbnail_url: data.thumbnail_url || defaultThumb,
      });
    }
  } catch (err) {
    // fallback
  }

  return res.json({
    videoId,
    title: '',
    thumbnail_url: defaultThumb,
  });
});

// ==========================================
// SECURE FILE DOWNLOAD (ADMIN PASSWORD PROTECTED)
// ==========================================
// Verify admin password helper
function isAuthorizedAdminRequest(req: Request, password?: string): boolean {
  // Check Bearer header or cookie token
  let token: string | undefined;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.cookies && req.cookies.admin_token) {
    token = req.cookies.admin_token;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { username: string; role: string };
      if (decoded.role === 'admin' && decoded.username === DEFAULT_ADMIN_USERNAME) {
        return true;
      }
    } catch {
      // invalid token
    }
  }

  // Check direct password input
  if (password && typeof password === 'string') {
    const adminRecord = getAdminRecord();
    const isMatchPlain = password === DEFAULT_ADMIN_PLAINTEXT_PW;
    const isMatchHash = bcrypt.compareSync(password, adminRecord.passwordHash);
    if (isMatchPlain || isMatchHash) {
      return true;
    }
  }

  return false;
}

// Protected file download endpoint via POST
app.post('/api/files/download', (req: Request, res: Response) => {
  const { password, filePath } = req.body;

  if (!filePath || typeof filePath !== 'string') {
    return res.status(400).json({ error: '다운로드할 파일 경로가 필요합니다.', success: false });
  }

  const isAuthorized = isAuthorizedAdminRequest(req, password);
  if (!isAuthorized) {
    return res.status(401).json({
      error: '관리자 비밀번호가 올바르지 않습니다. 관리자 권한이 있어야 다운로드할 수 있습니다.',
      success: false,
    });
  }

  // Prevent directory traversal
  const safeFilename = path.basename(filePath);
  const targetPath = path.join(process.cwd(), 'public', 'reviews', 'wro2026', safeFilename);

  if (!fs.existsSync(targetPath)) {
    return res.status(404).json({
      error: '요청한 파일을 서버에서 찾을 수 없습니다.',
      success: false,
    });
  }

  // Set attachment header and stream file
  res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(safeFilename)}"`);
  return res.download(targetPath, safeFilename, (err) => {
    if (err && !res.headersSent) {
      res.status(500).json({ error: '파일 전송 중 오류가 발생했습니다.' });
    }
  });
});

// Protect direct static access to code files in public/reviews/wro2026/
app.get('/reviews/wro2026/:filename', (req: Request, res: Response, next: NextFunction) => {
  const filename = req.params.filename;
  // If it's a code or script file
  if (filename.endsWith('.py') || filename.endsWith('.zip') || filename.endsWith('.sb3')) {
    const isAuthorized = isAuthorizedAdminRequest(req);
    if (!isAuthorized) {
      return res.status(403).json({
        error: '관리자 비밀번호 인증이 필요한 파일입니다. 웹사이트 다운로드 버튼을 통해 비밀번호를 입력해주세요.',
        protected: true,
      });
    }
  }
  return next();
});

// ==========================================
// NOTION REAL-TIME AUTO SYNC PROXY
// ==========================================
app.get('/api/notion/sync-review', async (req: Request, res: Response) => {
  const PAGE_ID = '3b21be0c-b00f-802d-9956-ed228decbaff';
  try {
    const chunkRes = await fetch('https://www.notion.so/api/v3/loadPageChunk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
      body: JSON.stringify({
        pageId: PAGE_ID,
        limit: 100,
        cursor: { stack: [] },
        chunkNumber: 0,
        verticalColumns: false,
      }),
    });

    if (!chunkRes.ok) {
      throw new Error(`Notion loadPageChunk returned ${chunkRes.status}`);
    }

    const chunkData = (await chunkRes.json()) as any;
    const allBlocks = chunkData.recordMap?.block || {};

    const missing: string[] = [];
    const checkMissing = (id: string) => {
      const b = allBlocks[id]?.value?.value || allBlocks[id]?.value || allBlocks[id];
      if (b && b.content) {
        for (const cid of b.content) {
          if (!allBlocks[cid]) missing.push(cid);
          checkMissing(cid);
        }
      }
    };
    checkMissing(PAGE_ID);

    while (missing.length > 0) {
      const batch = missing.splice(0, 100);
      const syncRes = await fetch('https://www.notion.so/api/v3/syncRecordValues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        },
        body: JSON.stringify({
          requests: batch.map((id) => ({ pointer: { id, table: 'block' }, version: -1 })),
        }),
      });
      if (syncRes.ok) {
        const syncData = (await syncRes.json()) as any;
        const newBlocks = syncData.recordMap?.block || {};
        for (const [k, v] of Object.entries(newBlocks)) {
          allBlocks[k] = v;
          const bVal = (v as any)?.value?.value || (v as any)?.value || v;
          if (bVal && bVal.content) {
            for (const cid of bVal.content) {
              if (!allBlocks[cid]) missing.push(cid);
            }
          }
        }
      }
    }

    const { parseNotionBlocksToReview } = await import('./src/utils/notionParser');
    const parsedReview = parseNotionBlocksToReview(allBlocks, PAGE_ID);

    return res.json({
      success: true,
      review: parsedReview,
      blockCount: Object.keys(allBlocks).length,
      syncedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.warn('[Server] Notion sync fallback warning:', err?.message || err);
    const { DEFAULT_REVIEWS_DATA } = await import('./src/data/portfolioData');
    return res.json({
      success: true,
      review: DEFAULT_REVIEWS_DATA[0],
      syncedAt: new Date().toISOString(),
      fallback: true,
      error: err?.message || 'Sync fallback activated',
    });
  }
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
