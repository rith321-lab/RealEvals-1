-- Create enum type for user roles
CREATE TYPE "user_role" AS ENUM ('ADMIN', 'USER');

-- Create users table
CREATE TABLE IF NOT EXISTS "users" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "email" VARCHAR NOT NULL UNIQUE,
    "firstName" VARCHAR NOT NULL,
    "lastName" VARCHAR,
    "password" VARCHAR NOT NULL,
    "role" user_role NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ,
    "lastLoginAt" TIMESTAMPTZ,
    "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT FALSE,
    "loginCount" INTEGER NOT NULL DEFAULT 0
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users" ("email");

-- Set up Row Level Security (RLS)
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;

-- Create policies
-- 1. Users can read their own profile
CREATE POLICY "Users can read their own profile" ON "users"
    FOR SELECT
    USING (auth.uid() = id);

-- 2. Users can update their own profile 
CREATE POLICY "Users can update their own profile" ON "users"
    FOR UPDATE
    USING (auth.uid() = id);

-- 3. Admins can read all profiles
CREATE POLICY "Admins can read all profiles" ON "users"
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid() AND users.role = 'ADMIN'
        )
    );

-- 4. Admins can update all profiles
CREATE POLICY "Admins can update all profiles" ON "users"
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid() AND users.role = 'ADMIN'
        )
    );

-- 5. Admins can insert new users
CREATE POLICY "Admins can insert new users" ON "users"
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid() AND users.role = 'ADMIN'
        )
    );

-- 6. Signup policy (for new user registration)
CREATE POLICY "Allow signups" ON "users"
    FOR INSERT
    WITH CHECK (auth.role() = 'anon');

-- Add a function to handle user updates and set updatedAt
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW."updatedAt" = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updatedAt column
CREATE TRIGGER update_users_timestamp
BEFORE UPDATE ON "users"
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp_column();
