| table_name              | column_name                  | data_type                   | is_nullable |
| ----------------------- | ---------------------------- | --------------------------- | ----------- |
| bot_aggro_keywords      | id                           | integer                     | NO          |
| bot_aggro_keywords      | group_name                   | text                        | NO          |
| bot_aggro_keywords      | keywords                     | ARRAY                       | NO          |
| bot_aggro_keywords      | is_active                    | boolean                     | YES         |
| bot_aggro_keywords      | created_at                   | timestamp with time zone    | YES         |
| bot_aggro_keywords      | updated_at                   | timestamp with time zone    | YES         |
| bot_comment_logs        | id                           | integer                     | NO          |
| bot_comment_logs        | target_type                  | text                        | NO          |
| bot_comment_logs        | target_id                    | text                        | NO          |
| bot_comment_logs        | target_url                   | text                        | YES         |
| bot_comment_logs        | video_id                     | text                        | YES         |
| bot_comment_logs        | grade                        | text                        | YES         |
| bot_comment_logs        | generated_text               | text                        | NO          |
| bot_comment_logs        | status                       | text                        | NO          |
| bot_comment_logs        | error_message                | text                        | YES         |
| bot_comment_logs        | posted_at                    | timestamp with time zone    | YES         |
| bot_comment_logs        | created_at                   | timestamp with time zone    | NO          |
| bot_community_targets   | id                           | integer                     | NO          |
| bot_community_targets   | url                          | text                        | NO          |
| bot_community_targets   | keywords                     | ARRAY                       | NO          |
| bot_community_targets   | is_active                    | boolean                     | NO          |
| bot_community_targets   | note                         | text                        | YES         |
| bot_community_targets   | created_at                   | timestamp with time zone    | NO          |
| bot_community_targets   | updated_at                   | timestamp with time zone    | NO          |
| bot_community_targets   | community_type               | text                        | YES         |
| bot_community_targets   | community_name               | text                        | YES         |
| bot_community_targets   | nickname                     | text                        | YES         |
| bot_community_targets   | login_id                     | text                        | YES         |
| bot_community_targets   | login_pw                     | text                        | YES         |
| bot_community_targets   | post_limit                   | integer                     | YES         |
| bot_community_targets   | keywords_global              | ARRAY                       | YES         |
| bot_keyword_videos      | id                           | integer                     | NO          |
| bot_keyword_videos      | video_id                     | character varying           | NO          |
| bot_keyword_videos      | title                        | text                        | YES         |
| bot_keyword_videos      | channel_id                   | character varying           | YES         |
| bot_keyword_videos      | channel_name                 | character varying           | YES         |
| bot_keyword_videos      | keyword                      | character varying           | YES         |
| bot_keyword_videos      | ollama_score                 | integer                     | YES         |
| bot_keyword_videos      | collected_at                 | timestamp without time zone | YES         |
| bot_keyword_videos      | analyzed_at                  | timestamp without time zone | YES         |
| t_analyses              | f_id                         | uuid                        | NO          |
| t_analyses              | f_video_url                  | text                        | NO          |
| t_analyses              | f_video_id                   | text                        | NO          |
| t_analyses              | f_title                      | text                        | NO          |
| t_analyses              | f_channel_id                 | text                        | YES         |
| t_analyses              | f_thumbnail_url              | text                        | YES         |
| t_analyses              | f_transcript                 | text                        | YES         |
| t_analyses              | f_accuracy_score             | integer                     | YES         |
| t_analyses              | f_clickbait_score            | integer                     | YES         |
| t_analyses              | f_reliability_score          | integer                     | YES         |
| t_analyses              | f_summary                    | text                        | YES         |
| t_analyses              | f_evaluation_reason          | text                        | YES         |
| t_analyses              | f_overall_assessment         | text                        | YES         |
| t_analyses              | f_ai_title_recommendation    | text                        | YES         |
| t_analyses              | f_user_id                    | text                        | YES         |
| t_analyses              | f_created_at                 | timestamp with time zone    | YES         |
| t_analyses              | f_updated_at                 | timestamp with time zone    | YES         |
| t_analyses              | f_request_count              | integer                     | YES         |
| t_analyses              | f_view_count                 | integer                     | YES         |
| t_analyses              | f_last_action_at             | timestamp with time zone    | YES         |
| t_analyses              | f_official_category_id       | integer                     | YES         |
| t_analyses              | f_is_latest                  | boolean                     | YES         |
| t_analyses              | f_is_recheck                 | boolean                     | YES         |
| t_analyses              | f_recheck_parent_analysis_id | text                        | YES         |
| t_analyses              | f_recheck_at                 | timestamp without time zone | YES         |
| t_analyses              | f_language                   | character varying           | YES         |
| t_analyses              | f_grounding_used             | boolean                     | YES         |
| t_analyses              | f_grounding_queries          | ARRAY                       | YES         |
| t_analyses              | f_published_at               | timestamp without time zone | YES         |
| t_analyses              | f_not_analyzable             | boolean                     | YES         |
| t_analyses              | f_not_analyzable_reason      | text                        | YES         |
| t_analyses              | f_is_valid                   | boolean                     | YES         |
| t_analyses              | f_needs_review               | boolean                     | YES         |
| t_analyses              | f_review_reason              | text                        | YES         |
| t_analyses              | f_fact_spoiler               | text                        | YES         |
| t_analyses              | f_fact_timestamp             | text                        | YES         |
| t_categories            | f_id                         | integer                     | NO          |
| t_categories            | f_name_ko                    | character varying           | NO          |
| t_categories            | f_name_en                    | character varying           | NO          |
| t_categories            | f_is_garbage                 | boolean                     | YES         |
| t_categories            | f_created_at                 | timestamp without time zone | YES         |
| t_channel_stats         | f_channel_id                 | text                        | NO          |
| t_channel_stats         | f_official_category_id       | integer                     | NO          |
| t_channel_stats         | f_language                   | character varying           | NO          |
| t_channel_stats         | f_video_count                | integer                     | YES         |
| t_channel_stats         | f_avg_accuracy               | numeric                     | YES         |
| t_channel_stats         | f_avg_clickbait              | numeric                     | YES         |
| t_channel_stats         | f_avg_reliability            | numeric                     | YES         |
| t_channel_stats         | f_last_updated               | timestamp with time zone    | YES         |
| t_channel_subscriptions | f_id                         | bigint                      | NO          |
| t_channel_subscriptions | f_user_id                    | text                        | NO          |
| t_channel_subscriptions | f_channel_id                 | text                        | NO          |
| t_channel_subscriptions | f_subscribed_at              | timestamp without time zone | YES         |
| t_channel_subscriptions | f_last_rank                  | integer                     | YES         |
| t_channel_subscriptions | f_last_rank_checked_at       | timestamp without time zone | YES         |
| t_channel_subscriptions | f_last_reliability_grade     | character varying           | YES         |
| t_channel_subscriptions | f_last_reliability_score     | integer                     | YES         |
| t_channel_subscriptions | f_last_top10_percent_status  | boolean                     | YES         |
| t_channel_subscriptions | f_notification_enabled       | boolean                     | YES         |
| t_channel_subscriptions | f_top10_notified_at          | timestamp with time zone    | YES         |
| t_channels              | f_channel_id                 | character varying           | NO          |
| t_channels              | f_title                      | character varying           | NO          |
| t_channels              | f_thumbnail_url              | text                        | YES         |
| t_channels              | f_official_category_id       | integer                     | YES         |
| t_channels              | f_custom_category_id         | integer                     | YES         |
| t_channels              | f_trust_score                | integer                     | YES         |
| t_channels              | f_trust_grade                | character varying           | YES         |
| t_channels              | f_video_count                | integer                     | YES         |
| t_channels              | f_subscriber_count           | bigint                      | YES         |
| t_channels              | f_last_analyzed_at           | timestamp with time zone    | YES         |
| t_channels              | f_created_at                 | timestamp with time zone    | YES         |
| t_channels              | f_updated_at                 | timestamp with time zone    | YES         |
| t_channels              | f_contact_email              | text                        | YES         |
| t_channels              | f_language                   | character varying           | YES         |
| t_comment_interactions  | f_id                         | uuid                        | NO          |
| t_comment_interactions  | f_comment_id                 | text                        | NO          |
| t_comment_interactions  | f_user_id                    | text                        | NO          |
| t_comment_interactions  | f_type                       | text                        | NO          |
| t_comment_interactions  | f_created_at                 | timestamp with time zone    | YES         |
| t_comments              | f_id                         | uuid                        | NO          |
| t_comments              | f_text                       | text                        | NO          |
| t_comments              | f_analysis_id                | text                        | NO          |
| t_comments              | f_user_id                    | text                        | NO          |
| t_comments              | f_parent_id                  | text                        | YES         |
| t_comments              | f_created_at                 | timestamp with time zone    | YES         |
| t_comments              | f_updated_at                 | timestamp with time zone    | YES         |
| t_credit_history        | f_id                         | bigint                      | NO          |
| t_credit_history        | f_user_id                    | text                        | NO          |
| t_credit_history        | f_type                       | text                        | NO          |
| t_credit_history        | f_amount                     | integer                     | NO          |
| t_credit_history        | f_balance                    | integer                     | NO          |
| t_credit_history        | f_description                | text                        | YES         |
| t_credit_history        | f_created_at                 | timestamp with time zone    | YES         |
| t_interactions          | f_id                         | uuid                        | NO          |
| t_interactions          | f_type                       | text                        | NO          |
| t_interactions          | f_analysis_id                | uuid                        | NO          |
| t_interactions          | f_user_id                    | text                        | NO          |
| t_interactions          | f_created_at                 | timestamp with time zone    | YES         |
| t_users                 | f_id                         | text                        | NO          |
| t_users                 | f_email                      | text                        | YES         |
| t_users                 | f_nickname                   | text                        | YES         |
| t_users                 | f_image                      | text                        | YES         |
| t_users                 | f_created_at                 | timestamp with time zone    | YES         |
| t_users                 | f_updated_at                 | timestamp with time zone    | YES         |
| t_users                 | f_credits                    | integer                     | YES         |
| t_users                 | total_predictions            | integer                     | YES         |
| t_users                 | avg_gap                      | numeric                     | YES         |
| t_users                 | current_tier                 | text                        | YES         |
| t_users                 | current_tier_label           | text                        | YES         |
| t_users                 | tier_emoji                   | text                        | YES         |
| t_users                 | f_notify_grade_change        | boolean                     | YES         |
| t_users                 | f_notify_ranking_change      | boolean                     | YES         |
| t_users                 | f_notify_top10_change        | boolean                     | YES         |
| t_users                 | f_ranking_threshold          | integer                     | YES         |
| t_users                 | f_ad_free_until              | timestamp with time zone    | YES         |

> **[윈드서퍼 메모 — 2026-04-23]** `f_id`에 Hub `family_uid`(mfn-xxx)도 저장됨. `/api/user/profile` PUT을 UPSERT로 전환하여 Hub 유저 첫 프로필 저장 시 row 자동 생성. `f_credits`는 Hub wallet 이관 예정, `f_nickname`/`f_image`는 향후 `app_aggro_profiles`로 이관 대상.

| t_videos                | f_video_id                   | character varying           | NO          |
| t_videos                | f_channel_id                 | character varying           | YES         |
| t_videos                | f_title                      | text                        | NO          |
| t_videos                | f_description                | text                        | YES         |
| t_videos                | f_published_at               | timestamp with time zone    | YES         |
| t_videos                | f_thumbnail_url              | text                        | YES         |
| t_videos                | f_official_category_id       | integer                     | YES         |
| t_videos                | f_custom_category_id         | integer                     | YES         |
| t_videos                | f_view_count                 | bigint                      | YES         |
| t_videos                | f_like_count                 | bigint                      | YES         |
| t_videos                | f_created_at                 | timestamp with time zone    | YES         |
| t_videos                | f_updated_at                 | timestamp with time zone    | YES         |
| t_videos                | f_accuracy_score             | integer                     | YES         |
| t_videos                | f_clickbait_score            | integer                     | YES         |
| t_videos                | f_trust_score                | integer                     | YES         |
| t_videos                | f_ai_recommended_title       | text                        | YES         |
| t_videos                | f_summary                    | text                        | YES         |
| t_videos                | f_evaluation_reason          | text                        | YES         |
| t_videos                | f_language                   | character varying           | YES         |
| t_videos                | f_language_source            | character varying           | YES         |
