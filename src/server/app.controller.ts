import { Request, Response, Router } from 'express';
import { AppService } from './app.service';

const router = Router();

/**
 * [GET] /api/apps
 * 앱 목록 및 권한 정보 조회
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const apps = await AppService.listApps();
    res.json(apps);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * [GET] /api/apps/users
 * 전체 사용자 목록 조회
 */
router.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await AppService.listUsers();
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * [POST] /api/apps/:id/scopes
 * 특정 앱의 권한 정보 업데이트
 */
router.post('/:id/scopes', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { scopes } = req.body; // Array of { scope, description }
    
    await AppService.updateAppScopes(id, scopes);
    res.json({ message: 'Scopes updated successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export const AppController = router;
