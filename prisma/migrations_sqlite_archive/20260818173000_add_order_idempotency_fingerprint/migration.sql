-- Add a server-side request fingerprint for strong checkout idempotency.
ALTER TABLE "orders" ADD COLUMN "idempotencyFingerprint" TEXT;
