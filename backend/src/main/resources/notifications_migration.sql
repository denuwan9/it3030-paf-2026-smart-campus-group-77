-- ============================================================
--  Smart Campus Hub — Notifications Module SQL Migration
--  Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================================

-- 1. Notification type enum (matches the Java NotificationType enum)
DO $$ BEGIN
    CREATE TYPE notification_type AS ENUM ('BOOKING', 'SYSTEM', 'ANNOUNCEMENT', 'SECURITY', 'TICKET');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id  UUID        NOT NULL,
    type          VARCHAR(30) NOT NULL,
    title         VARCHAR(255) NOT NULL,
    message       TEXT        NOT NULL,
    action_url    TEXT,
    is_read       BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast per-user lookups
CREATE INDEX IF NOT EXISTS idx_notifications_recipient
    ON notifications (recipient_id);

CREATE INDEX IF NOT EXISTS idx_notifications_unread
    ON notifications (recipient_id, is_read);

-- 3. notification_settings table (one row per user)
CREATE TABLE IF NOT EXISTS notification_settings (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id              UUID    NOT NULL UNIQUE,
    email_enabled        BOOLEAN NOT NULL DEFAULT TRUE,
    booking_alerts       BOOLEAN NOT NULL DEFAULT TRUE,
    ticket_alerts        BOOLEAN NOT NULL DEFAULT TRUE,

    system_alerts        BOOLEAN NOT NULL DEFAULT TRUE,
    announcement_alerts  BOOLEAN NOT NULL DEFAULT TRUE,
    security_alerts      BOOLEAN NOT NULL DEFAULT TRUE,
    sound_enabled        BOOLEAN NOT NULL DEFAULT TRUE
);

-- Index for fast per-user settings lookup
CREATE INDEX IF NOT EXISTS idx_notification_settings_user
    ON notification_settings (user_id);

-- Confirm
SELECT 'notifications table'        AS table_name, count(*) FROM notifications
UNION ALL
SELECT 'notification_settings', count(*) FROM notification_settings;
