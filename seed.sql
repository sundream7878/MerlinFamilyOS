-- Merlin Family Hub: 초기 패밀리 앱 등록 (Seed Data)
-- 주의: 실제 운영 환경에서는 client_secret을 더욱 안전하게 관리해야 합니다.

INSERT INTO public.family_apps (app_name, client_id, client_secret, status)
VALUES 
    ('Merlin Hub Dashboard', 'merlin-hub-admin', 'hub-secret-2026', 'active'),
    ('Photo Curation App (Bes2)', 'bes2-photo-app', 'bes2-secret-777', 'active'),
    ('Aggro Filter (Chrome Ext)', 'aggro-filter-app', 'aggro-secret-123', 'active'),
    ('Travel Log App', 'travel-log-app', 'travel-secret-888', 'active'),
    ('Family Wallet App', 'family-wallet-ui', 'wallet-secret-999', 'active'),
    ('Merlin AI Lab', 'merlin-ai-lab', 'lab-secret-000', 'active')
ON CONFLICT (client_id) DO NOTHING;

-- 시스템 내부용 App ID (Hub 자체 보상 등)
INSERT INTO public.family_apps (id, app_name, client_id, client_secret, status)
VALUES 
    ('00000000-0000-0000-0000-000000000000', 'Merlin Family System', 'system-internal', 'system-exclusive', 'active')
ON CONFLICT (id) DO NOTHING;
