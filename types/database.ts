export type LessonStatus = 'scheduled' | 'done' | 'cancelled';

export interface Student {
  id: string;
  name: string;
  phone: string | null;
  note: string | null;
  created_at: string;
}

export interface ClassItem {
  id: string;
  name: string;
  note: string | null;
  created_at: string;
  members_count?: number;
}

export interface ClassMember {
  class_id: string;
  student_id: string;
  created_at: string;
}

export interface ScheduleSlot {
  id: string;
  title: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  student_id: string | null;
  class_id: string | null;
  course_id?: string | null;
  location_or_link: string | null;
  note: string | null;
  created_at: string;
  student?: Student | null;
  class?: ClassItem | null;
}

export interface Topic {
  id: string;
  chapter_id: string;
  title: string;
  note?: string | null;
  is_completed?: boolean;
  order_num?: number;
}

export interface Chapter {
  id: string;
  course_id: string;
  title: string;
  order_num?: number;
  topics?: Topic[];
}

export interface Course {
  id: string;
  name: string;
  description?: string | null;
  chapters?: Chapter[];
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      students: {
        Row: Student;
        Insert: Omit<Student, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<Student, 'id'>>;
      };
      classes: {
        Row: ClassItem;
        Insert: Omit<ClassItem, 'id' | 'created_at' | 'members_count'> & { id?: string; created_at?: string };
        Update: Partial<Omit<ClassItem, 'id' | 'members_count'>>;
      };
      class_members: {
        Row: ClassMember;
        Insert: Omit<ClassMember, 'created_at'> & { created_at?: string };
        Update: Partial<ClassMember>;
      };
      schedule_slots: {
        Row: ScheduleSlot;
        Insert: Omit<ScheduleSlot, 'id' | 'created_at' | 'student' | 'class'> & { id?: string; created_at?: string };
        Update: Partial<Omit<ScheduleSlot, 'id' | 'student' | 'class'>>;
      };
      courses: {
        Row: Course;
        Insert: Omit<Course, 'id' | 'created_at' | 'chapters'> & { id?: string; created_at?: string };
        Update: Partial<Omit<Course, 'id' | 'chapters'>>;
      };
      chapters: {
        Row: Chapter;
        Insert: Omit<Chapter, 'id' | 'topics'> & { id?: string; created_at?: string };
        Update: Partial<Omit<Chapter, 'id' | 'topics'>>;
      };
      topics: {
        Row: Topic;
        Insert: Omit<Topic, 'id'> & { id?: string; created_at?: string };
        Update: Partial<Omit<Topic, 'id'>>;
      };
    };
  };
}
