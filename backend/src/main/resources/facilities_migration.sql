-- ============================================================
--  Smart Campus Hub — Facilities & Resources SQL Migration
--  Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================================

-- Clean start to prevent schema mismatch errors
DROP TABLE IF EXISTS resources CASCADE;
DROP TABLE IF EXISTS facilities CASCADE;

-- 1. Facilities table
CREATE TABLE IF NOT EXISTS facilities (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR(150) NOT NULL,
    description   TEXT,
    location      VARCHAR(150),
    capacity      INTEGER,
    status        VARCHAR(30)  NOT NULL DEFAULT 'AVAILABLE',
    image_url     TEXT,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Index for searchable fields
CREATE INDEX IF NOT EXISTS idx_facilities_name ON facilities (name);
CREATE INDEX IF NOT EXISTS idx_facilities_status ON facilities (status);

-- 2. Resources table
CREATE TABLE IF NOT EXISTS resources (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_id   UUID         NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
    name          VARCHAR(150) NOT NULL,
    description   TEXT,
    type          VARCHAR(30)  NOT NULL DEFAULT 'EQUIPMENT',
    quantity      INTEGER      NOT NULL DEFAULT 1,
    status        VARCHAR(30)  NOT NULL DEFAULT 'AVAILABLE',
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_resources_facility ON resources (facility_id);
CREATE INDEX IF NOT EXISTS idx_resources_status ON resources (status);

-- 3. Trigger for updated_at (optional but good practice)
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_facilities_modtime ON facilities;
CREATE TRIGGER update_facilities_modtime
    BEFORE UPDATE ON facilities
    FOR EACH ROW
    EXECUTE PROCEDURE update_modified_column();

DROP TRIGGER IF EXISTS update_resources_modtime ON resources;
CREATE TRIGGER update_resources_modtime
    BEFORE UPDATE ON resources
    FOR EACH ROW
    EXECUTE PROCEDURE update_modified_column();

-- Confirm
SELECT 'facilities table' AS table_name, count(*) FROM facilities
UNION ALL
SELECT 'resources table', count(*) FROM resources;
