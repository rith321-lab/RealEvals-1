-- SQL to create the users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    "firstName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "lastLoginAt" TIMESTAMP WITH TIME ZONE,
    "isActive" BOOLEAN DEFAULT TRUE,
    "isEmailVerified" BOOLEAN DEFAULT FALSE,
    "loginCount" INTEGER DEFAULT 0
);

-- Add index on email
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create RLS policy for users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy for anon users (allows registration)
CREATE POLICY users_insert_policy
    ON users
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Policy for authenticated users to see their own data
CREATE POLICY users_select_policy
    ON users
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

-- Policy for authenticated users to update their own data
CREATE POLICY users_update_policy
    ON users
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Policy for deleting your own data
CREATE POLICY users_delete_policy
    ON users
    FOR DELETE
    TO authenticated
    USING (auth.uid() = id);
