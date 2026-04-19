import { Request, Response, Router } from 'express';
import { supabaseAdmin } from '../lib/supabaseServer';

/**
 * 앱 간 인증 미들웨어 (Server-to-Server)
 */
export const validateAppAccess = async (req: Request, res: Response, next: Function) => {
  const clientId = req.headers['x-client-id'] as string;
  const clientSecret = req.headers['x-client-secret'] as string;

  if (!clientId || !clientSecret) {
    return res.status(401).json({ error: 'App credentials required' });
  }

  const { data, error } = await supabaseAdmin
    .from('family_apps')
    .select('id, status')
    .eq('client_id', clientId)
    .eq('client_secret', clientSecret)
    .single();

  if (error || !data || data.status !== 'active') {
    return res.status(401).json({ error: 'Invalid or inactive App credentials' });
  }

  // 요청 객체에 app_id 저장
  (req as any).appId = data.id;
  next();
};
