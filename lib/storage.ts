import { Student, ClassItem, ScheduleSlot, Course, Chapter, Topic } from '@/types/database';

const LS_STUDENTS_KEY = 'classplan_students';
const LS_CLASSES_KEY = 'classplan_classes';
const LS_MEMBERS_KEY = 'classplan_members';
const LS_SLOTS_KEY = 'classplan_slots';
const LS_COURSES_KEY = 'classplan_courses';

const INITIAL_STUDENTS: Student[] = [
  { id: 'std-1', name: 'Nguyễn Văn An', phone: '0912345678', note: 'Học Java Core & Spring Boot 1:1', created_at: new Date().toISOString() },
  { id: 'std-2', name: 'Trần Thị Bích', phone: '0987654321', note: 'Luyện thi Backend Microservices', created_at: new Date().toISOString() },
  { id: 'std-3', name: 'Lê Hoàng Nam', phone: '0901234567', note: 'Học sinh lớp Web Fullstack', created_at: new Date().toISOString() },
  { id: 'std-4', name: 'Phạm Quỳnh Chi', phone: '0933221100', note: 'Học React & Next.js 1:1', created_at: new Date().toISOString() },
];

const INITIAL_CLASSES: ClassItem[] = [
  { id: 'cls-1', name: 'Lớp Java Spring Boot K15', note: 'Tối thứ 3 & thứ 5 lúc 19:30', created_at: new Date().toISOString() },
  { id: 'cls-2', name: 'Lớp Luyện Phỏng Vấn Backend', note: 'Sáng Chủ Nhật lúc 09:00', created_at: new Date().toISOString() },
];

const INITIAL_MEMBERS = [
  { class_id: 'cls-1', student_id: 'std-1' },
  { class_id: 'cls-1', student_id: 'std-3' },
  { class_id: 'cls-2', student_id: 'std-2' },
  { class_id: 'cls-2', student_id: 'std-4' },
];

const INITIAL_SLOTS: ScheduleSlot[] = [
  {
    id: 'slot-1',
    title: 'Học 1:1 Java Core',
    day_of_week: 1,
    start_time: '19:00',
    end_time: '20:30',
    student_id: 'std-1',
    class_id: null,
    location_or_link: 'meet.google.com/java-101',
    note: 'Hướng dẫn OOP & Generic',
    created_at: new Date().toISOString(),
  },
  {
    id: 'slot-2',
    title: 'Lớp Java Spring Boot K15',
    day_of_week: 2,
    start_time: '19:30',
    end_time: '21:30',
    student_id: null,
    class_id: 'cls-1',
    location_or_link: 'meet.google.com/spring-k15',
    note: 'Học Chapter Spring Data JPA',
    created_at: new Date().toISOString(),
  },
  {
    id: 'slot-3',
    title: 'Học 1:1 React & Next.js',
    day_of_week: 3,
    start_time: '20:00',
    end_time: '21:30',
    student_id: 'std-4',
    class_id: null,
    location_or_link: 'zoom.us/j/99887766',
    note: 'Sửa đồ án tốt nghiệp',
    created_at: new Date().toISOString(),
  },
  {
    id: 'slot-4',
    title: 'Lớp Java Spring Boot K15',
    day_of_week: 4,
    start_time: '19:30',
    end_time: '21:30',
    student_id: null,
    class_id: 'cls-1',
    location_or_link: 'meet.google.com/spring-k15',
    note: 'Thực hành Spring Security',
    created_at: new Date().toISOString(),
  },
  {
    id: 'slot-5',
    title: 'Lớp Luyện Phỏng Vấn Backend',
    day_of_week: 0,
    start_time: '09:00',
    end_time: '11:00',
    student_id: null,
    class_id: 'cls-2',
    location_or_link: 'meet.google.com/interview-vip',
    note: 'Mock interview kỹ thuật SQL & Redis',
    created_at: new Date().toISOString(),
  },
];

const INITIAL_COURSES: Course[] = [
  {
    id: 'course-1',
    name: 'Khóa học Java Spring Boot Pro',
    description: 'Lộ trình từ Spring Core, Spring Data JPA đến Microservices',
    created_at: new Date().toISOString(),
    chapters: [
      {
        id: 'chap-1',
        course_id: 'course-1',
        title: 'Chapter 1: Spring Core & Beans Lifecycle',
        order_num: 1,
        topics: [
          { id: 'top-1', chapter_id: 'chap-1', title: 'Bài 1: Inversion of Control (IoC) & Dependency Injection', is_completed: true },
          { id: 'top-2', chapter_id: 'chap-1', title: 'Bài 2: Bean Scopes (@Scope: singleton, prototype)', is_completed: true },
          { id: 'top-3', chapter_id: 'chap-1', title: 'Bài 3: Component Scanning & @Configuration', is_completed: true },
        ],
      },
      {
        id: 'chap-2',
        course_id: 'course-1',
        title: 'Chapter 2: Spring Data JPA',
        order_num: 2,
        topics: [
          { id: 'top-4', chapter_id: 'chap-2', title: 'Bài 1: Entity Mapping, CrudRepository & JpaRepository', is_completed: true },
          { id: 'top-5', chapter_id: 'chap-2', title: 'Bài 2: QueryMethod (findBy..., countBy..., existsBy...)', is_completed: false },
          { id: 'top-6', chapter_id: 'chap-2', title: 'Bài 3: Projection (Interface-based & Class-based DTO)', is_completed: false },
          { id: 'top-7', chapter_id: 'chap-2', title: 'Bài 4: Custom Query với @Query (JPQL & Native SQL)', is_completed: false },
          { id: 'top-8', chapter_id: 'chap-2', title: 'Bài 5: Pagination (Phân trang) & Sorting', is_completed: false },
        ],
      },
      {
        id: 'chap-3',
        course_id: 'course-1',
        title: 'Chapter 3: Spring Security & JWT',
        order_num: 3,
        topics: [
          { id: 'top-9', chapter_id: 'chap-3', title: 'Bài 1: Security Filter Chain & SecurityContextHolder', is_completed: false },
          { id: 'top-10', chapter_id: 'chap-3', title: 'Bài 2: UserDetailsService & PasswordEncoder (BCrypt)', is_completed: false },
          { id: 'top-11', chapter_id: 'chap-3', title: 'Bài 3: Cơ chế Stateless JWT Token Authentication', is_completed: false },
        ],
      },
    ],
  },
  {
    id: 'course-2',
    name: 'Khóa học Web Frontend React & Next.js',
    description: 'Từ cơ bản đến chuyên sâu cho học viên kèm 1:1',
    created_at: new Date().toISOString(),
    chapters: [
      {
        id: 'chap-201',
        course_id: 'course-2',
        title: 'Chapter 1: React Fundamentals & Hooks',
        order_num: 1,
        topics: [
          { id: 'top-201', chapter_id: 'chap-201', title: 'Bài 1: JSX, Props và State', is_completed: true },
          { id: 'top-202', chapter_id: 'chap-201', title: 'Bài 2: useEffect & Lifecycle', is_completed: true },
          { id: 'top-203', chapter_id: 'chap-201', title: 'Bài 3: Custom Hooks tái sử dụng logic', is_completed: false },
        ],
      },
      {
        id: 'chap-202',
        course_id: 'course-2',
        title: 'Chapter 2: Next.js App Router',
        order_num: 2,
        topics: [
          { id: 'top-204', chapter_id: 'chap-202', title: 'Bài 1: Server Components vs Client Components', is_completed: false },
          { id: 'top-205', chapter_id: 'chap-202', title: 'Bài 2: Data Fetching & Route Handlers', is_completed: false },
        ],
      },
    ],
  },
];

export const StorageAPI = {
  async getStudents(): Promise<Student[]> {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(LS_STUDENTS_KEY);
    if (!raw) {
      localStorage.setItem(LS_STUDENTS_KEY, JSON.stringify(INITIAL_STUDENTS));
      return INITIAL_STUDENTS;
    }
    return JSON.parse(raw);
  },

  async saveStudent(student: Partial<Student> & { name: string }): Promise<Student> {
    const isNew = !student.id;
    const newStudent: Student = {
      id: student.id || `std-${Date.now()}`,
      name: student.name,
      phone: student.phone || null,
      note: student.note || null,
      created_at: student.created_at || new Date().toISOString(),
    };
    const list = await this.getStudents();
    const updated = isNew ? [newStudent, ...list] : list.map((s) => (s.id === newStudent.id ? newStudent : s));
    localStorage.setItem(LS_STUDENTS_KEY, JSON.stringify(updated));
    return newStudent;
  },

  async deleteStudent(id: string): Promise<void> {
    const list = await this.getStudents();
    localStorage.setItem(LS_STUDENTS_KEY, JSON.stringify(list.filter((s) => s.id !== id)));
  },

  async getClasses(): Promise<ClassItem[]> {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(LS_CLASSES_KEY);
    if (!raw) {
      localStorage.setItem(LS_CLASSES_KEY, JSON.stringify(INITIAL_CLASSES));
      return INITIAL_CLASSES;
    }
    return JSON.parse(raw);
  },

  async saveClass(cls: Partial<ClassItem> & { name: string }, studentIds?: string[]): Promise<ClassItem> {
    const isNew = !cls.id;
    const newClass: ClassItem = {
      id: cls.id || `cls-${Date.now()}`,
      name: cls.name,
      note: cls.note || null,
      created_at: cls.created_at || new Date().toISOString(),
    };
    const list = await this.getClasses();
    const updated = isNew ? [newClass, ...list] : list.map((c) => (c.id === newClass.id ? newClass : c));
    localStorage.setItem(LS_CLASSES_KEY, JSON.stringify(updated));

    if (studentIds) {
      const members = await this.getClassMembers();
      const filtered = members.filter((m) => m.class_id !== newClass.id);
      const newMembers = [...filtered, ...studentIds.map((sId) => ({ class_id: newClass.id, student_id: sId }))];
      localStorage.setItem(LS_MEMBERS_KEY, JSON.stringify(newMembers));
    }
    return newClass;
  },

  async deleteClass(id: string): Promise<void> {
    const list = await this.getClasses();
    localStorage.setItem(LS_CLASSES_KEY, JSON.stringify(list.filter((c) => c.id !== id)));
  },

  async getClassMembers(): Promise<{ class_id: string; student_id: string }[]> {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(LS_MEMBERS_KEY);
    if (!raw) {
      localStorage.setItem(LS_MEMBERS_KEY, JSON.stringify(INITIAL_MEMBERS));
      return INITIAL_MEMBERS;
    }
    return JSON.parse(raw);
  },

  async getScheduleSlots(): Promise<ScheduleSlot[]> {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(LS_SLOTS_KEY);
    let slots: ScheduleSlot[] = [];
    if (!raw) {
      localStorage.setItem(LS_SLOTS_KEY, JSON.stringify(INITIAL_SLOTS));
      slots = INITIAL_SLOTS;
    } else {
      slots = JSON.parse(raw);
    }

    const students = await this.getStudents();
    const classes = await this.getClasses();
    const studentMap = new Map(students.map((s) => [s.id, s]));
    const classMap = new Map(classes.map((c) => [c.id, c]));

    return slots.map((slot) => ({
      ...slot,
      student: slot.student_id ? studentMap.get(slot.student_id) || null : null,
      class: slot.class_id ? classMap.get(slot.class_id) || null : null,
    }));
  },

  async saveScheduleSlot(slot: Partial<ScheduleSlot> & { title: string; day_of_week: number; start_time: string; end_time: string }): Promise<ScheduleSlot> {
    const isNew = !slot.id;
    const cleanSlot: ScheduleSlot = {
      id: slot.id || `slot-${Date.now()}`,
      title: slot.title,
      day_of_week: slot.day_of_week,
      start_time: slot.start_time,
      end_time: slot.end_time,
      student_id: slot.student_id || null,
      class_id: slot.class_id || null,
      location_or_link: slot.location_or_link || null,
      note: slot.note || null,
      created_at: slot.created_at || new Date().toISOString(),
    };

    const list = await this.getScheduleSlots();
    const updated = isNew
      ? [cleanSlot, ...list]
      : list.map((s) => (s.id === cleanSlot.id ? cleanSlot : s));
    localStorage.setItem(
      LS_SLOTS_KEY,
      JSON.stringify(updated.map(({ student, class: _, ...rest }) => rest))
    );
    return cleanSlot;
  },

  async deleteScheduleSlot(id: string): Promise<void> {
    const list = await this.getScheduleSlots();
    localStorage.setItem(
      LS_SLOTS_KEY,
      JSON.stringify(list.filter((s) => s.id !== id).map(({ student, class: _, ...rest }) => rest))
    );
  },

  async getCourses(): Promise<Course[]> {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(LS_COURSES_KEY);
    if (!raw) {
      localStorage.setItem(LS_COURSES_KEY, JSON.stringify(INITIAL_COURSES));
      return INITIAL_COURSES;
    }
    return JSON.parse(raw);
  },

  async saveCourse(course: { id?: string; name: string; description?: string }): Promise<Course> {
    const list = await this.getCourses();
    if (course.id) {
      const updated = list.map((c) => (c.id === course.id ? { ...c, ...course } : c));
      localStorage.setItem(LS_COURSES_KEY, JSON.stringify(updated));
      return list.find((c) => c.id === course.id)!;
    } else {
      const newCourse: Course = {
        id: `course-${Date.now()}`,
        name: course.name,
        description: course.description || null,
        chapters: [],
        created_at: new Date().toISOString(),
      };
      const updated = [newCourse, ...list];
      localStorage.setItem(LS_COURSES_KEY, JSON.stringify(updated));
      return newCourse;
    }
  },

  async deleteCourse(courseId: string): Promise<void> {
    const list = await this.getCourses();
    localStorage.setItem(LS_COURSES_KEY, JSON.stringify(list.filter((c) => c.id !== courseId)));
  },

  async addChapter(courseId: string, title: string): Promise<void> {
    const list = await this.getCourses();
    const updated = list.map((c) => {
      if (c.id !== courseId) return c;
      const chapters = c.chapters || [];
      const newChapter: Chapter = {
        id: `chap-${Date.now()}`,
        course_id: courseId,
        title,
        order_num: chapters.length + 1,
        topics: [],
      };
      return { ...c, chapters: [...chapters, newChapter] };
    });
    localStorage.setItem(LS_COURSES_KEY, JSON.stringify(updated));
  },

  async deleteChapter(courseId: string, chapterId: string): Promise<void> {
    const list = await this.getCourses();
    const updated = list.map((c) => {
      if (c.id !== courseId) return c;
      return { ...c, chapters: (c.chapters || []).filter((ch) => ch.id !== chapterId) };
    });
    localStorage.setItem(LS_COURSES_KEY, JSON.stringify(updated));
  },

  async addTopic(courseId: string, chapterId: string, title: string): Promise<void> {
    const list = await this.getCourses();
    const updated = list.map((c) => {
      if (c.id !== courseId) return c;
      const chapters = (c.chapters || []).map((ch) => {
        if (ch.id !== chapterId) return ch;
        const topics = ch.topics || [];
        const newTopic: Topic = {
          id: `top-${Date.now()}`,
          chapter_id: chapterId,
          title,
          is_completed: false,
          order_num: topics.length + 1,
        };
        return { ...ch, topics: [...topics, newTopic] };
      });
      return { ...c, chapters };
    });
    localStorage.setItem(LS_COURSES_KEY, JSON.stringify(updated));
  },

  async toggleTopic(courseId: string, chapterId: string, topicId: string): Promise<void> {
    const list = await this.getCourses();
    const updated = list.map((c) => {
      if (c.id !== courseId) return c;
      const chapters = (c.chapters || []).map((ch) => {
        if (ch.id !== chapterId) return ch;
        const topics = (ch.topics || []).map((t) =>
          t.id === topicId ? { ...t, is_completed: !t.is_completed } : t
        );
        return { ...ch, topics };
      });
      return { ...c, chapters };
    });
    localStorage.setItem(LS_COURSES_KEY, JSON.stringify(updated));
  },

  async deleteTopic(courseId: string, chapterId: string, topicId: string): Promise<void> {
    const list = await this.getCourses();
    const updated = list.map((c) => {
      if (c.id !== courseId) return c;
      const chapters = (c.chapters || []).map((ch) => {
        if (ch.id !== chapterId) return ch;
        return { ...ch, topics: (ch.topics || []).filter((t) => t.id !== topicId) };
      });
      return { ...c, chapters };
    });
    localStorage.setItem(LS_COURSES_KEY, JSON.stringify(updated));
  },

  async resetAll(): Promise<void> {
    localStorage.setItem(LS_STUDENTS_KEY, JSON.stringify(INITIAL_STUDENTS));
    localStorage.setItem(LS_CLASSES_KEY, JSON.stringify(INITIAL_CLASSES));
    localStorage.setItem(LS_MEMBERS_KEY, JSON.stringify(INITIAL_MEMBERS));
    localStorage.setItem(LS_SLOTS_KEY, JSON.stringify(INITIAL_SLOTS));
    localStorage.setItem(LS_COURSES_KEY, JSON.stringify(INITIAL_COURSES));
  },
};
