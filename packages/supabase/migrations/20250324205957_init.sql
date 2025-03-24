-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Users table
CREATE TABLE "Users" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR NOT NULL,
    email VARCHAR NOT NULL UNIQUE,
    role VARCHAR NOT NULL
);

-- Create Campuses table
CREATE TABLE "Campuses" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    address VARCHAR NOT NULL,
    kiosk_locations VARCHAR
);

-- Create Students table
CREATE TABLE "Students" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    card_data JSONB,
    full_name VARCHAR NOT NULL,
    email VARCHAR NOT NULL UNIQUE,
    campus_id UUID NOT NULL REFERENCES "Campuses"(id),
    age INTEGER,
    course VARCHAR NOT NULL
);

-- Create Terms table
CREATE TABLE "Terms" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL
);

-- Create Categories table
CREATE TABLE "Categories" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL UNIQUE
);

-- Create Questions table
CREATE TABLE "Questions" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    subtitle VARCHAR,
    options TEXT[], -- Using TEXT[] for array of options
    correct_answer VARCHAR NOT NULL,
    category_id UUID NOT NULL REFERENCES "Categories"(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status BOOLEAN NOT NULL DEFAULT FALSE
);

-- Create Kiosks table
CREATE TABLE "Kiosks" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campus_id UUID NOT NULL REFERENCES "Campuses"(id),
    categories_enabled VARCHAR
);

-- Create Answers table
CREATE TABLE "Answers" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID NOT NULL REFERENCES "Questions"(id),
    student_id UUID NOT NULL REFERENCES "Students"(id),
    selected_anser VARCHAR NOT NULL, -- Note: There's a typo in the field name, kept as is
    is_correct_answer BOOLEAN NOT NULL,
    term_id UUID NOT NULL REFERENCES "Terms"(id),
    kiosk_id UUID NOT NULL REFERENCES "Kiosks"(id)
);

-- Add indexes for foreign keys to improve query performance
CREATE INDEX idx_students_campus_id ON "Students"(campus_id);
CREATE INDEX idx_answers_student_id ON "Answers"(student_id);
CREATE INDEX idx_answers_question_id ON "Answers"(question_id);
CREATE INDEX idx_answers_term_id ON "Answers"(term_id);
CREATE INDEX idx_answers_kiosk_id ON "Answers"(kiosk_id);
CREATE INDEX idx_questions_category_id ON "Questions"(category_id);
CREATE INDEX idx_kiosks_campus_id ON "Kiosks"(campus_id);
