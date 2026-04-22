import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRouter from './src/server/auth.controller';
import walletRouter from './src/server/wallet.controller';
import { AppController } from './src/server/app.controller';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// --- [CORS Whitelist Middleware] ---
const whitelist = process.env.CORS_WHITELIST ? process.env.CORS_WHITELIST.split(',') : [];
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // 로컬 개발 환경이나 화이트리스트에 포함된 경우 허용
    if (!origin || whitelist.indexOf(origin) !== -1 || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
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
// 빌드된 정적 파일 서빙 (작업 디렉토리의 dist 폴더 기준)
const publicPath = path.join(process.cwd(), 'dist'); 
app.use(express.static(publicPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Merlin Family Hub Core running on http://localhost:${PORT}`);
  console.log(`🛡️  CORS Whitelist active for ${whitelist.length} domains`);
});
