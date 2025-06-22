export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'coach';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface StudySession {
  id: string;
  student_id: string;
  subject_id: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  notes?: string;
  created_at: string;
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  student_id: string;
  created_at: string;
}

export interface Streak {
  id: string;
  student_id: string;
  current_streak: number;
  longest_streak: number;
  last_study_date: string;
  freeze_count: number;
  created_at: string;
  updated_at: string;
}

export interface CoachStudent {
  id: string;
  coach_id: string;
  student_id: string;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  type: 'text' | 'voice' | 'file';
  read_at?: string;
  created_at: string;
}

export interface Goal {
  id: string;
  student_id: string;
  coach_id: string;
  title: string;
  description?: string;
  target_hours: number;
  period: 'daily' | 'weekly' | 'monthly';
  status: 'active' | 'completed' | 'failed';
  created_at: string;
  deadline: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}