import { Student, ClassItem, ScheduleSlot, Course } from '@/types/database';
import { createClient } from '@/lib/supabase/client';

export const StorageAPI = {
  async getStudents(): Promise<Student[]> {
    const supabase = createClient();
    if (!supabase) throw new Error('Supabase client chưa được cấu hình. Vui lòng kiểm tra biến NEXT_PUBLIC_SUPABASE_ANON_KEY');
    const { data, error } = await (supabase as any)
      .from('students')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []) as Student[];
  },

  async saveStudent(student: Partial<Student> & { name: string }): Promise<Student> {
    const supabase = createClient();
    if (!supabase) throw new Error('Supabase client chưa được cấu hình');
    if (student.id) {
      const { data, error } = await (supabase as any)
        .from('students')
        .update({
          name: student.name,
          phone: student.phone || null,
          note: student.note || null,
        })
        .eq('id', student.id)
        .select()
        .single();
      if (error) throw error;
      return data as Student;
    } else {
      const { data, error } = await (supabase as any)
        .from('students')
        .insert({
          name: student.name,
          phone: student.phone || null,
          note: student.note || null,
        })
        .select()
        .single();
      if (error) throw error;
      return data as Student;
    }
  },

  async deleteStudent(id: string): Promise<void> {
    const supabase = createClient();
    if (!supabase) throw new Error('Supabase client chưa được cấu hình');
    const { error } = await (supabase as any).from('students').delete().eq('id', id);
    if (error) throw error;
  },

  async getClasses(): Promise<ClassItem[]> {
    const supabase = createClient();
    if (!supabase) throw new Error('Supabase client chưa được cấu hình');
    const { data, error } = await (supabase as any)
      .from('classes')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []) as ClassItem[];
  },

  async saveClass(cls: Partial<ClassItem> & { name: string }, studentIds?: string[]): Promise<ClassItem> {
    const supabase = createClient();
    if (!supabase) throw new Error('Supabase client chưa được cấu hình');
    let savedClass: ClassItem;
    if (cls.id) {
      const { data, error } = await (supabase as any)
        .from('classes')
        .update({
          name: cls.name,
          note: cls.note || null,
        })
        .eq('id', cls.id)
        .select()
        .single();
      if (error) throw error;
      savedClass = data as ClassItem;
    } else {
      const { data, error } = await (supabase as any)
        .from('classes')
        .insert({
          name: cls.name,
          note: cls.note || null,
        })
        .select()
        .single();
      if (error) throw error;
      savedClass = data as ClassItem;
    }

    if (studentIds) {
      await (supabase as any).from('class_members').delete().eq('class_id', savedClass.id);
      if (studentIds.length > 0) {
        const rows = studentIds.map((sid) => ({
          class_id: savedClass.id,
          student_id: sid,
        }));
        const { error: memberError } = await (supabase as any).from('class_members').insert(rows);
        if (memberError) throw memberError;
      }
    }
    return savedClass;
  },

  async deleteClass(id: string): Promise<void> {
    const supabase = createClient();
    if (!supabase) throw new Error('Supabase client chưa được cấu hình');
    const { error } = await (supabase as any).from('classes').delete().eq('id', id);
    if (error) throw error;
  },

  async getClassMembers(): Promise<{ class_id: string; student_id: string }[]> {
    const supabase = createClient();
    if (!supabase) throw new Error('Supabase client chưa được cấu hình');
    const { data, error } = await (supabase as any).from('class_members').select('*');
    if (error) throw error;
    return (data || []) as { class_id: string; student_id: string }[];
  },

  async getScheduleSlots(): Promise<ScheduleSlot[]> {
    const supabase = createClient();
    if (!supabase) throw new Error('Supabase client chưa được cấu hình');
    const { data, error } = await (supabase as any)
      .from('schedule_slots')
      .select('*, student:students(*), class:classes(*)')
      .order('start_time', { ascending: true });
    if (error) throw error;
    return (data || []) as unknown as ScheduleSlot[];
  },

  async saveScheduleSlot(slot: Partial<ScheduleSlot> & { title: string; day_of_week: number; start_time: string; end_time: string }): Promise<ScheduleSlot> {
    const supabase = createClient();
    if (!supabase) throw new Error('Supabase client chưa được cấu hình');
    const payload = {
      title: slot.title,
      day_of_week: slot.day_of_week,
      start_time: slot.start_time,
      end_time: slot.end_time,
      student_id: slot.student_id || null,
      class_id: slot.class_id || null,
      location_or_link: slot.location_or_link || null,
      note: slot.note || null,
    };
    if (slot.id) {
      const { data, error } = await (supabase as any)
        .from('schedule_slots')
        .update(payload)
        .eq('id', slot.id)
        .select('*, student:students(*), class:classes(*)')
        .single();
      if (error) throw error;
      return data as unknown as ScheduleSlot;
    } else {
      const { data, error } = await (supabase as any)
        .from('schedule_slots')
        .insert(payload)
        .select('*, student:students(*), class:classes(*)')
        .single();
      if (error) throw error;
      return data as unknown as ScheduleSlot;
    }
  },

  async deleteScheduleSlot(id: string): Promise<void> {
    const supabase = createClient();
    if (!supabase) throw new Error('Supabase client chưa được cấu hình');
    const { error } = await (supabase as any).from('schedule_slots').delete().eq('id', id);
    if (error) throw error;
  },

  async getCourses(): Promise<Course[]> {
    const supabase = createClient();
    if (!supabase) throw new Error('Supabase client chưa được cấu hình');
    const { data, error } = await (supabase as any)
      .from('courses')
      .select('*, chapters(*, topics(*))')
      .order('created_at', { ascending: true });
    if (error) throw error;
    return (data || []).map((c: any) => ({
      id: c.id,
      name: c.name,
      description: c.description || null,
      created_at: c.created_at,
      chapters: (c.chapters || [])
        .sort((a: any, b: any) => (a.order_num || 0) - (b.order_num || 0))
        .map((ch: any) => ({
          id: ch.id,
          course_id: ch.course_id,
          title: ch.title,
          order_num: ch.order_num,
          topics: (ch.topics || [])
            .sort((a: any, b: any) => (a.order_num || 0) - (b.order_num || 0))
            .map((t: any) => ({
              id: t.id,
              chapter_id: t.chapter_id,
              title: t.title,
              note: t.note || null,
              is_completed: Boolean(t.is_completed),
              order_num: t.order_num,
            })),
        })),
    })) as Course[];
  },

  async saveCourse(course: { id?: string; name: string; description?: string }): Promise<Course> {
    const supabase = createClient();
    if (!supabase) throw new Error('Supabase client chưa được cấu hình');
    if (course.id) {
      const { data, error } = await (supabase as any)
        .from('courses')
        .update({
          name: course.name,
          description: course.description || null,
        })
        .eq('id', course.id)
        .select('*, chapters(*, topics(*))')
        .single();
      if (error) throw error;
      return data as unknown as Course;
    } else {
      const { data, error } = await (supabase as any)
        .from('courses')
        .insert({
          name: course.name,
          description: course.description || null,
        })
        .select()
        .single();
      if (error) throw error;
      return {
        id: data.id,
        name: data.name,
        description: data.description || null,
        chapters: [],
        created_at: data.created_at,
      };
    }
  },

  async deleteCourse(courseId: string): Promise<void> {
    const supabase = createClient();
    if (!supabase) throw new Error('Supabase client chưa được cấu hình');
    const { error } = await (supabase as any).from('courses').delete().eq('id', courseId);
    if (error) throw error;
  },

  async addChapter(courseId: string, title: string): Promise<void> {
    const supabase = createClient();
    if (!supabase) throw new Error('Supabase client chưa được cấu hình');
    const { count } = await (supabase as any)
      .from('chapters')
      .select('*', { count: 'exact', head: true })
      .eq('course_id', courseId);
    const { error } = await (supabase as any).from('chapters').insert({
      course_id: courseId,
      title,
      order_num: (count || 0) + 1,
    });
    if (error) throw error;
  },

  async deleteChapter(courseId: string, chapterId: string): Promise<void> {
    const supabase = createClient();
    if (!supabase) throw new Error('Supabase client chưa được cấu hình');
    const { error } = await (supabase as any).from('chapters').delete().eq('id', chapterId);
    if (error) throw error;
  },

  async addTopic(courseId: string, chapterId: string, title: string, note?: string): Promise<void> {
    const supabase = createClient();
    if (!supabase) throw new Error('Supabase client chưa được cấu hình');
    const { count } = await (supabase as any)
      .from('topics')
      .select('*', { count: 'exact', head: true })
      .eq('chapter_id', chapterId);
    const { error } = await (supabase as any).from('topics').insert({
      chapter_id: chapterId,
      title,
      note: note || null,
      is_completed: false,
      order_num: (count || 0) + 1,
    });
    if (error) throw error;
  },

  async toggleTopic(courseId: string, chapterId: string, topicId: string): Promise<void> {
    const supabase = createClient();
    if (!supabase) throw new Error('Supabase client chưa được cấu hình');
    const { data } = await (supabase as any)
      .from('topics')
      .select('is_completed')
      .eq('id', topicId)
      .single();
    if (data) {
      const { error } = await (supabase as any)
        .from('topics')
        .update({ is_completed: !data.is_completed })
        .eq('id', topicId);
      if (error) throw error;
    }
  },

  async deleteTopic(courseId: string, chapterId: string, topicId: string): Promise<void> {
    const supabase = createClient();
    if (!supabase) throw new Error('Supabase client chưa được cấu hình');
    const { error } = await (supabase as any).from('topics').delete().eq('id', topicId);
    if (error) throw error;
  },
};
