import { supabase } from './supabaseClient';
import { StudySession, Subject } from '../../types';

export interface CreateStudySessionData {
  subject_id?: string;
  notes?: string;
}

export interface UpdateStudySessionData {
  end_time?: string;
  duration_minutes?: number;
  notes?: string;
  status?: 'active' | 'completed' | 'paused';
}

export interface StudySessionResult {
  data: StudySession | StudySession[] | null;
  error: string | null;
}

export interface SubjectResult {
  data: Subject | Subject[] | null;
  error: string | null;
}

class StudySessionService {
  /**
   * Get all subjects for the current user
   */
  async getSubjects(): Promise<SubjectResult> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: 'User not authenticated' };
      }

      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('student_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  /**
   * Create a new subject
   */
  async createSubject(name: string, color: string = '#6366f1', emoji: string = '📚'): Promise<SubjectResult> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: 'User not authenticated' };
      }

      const { data, error } = await supabase
        .from('subjects')
        .insert({
          name,
          color,
          emoji,
          student_id: user.id,
        })
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  /**
   * Start a new study session
   */
  async startStudySession(sessionData: CreateStudySessionData): Promise<StudySessionResult> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: 'User not authenticated' };
      }

      const { data, error } = await supabase
        .from('study_sessions')
        .insert({
          student_id: user.id,
          subject_id: sessionData.subject_id,
          start_time: new Date().toISOString(),
          notes: sessionData.notes,
          status: 'active',
        })
        .select(`
          *,
          subjects (
            id,
            name,
            color,
            emoji
          )
        `)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  /**
   * Update an existing study session (pause, resume, complete)
   */
  async updateStudySession(sessionId: string, updates: UpdateStudySessionData): Promise<StudySessionResult> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: 'User not authenticated' };
      }

      const { data, error } = await supabase
        .from('study_sessions')
        .update(updates)
        .eq('id', sessionId)
        .eq('student_id', user.id) // Ensure user can only update their own sessions
        .select(`
          *,
          subjects (
            id,
            name,
            color,
            emoji
          )
        `)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  /**
   * Complete a study session
   */
  async completeStudySession(sessionId: string, endTime?: Date): Promise<StudySessionResult> {
    try {
      const endDateTime = endTime || new Date();
      
      // First get the session to calculate duration
      const { data: session, error: fetchError } = await supabase
        .from('study_sessions')
        .select('start_time')
        .eq('id', sessionId)
        .single();

      if (fetchError || !session) {
        return { data: null, error: 'Session not found' };
      }

      const startTime = new Date(session.start_time);
      const durationMinutes = Math.round((endDateTime.getTime() - startTime.getTime()) / (1000 * 60));

      return this.updateStudySession(sessionId, {
        end_time: endDateTime.toISOString(),
        duration_minutes: durationMinutes,
        status: 'completed',
      });
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  /**
   * Get study sessions for the current user
   */
  async getStudySessions(limit?: number, offset?: number): Promise<StudySessionResult> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: 'User not authenticated' };
      }

      let query = supabase
        .from('study_sessions')
        .select(`
          *,
          subjects (
            id,
            name,
            color,
            emoji
          )
        `)
        .eq('student_id', user.id)
        .order('start_time', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      if (offset) {
        query = query.range(offset, offset + (limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  /**
   * Get active study session for the current user
   */
  async getActiveStudySession(): Promise<StudySessionResult> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: 'User not authenticated' };
      }

      const { data, error } = await supabase
        .from('study_sessions')
        .select(`
          *,
          subjects (
            id,
            name,
            color,
            emoji
          )
        `)
        .eq('student_id', user.id)
        .eq('status', 'active')
        .order('start_time', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  /**
   * Get study statistics for the current user
   */
  async getStudyStatistics(startDate?: Date, endDate?: Date) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: 'User not authenticated' };
      }

      let query = supabase
        .from('study_sessions')
        .select(`
          id,
          duration_minutes,
          start_time,
          subjects (
            id,
            name,
            color,
            emoji
          )
        `)
        .eq('student_id', user.id)
        .eq('status', 'completed');

      if (startDate) {
        query = query.gte('start_time', startDate.toISOString());
      }

      if (endDate) {
        query = query.lte('start_time', endDate.toISOString());
      }

      const { data, error } = await query;

      if (error) {
        return { data: null, error: error.message };
      }

      // Calculate statistics
      const totalMinutes = data?.reduce((sum, session) => sum + (session.duration_minutes || 0), 0) || 0;
      const totalSessions = data?.length || 0;
      const averageSessionMinutes = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;

      // Subject breakdown
      const subjectStats = data?.reduce((acc, session) => {
        if (session.subjects) {
          const subjectName = session.subjects.name;
          if (!acc[subjectName]) {
            acc[subjectName] = {
              name: subjectName,
              color: session.subjects.color,
              emoji: session.subjects.emoji,
              totalMinutes: 0,
              sessionCount: 0,
            };
          }
          acc[subjectName].totalMinutes += session.duration_minutes || 0;
          acc[subjectName].sessionCount += 1;
        }
        return acc;
      }, {} as Record<string, any>) || {};

      return {
        data: {
          totalMinutes,
          totalHours: Math.round(totalMinutes / 60 * 10) / 10, // Round to 1 decimal
          totalSessions,
          averageSessionMinutes,
          subjectStats: Object.values(subjectStats),
        },
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  /**
   * Get current streak for the user
   */
  async getCurrentStreak() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: 'User not authenticated' };
      }

      const { data, error } = await supabase
        .from('streaks')
        .select('*')
        .eq('student_id', user.id)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  /**
   * Delete a study session
   */
  async deleteStudySession(sessionId: string): Promise<{ error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { error: 'User not authenticated' };
      }

      const { error } = await supabase
        .from('study_sessions')
        .delete()
        .eq('id', sessionId)
        .eq('student_id', user.id); // Ensure user can only delete their own sessions

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }
}

export const studySessionService = new StudySessionService();