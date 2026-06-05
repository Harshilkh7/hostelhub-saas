CREATE TYPE user_role AS ENUM (
  'SUPER_ADMIN',
  'HOSTEL_ADMIN',
  'WARDEN',
  'STUDENT'
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,

  role user_role DEFAULT 'STUDENT',

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE hostels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  name VARCHAR(100) NOT NULL,
  address TEXT,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  hostel_id UUID NOT NULL REFERENCES hostels(id) ON DELETE CASCADE,

  room_number VARCHAR(20) NOT NULL,

  floor INTEGER,
  capacity INTEGER NOT NULL,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE student_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  room_id UUID REFERENCES rooms(id),

  college_id VARCHAR(50),

  course VARCHAR(100),

  year INTEGER,

  guardian_name VARCHAR(100),
  guardian_phone VARCHAR(20),

  created_at TIMESTAMP DEFAULT NOW()
);

SELECT table_name
FROM information_schema.tables
WHERE table_schema='public';