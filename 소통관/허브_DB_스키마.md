| table_name                 | column_name        | data_type                | is_nullable |
| -------------------------- | ------------------ | ------------------------ | ----------- |
| family_app_scopes          | id                 | uuid                     | NO          |
| family_app_scopes          | app_id             | uuid                     | YES         |
| family_app_scopes          | scope              | text                     | NO          |
| family_app_scopes          | description        | text                     | YES         |
| family_app_scopes          | created_at         | timestamp with time zone | YES         |
| family_apps                | id                 | uuid                     | NO          |
| family_apps                | client_id          | text                     | NO          |
| family_apps                | client_secret      | text                     | NO          |
| family_apps                | app_name           | text                     | NO          |
| family_apps                | status             | text                     | YES         |
| family_apps                | created_at         | timestamp with time zone | YES         |
| family_otp                 | id                 | uuid                     | NO          |
| family_otp                 | email              | text                     | NO          |
| family_otp                 | otp_code           | text                     | NO          |
| family_otp                 | expires_at         | timestamp with time zone | NO          |
| family_otp                 | is_used            | boolean                  | YES         |
| family_otp                 | created_at         | timestamp with time zone | YES         |
| family_transfer_codes      | id                 | uuid                     | NO          |
| family_transfer_codes      | user_id            | uuid                     | NO          |
| family_transfer_codes      | transfer_code      | text                     | NO          |
| family_transfer_codes      | expires_at         | timestamp with time zone | NO          |
| family_transfer_codes      | is_used            | boolean                  | YES         |
| family_transfer_codes      | created_at         | timestamp with time zone | YES         |
| family_user_registrations  | id                 | uuid                     | NO          |
| family_user_registrations  | user_id            | uuid                     | YES         |
| family_user_registrations  | app_id             | text                     | NO          |
| family_user_registrations  | reward_stage       | integer                  | YES         |
| family_user_registrations  | last_registered_at | timestamp with time zone | YES         |
| family_users               | id                 | uuid                     | NO          |
| family_users               | email              | text                     | NO          |
| family_users               | nickname           | text                     | YES         |
| family_users               | admin_memo         | text                     | YES         |
| family_users               | created_at         | timestamp with time zone | YES         |
| family_users               | region             | text                     | YES         |
| family_users               | first_app_id       | text                     | YES         |
| family_users               | avatar_url         | text                     | YES         |
| family_users               | updated_at         | timestamp with time zone | YES         |
| family_wallet_balances     | user_id            | uuid                     | NO          |
| family_wallet_balances     | balance            | bigint                   | NO          |
| family_wallet_balances     | updated_at         | timestamp with time zone | YES         |
| family_wallet_logs         | id                 | uuid                     | NO          |
| family_wallet_logs         | user_id            | uuid                     | NO          |
| family_wallet_logs         | app_id             | uuid                     | NO          |
| family_wallet_logs         | amount             | bigint                   | NO          |
| family_wallet_logs         | type               | text                     | NO          |
| family_wallet_logs         | request_id         | text                     | NO          |
| family_wallet_logs         | display_text       | text                     | YES         |
| family_wallet_logs         | created_at         | timestamp with time zone | YES         |
| family_wallet_transactions | id                 | uuid                     | NO          |
| family_wallet_transactions | user_id            | uuid                     | YES         |
| family_wallet_transactions | app_id             | text                     | NO          |
| family_wallet_transactions | amount             | bigint                   | NO          |
| family_wallet_transactions | request_id         | text                     | NO          |
| family_wallet_transactions | transaction_type   | text                     | NO          |
| family_wallet_transactions | display_text       | text                     | YES         |
| family_wallet_transactions | created_at         | timestamp with time zone | YES         |