export const USER_TABLE = process.env.SUPABASE_USER_TABLE || "users"

// Expected schema for USER_TABLE:
// id (text/uuid PK), subscription_status (text), subscription_start (timestamptz), subscription_end (timestamptz),
// daily_usage_limit (integer), uses_today (integer), last_usage_reset (timestamptz), updated_at (timestamptz)
