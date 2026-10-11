'use client';

import * as React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Tabs,
  Tab,
  Button,
  Stack,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  CalendarMonthIcon,
  PeopleIcon,
  SchoolIcon,
} from '@/components/Icons';
import CalendarView from '@/components/CalendarView';
import CurriculumView from '@/components/CurriculumView';
import StudentsClassesView from '@/components/StudentsClassesView';
import LessonDialog from '@/components/LessonDialog';
import StudentDialog from '@/components/StudentDialog';
import ClassDialog from '@/components/ClassDialog';
import { StorageAPI } from '@/lib/storage';
import { ScheduleSlot, Student, ClassItem, Course } from '@/types/database';

export default function HomePage() {
  const [currentTab, setCurrentTab] = React.useState<number>(0);

  const [loading, setLoading] = React.useState(true);
  const [slots, setSlots] = React.useState<ScheduleSlot[]>([]);
  const [students, setStudents] = React.useState<Student[]>([]);
  const [classes, setClasses] = React.useState<
    (ClassItem & { members_count?: number; student_ids?: string[] })[]
  >([]);
  const [courses, setCourses] = React.useState<Course[]>([]);

  const [slotDialogOpen, setSlotDialogOpen] = React.useState(false);
  const [selectedSlot, setSelectedSlot] = React.useState<ScheduleSlot | null>(null);
  const [defaultDayOfWeek, setDefaultDayOfWeek] = React.useState<number>(1);

  const [studentDialogOpen, setStudentDialogOpen] = React.useState(false);
  const [selectedStudent, setSelectedStudent] = React.useState<Student | null>(null);

  const [classDialogOpen, setClassDialogOpen] = React.useState(false);
  const [selectedClass, setSelectedClass] = React.useState<ClassItem | null>(null);

  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const loadData = React.useCallback(async () => {
    try {
      const [slotData, sData, cData, mData, courseData] = await Promise.all([
        StorageAPI.getScheduleSlots(),
        StorageAPI.getStudents(),
        StorageAPI.getClasses(),
        StorageAPI.getClassMembers(),
        StorageAPI.getCourses(),
      ]);

      const classesWithCount = cData.map((c) => ({
        ...c,
        members_count: mData.filter((m) => m.class_id === c.id).length,
        student_ids: mData.filter((m) => m.class_id === c.id).map((m) => m.student_id),
      }));

      setSlots(slotData);
      setStudents(sData);
      setClasses(classesWithCount);
      setCourses(courseData);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenCreateSlot = (dayOfWeek?: number) => {
    setSelectedSlot(null);
    setDefaultDayOfWeek(dayOfWeek ?? 1);
    setSlotDialogOpen(true);
  };

  const handleEditSlot = (slot: ScheduleSlot) => {
    setSelectedSlot(slot);
    setSlotDialogOpen(true);
  };

  const handleSaveSlot = async (slotData: any) => {
    await StorageAPI.saveScheduleSlot(slotData);
    await loadData();
    setToastMessage(slotData.id ? 'Đã cập nhật ca học!' : 'Đã thêm ca học cố định mới!');
  };

  const handleDeleteSlot = async (id: string) => {
    await StorageAPI.deleteScheduleSlot(id);
    await loadData();
    setToastMessage('Đã xóa ca học');
  };

  const handleAddCourse = async (name: string, description?: string) => {
    await StorageAPI.saveCourse({ name, description });
    await loadData();
    setToastMessage('Đã thêm khóa học mới!');
  };

  const handleDeleteCourse = async (id: string) => {
    await StorageAPI.deleteCourse(id);
    await loadData();
    setToastMessage('Đã xóa khóa học');
  };

  const handleAddChapter = async (courseId: string, title: string) => {
    try {
      await StorageAPI.addChapter(courseId, title);
      await loadData();
      setToastMessage('Đã thêm Chapter mới!');
    } catch (err: any) {
      setToastMessage(`Lỗi: ${err.message || 'Không thể thêm Chapter'}`);
    }
  };

  const handleDeleteChapter = async (courseId: string, chapterId: string) => {
    try {
      await StorageAPI.deleteChapter(courseId, chapterId);
      await loadData();
      setToastMessage('Đã xóa Chapter');
    } catch (err: any) {
      setToastMessage(`Lỗi: ${err.message || 'Không thể xóa Chapter'}`);
    }
  };

  const handleAddTopic = async (courseId: string, chapterId: string, title: string, note?: string) => {
    try {
      await StorageAPI.addTopic(courseId, chapterId, title, note);
      await loadData();
      setToastMessage('Đã thêm bài học!');
    } catch (err: any) {
      setToastMessage(`Lỗi: ${err.message || 'Không thể thêm bài học'}`);
    }
  };

  const handleToggleTopic = async (courseId: string, chapterId: string, topicId: string) => {
    try {
      await StorageAPI.toggleTopic(courseId, chapterId, topicId);
      await loadData();
    } catch (err: any) {
      setToastMessage(`Lỗi: ${err.message || 'Không thể cập nhật bài học'}`);
    }
  };

  const handleDeleteTopic = async (courseId: string, chapterId: string, topicId: string) => {
    try {
      await StorageAPI.deleteTopic(courseId, chapterId, topicId);
      await loadData();
      setToastMessage('Đã xóa bài học');
    } catch (err: any) {
      setToastMessage(`Lỗi: ${err.message || 'Không thể xóa bài học'}`);
    }
  };

  const handleSaveStudent = async (studentData: { id?: string; name: string; phone?: string; note?: string }) => {
    await StorageAPI.saveStudent(studentData);
    await loadData();
    setToastMessage(studentData.id ? 'Cập nhật học viên thành công!' : 'Thêm học viên thành công!');
  };

  const handleDeleteStudent = async (id: string) => {
    await StorageAPI.deleteStudent(id);
    await loadData();
    setToastMessage('Đã xóa học viên');
  };

  const handleSaveClass = async (
    clsData: { id?: string; name: string; note?: string },
    studentIds: string[]
  ) => {
    await StorageAPI.saveClass(clsData, studentIds);
    await loadData();
    setToastMessage(clsData.id ? 'Cập nhật lớp học thành công!' : 'Tạo lớp học thành công!');
  };

  const handleDeleteClass = async (id: string) => {
    await StorageAPI.deleteClass(id);
    await loadData();
    setToastMessage('Đã xóa lớp học');
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f8f9fa' }}>
      <AppBar position="sticky" sx={{ bgcolor: '#ffffff', color: '#202124', borderBottom: '1px solid #dadce0' }}>
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1.5, sm: 3 } }}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <CalendarMonthIcon sx={{ color: '#1a73e8', fontSize: 28 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#202124', lineHeight: 1.1 }}>
                ClassPlan
              </Typography>
              <Typography variant="caption" sx={{ color: '#5f6368', fontSize: '0.7rem' }}>
                Lịch Dạy Online & Lộ Trình Khóa Học
              </Typography>
            </Box>
          </Stack>

        </Toolbar>

        <Box sx={{ borderTop: '1px solid #e8eaed', px: { xs: 0.5, sm: 3 }, bgcolor: '#ffffff' }}>
          <Tabs
            value={currentTab}
            onChange={(_, val) => setCurrentTab(val)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              minHeight: 48,
              '& .MuiTab-root': {
                minHeight: 48,
                px: { xs: 1.25, sm: 2 },
                textTransform: 'none',
                fontWeight: 600,
                fontSize: { xs: '0.8rem', sm: '0.9rem' },
                color: '#5f6368',
                '&.Mui-selected': { color: '#1a73e8' },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#1a73e8',
                height: 3,
              },
            }}
          >
            <Tab
              icon={<CalendarMonthIcon sx={{ fontSize: 18, mr: { xs: 0.25, sm: 0.5 } }} />}
              iconPosition="start"
              label={
                <Box component="span">
                  Lịch Dạy<Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}> Cố Định</Box>
                </Box>
              }
            />
            <Tab
              icon={<SchoolIcon sx={{ fontSize: 18, mr: { xs: 0.25, sm: 0.5 } }} />}
              iconPosition="start"
              label={
                <Box component="span">
                  Lộ Trình<Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}> & Bài Học</Box>
                </Box>
              }
            />
            <Tab
              icon={<PeopleIcon sx={{ fontSize: 18, mr: { xs: 0.25, sm: 0.5 } }} />}
              iconPosition="start"
              label="Học Viên & Lớp"
            />
          </Tabs>
        </Box>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: { xs: 1.5, sm: 3 }, px: { xs: 1, sm: 3 }, flex: 1 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress size={36} />
          </Box>
        ) : (
          <>
            {currentTab === 0 && (
              <CalendarView
                slots={slots}
                students={students}
                classes={classes}
                onOpenCreate={handleOpenCreateSlot}
                onEditSlot={handleEditSlot}
              />
            )}

            {currentTab === 1 && (
              <CurriculumView
                courses={courses}
                onAddCourse={handleAddCourse}
                onDeleteCourse={handleDeleteCourse}
                onAddChapter={handleAddChapter}
                onDeleteChapter={handleDeleteChapter}
                onAddTopic={handleAddTopic}
                onToggleTopic={handleToggleTopic}
                onDeleteTopic={handleDeleteTopic}
              />
            )}

            {currentTab === 2 && (
              <StudentsClassesView
                students={students}
                classes={classes}
                onAddStudent={() => {
                  setSelectedStudent(null);
                  setStudentDialogOpen(true);
                }}
                onEditStudent={(s) => {
                  setSelectedStudent(s);
                  setStudentDialogOpen(true);
                }}
                onDeleteStudent={handleDeleteStudent}
                onAddClass={() => {
                  setSelectedClass(null);
                  setClassDialogOpen(true);
                }}
                onEditClass={(c) => {
                  setSelectedClass(c);
                  setClassDialogOpen(true);
                }}
                onDeleteClass={handleDeleteClass}
              />
            )}
          </>
        )}
      </Container>

      <LessonDialog
        open={slotDialogOpen}
        onClose={() => setSlotDialogOpen(false)}
        onSaved={handleSaveSlot}
        onDelete={handleDeleteSlot}
        slot={selectedSlot}
        students={students}
        classes={classes}
        defaultDayOfWeek={defaultDayOfWeek}
      />

      <StudentDialog
        open={studentDialogOpen}
        onClose={() => setStudentDialogOpen(false)}
        onSave={handleSaveStudent}
        student={selectedStudent}
      />

      <ClassDialog
        open={classDialogOpen}
        onClose={() => setClassDialogOpen(false)}
        onSave={handleSaveClass}
        classItem={selectedClass}
        students={students}
        currentStudentIds={selectedClass ? classes.find((c) => c.id === selectedClass.id)?.student_ids : []}
      />

      <Snackbar
        open={Boolean(toastMessage)}
        autoHideDuration={3000}
        onClose={() => setToastMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%', borderRadius: 1 }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
