-- Cloudflare D1. Create tables before enabling LIVE_COMMERCE_ENABLED.
CREATE TABLE IF NOT EXISTS orders (
 id TEXT PRIMARY KEY,
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL,
 status TEXT NOT NULL CHECK(status IN ('pending','checkout_error','paid','shipping_pending','shipping_error','label_created','cancelled')),
 subtotal_cents INTEGER NOT NULL CHECK(subtotal_cents >= 0),
 shipping_cents INTEGER NOT NULL CHECK(shipping_cents >= 0),
 total_cents INTEGER NOT NULL CHECK(total_cents >= 0),
 items_json TEXT NOT NULL,
 customer_json TEXT NOT NULL,
 token_hash TEXT NOT NULL,
 stripe_session_id TEXT UNIQUE,
 tracking_number TEXT,
 tracking_url TEXT,
 label_url TEXT
);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status,created_at);
CREATE TABLE IF NOT EXISTS stripe_events (id TEXT PRIMARY KEY, created_at TEXT NOT NULL);
