-- StudyTracker Database Schema
-- This file contains the SQL to create all necessary tables for the StudyTracker app

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('student', 'coach');
CREATE TYPE session_status AS ENUM ('active', 'completed', 'paused');
CREATE TYPE goal_status AS ENUM ('active', 'completed', 'failed');
CREATE TYPE goal_period AS ENUM ('daily', 'weekly', 'monthly');
CREATE TYPE message_type AS ENUM ('text', 'voice', 'file');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subjects table
CREATE TABLE public.subjects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    color TEXT NOT NULL DEFAULT '#6366f1',
    emoji TEXT DEFAULT '📚',
    student_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Study sessions table
CREATE TABLE public.study_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER,
    notes TEXT,
    status session_status DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Streaks table
CREATE TABLE public.streaks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_study_date DATE,
    freeze_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coach-Student relationships
CREATE TABLE public.coach_students (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    coach_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(coach_id, student_id)
);

-- Goals table
CREATE TABLE public.goals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    coach_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    target_hours INTEGER NOT NULL,
    period goal_period NOT NULL,
    status goal_status DEFAULT 'active',
    deadline DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE public.messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    type message_type DEFAULT 'text',
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_study_sessions_student_id ON public.study_sessions(student_id);
CREATE INDEX idx_study_sessions_subject_id ON public.study_sessions(subject_id);
CREATE INDEX idx_study_sessions_start_time ON public.study_sessions(start_time);
CREATE INDEX idx_subjects_student_id ON public.subjects(student_id);
CREATE INDEX idx_goals_student_id ON public.goals(student_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON public.messages(receiver_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can read their own data
CREATE POLICY "Users can read own data" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Students can manage their own subjects
CREATE POLICY "Students can manage own subjects" ON public.subjects
    FOR ALL USING (auth.uid() = student_id);

-- Students can manage their own study sessions
CREATE POLICY "Students can manage own sessions" ON public.study_sessions
    FOR ALL USING (auth.uid() = student_id);

-- Students can read their own streaks
CREATE POLICY "Students can read own streaks" ON public.streaks
    FOR SELECT USING (auth.uid() = student_id);

-- System can update streaks (for automatic streak calculation)
CREATE POLICY "System can update streaks" ON public.streaks
    FOR UPDATE USING (true);

-- Coach-student relationship policies
CREATE POLICY "Coaches can read their students" ON public.coach_students
    FOR SELECT USING (auth.uid() = coach_id);

CREATE POLICY "Students can read their coaches" ON public.coach_students
    FOR SELECT USING (auth.uid() = student_id);

-- Goals policies
CREATE POLICY "Students can read own goals" ON public.goals
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Coaches can manage student goals" ON public.goals
    FOR ALL USING (auth.uid() = coach_id);

-- Messages policies
CREATE POLICY "Users can read their messages" ON public.messages
    FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" ON public.messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Functions and Triggers

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'student')::user_role
    );
    
    -- Create initial streak record for students
    IF COALESCE(NEW.raw_user_meta_data->>'role', 'student') = 'student' THEN
        INSERT INTO public.streaks (student_id)
        VALUES (NEW.id);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update streak when study session is completed
CREATE OR REPLACE FUNCTION public.update_streak_on_session()
RETURNS TRIGGER AS $$
DECLARE
    study_date DATE;
    last_study DATE;
    current_streak_val INTEGER;
BEGIN
    -- Only update streak for completed sessions
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        study_date := NEW.start_time::DATE;
        
        SELECT last_study_date, current_streak
        INTO last_study, current_streak_val
        FROM public.streaks
        WHERE student_id = NEW.student_id;
        
        -- If this is the first study session or continuing streak
        IF last_study IS NULL OR study_date = last_study + INTERVAL '1 day' THEN
            UPDATE public.streaks
            SET 
                current_streak = CASE 
                    WHEN last_study IS NULL THEN 1
                    WHEN study_date = last_study + INTERVAL '1 day' THEN current_streak + 1
                    ELSE current_streak
                END,
                longest_streak = GREATEST(longest_streak, 
                    CASE 
                        WHEN last_study IS NULL THEN 1
                        WHEN study_date = last_study + INTERVAL '1 day' THEN current_streak + 1
                        ELSE current_streak
                    END),
                last_study_date = study_date,
                updated_at = NOW()
            WHERE student_id = NEW.student_id;
        -- If streak is broken (more than 1 day gap)
        ELSIF study_date > last_study + INTERVAL '1 day' THEN
            UPDATE public.streaks
            SET 
                current_streak = 1,
                longest_streak = GREATEST(longest_streak, 1),
                last_study_date = study_date,
                updated_at = NOW()
            WHERE student_id = NEW.student_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update streak when session is completed
CREATE OR REPLACE TRIGGER on_study_session_completed
    AFTER UPDATE ON public.study_sessions
    FOR EACH ROW EXECUTE FUNCTION public.update_streak_on_session();

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE OR REPLACE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_streaks_updated_at
    BEFORE UPDATE ON public.streaks
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();