-- Add error_message column to deployments so failed deployments can surface
-- a human-readable reason in the UI instead of a generic "Error" label.

ALTER TABLE deployments ADD COLUMN IF NOT EXISTS error_message text;
