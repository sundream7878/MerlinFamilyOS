import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRouter from './src/server/auth.controller';
import walletRouter from './src/server/wallet.controller';
import { AppController } from './src/server/app.controller';

// --- [Environment Check] ---
const requiredEnv = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'RESEND_API_KEY', 'JWT_SECRET'];
requiredEnv.forEach(key => {
  if (!process.env[key]) {
    console.error(`❌ Missing Environment Variable: ${key}`);
  } else {
    console.log(`✅ Loaded: ${key} (${process.env[key].substring(0, 5)}...)`);
  }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// --- [CORS Whitelist Middleware] ---
const whitelist = process.env.CORS_WHITELIST ? process.env.CORS_WHITELIST.split(',') : [];
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // 로컬 개발 환경, 동일 출처(Origin), 또는 화이트리스트 포함 시 허용
    const isSameOrigin = origin && origin.includes('onrender.com'); // 렌더 도메인 자동 허용
    if (!origin || isSameOrigin || whitelist.indexOf(origin) !== -1 || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      console.warn(`🛑 CORS Blocked for origin: ${origin}`);
      callback(new Error('Not allowed by CORS Gateway'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-client-id', 'x-client-secret']
};

app.use(cors(corsOptions));
app.use(express.json());

// --- [API Routes] ---
app.use('/api/auth', authRouter);
app.use('/api/wallet', walletRouter);
app.use('/api/apps', AppController);

// --- [Production Static Files] ---
const publicPath = path.resolve(process.cwd(), 'dist');
console.log(`📂 Static files path: ${publicPath}`);

// API 외의 정적 파일 우선 서빙
app.use(express.static(publicPath));

// API 외의 모든 경로는 index.html로 리다이렉트 (SPA 지원)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  
  const indexPath = path.join(publicPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error(`❌ Failed to send index.html: ${err.message}`);
      res.status(500).send("Frontend build not found. Please check deployment logs.");
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Merlin Family Hub Core running on http://localhost:${PORT}`);
  console.log(`🛡️  CORS Whitelist active for ${whitelist.length} domains`);
});
