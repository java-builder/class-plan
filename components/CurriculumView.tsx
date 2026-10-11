'use client';

import * as React from 'react';
import {
  Box,
  Card,
  Typography,
  Stack,
  Button,
  TextField,
  IconButton,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
} from '@mui/material';
import { Course } from '@/types/database';
import { AddIcon, DeleteIcon, SchoolIcon, ExpandMoreIcon } from './Icons';
import ConfirmDialog from './ConfirmDialog';

interface CurriculumViewProps {
  courses: Course[];
  onAddCourse: (name: string, description?: string) => Promise<void>;
  onDeleteCourse: (id: string) => Promise<void>;
  onAddChapter: (courseId: string, title: string) => Promise<void>;
  onDeleteChapter: (courseId: string, chapterId: string) => Promise<void>;
  onAddTopic: (courseId: string, chapterId: string, title: string, note?: string) => Promise<void>;
  onToggleTopic: (courseId: string, chapterId: string, topicId: string) => Promise<void>;
  onDeleteTopic: (courseId: string, chapterId: string, topicId: string) => Promise<void>;
}

function formatChapterTitle(title: string, index: number): string {
  const trimmed = title.trim();
  if (/^(chương|chapter|\d+[\.:\-])\s*/i.test(trimmed)) {
    return trimmed;
  }
  return `Chapter ${index + 1}: ${trimmed}`;
}

function formatTopicTitle(title: string, index: number): string {
  const trimmed = title.trim();
  if (/^(bài|lesson|topic|\d+[\.:\-])\s*/i.test(trimmed)) {
    return trimmed;
  }
  return `Bài ${index + 1}: ${trimmed}`;
}

export default function CurriculumView({
  courses,
  onAddCourse,
  onDeleteCourse,
  onAddChapter,
  onDeleteChapter,
  onAddTopic,
  onToggleTopic,
  onDeleteTopic,
}: CurriculumViewProps) {
  const [selectedCourseId, setSelectedCourseId] = React.useState<string>(() => courses[0]?.id || '');
  const [expandedChapterIds, setExpandedChapterIds] = React.useState<Record<string, boolean>>({});

  const toggleChapter = (chapterId: string) => {
    setExpandedChapterIds((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  const handleExpandAll = () => {
    if (!activeCourse?.chapters) return;
    const allExpanded: Record<string, boolean> = {};
    activeCourse.chapters.forEach((ch) => {
      allExpanded[ch.id] = true;
    });
    setExpandedChapterIds(allExpanded);
  };

  const handleCollapseAll = () => {
    setExpandedChapterIds({});
  };

  const [openCourseDialog, setOpenCourseDialog] = React.useState(false);
  const [newCourseName, setNewCourseName] = React.useState('');
  const [newCourseDesc, setNewCourseDesc] = React.useState('');

  const [openChapterDialog, setOpenChapterDialog] = React.useState(false);
  const [chapterDialogTitle, setChapterDialogTitle] = React.useState('');

  const [openTopicDialog, setOpenTopicDialog] = React.useState(false);
  const [topicChapterId, setTopicChapterId] = React.useState<string | null>(null);
  const [topicDialogTitle, setTopicDialogTitle] = React.useState('');
  const [topicDialogNote, setTopicDialogNote] = React.useState('');

  const [confirmDialog, setConfirmDialog] = React.useState<{
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => Promise<void>;
  }>({
    open: false,
    title: '',
    message: '',
    onConfirm: async () => {},
  });

  React.useEffect(() => {
    if (courses.length > 0 && (!selectedCourseId || !courses.find((c) => c.id === selectedCourseId))) {
      setSelectedCourseId(courses[0].id);
    }
  }, [courses, selectedCourseId]);

  const activeCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  const handleCreateCourse = async () => {
    if (!newCourseName.trim()) return;
    await onAddCourse(newCourseName.trim(), newCourseDesc.trim());
    setNewCourseName('');
    setNewCourseDesc('');
    setOpenCourseDialog(false);
  };

  const handleSaveChapterDialog = async () => {
    if (!chapterDialogTitle.trim() || !activeCourse) return;
    const nextNum = (activeCourse.chapters?.length || 0) + 1;
    const raw = chapterDialogTitle.trim();
    const titleToSave = /^(chương|chapter|\d+[\.:\-])\s*/i.test(raw)
      ? raw
      : `Chapter ${nextNum}: ${raw}`;
    await onAddChapter(activeCourse.id, titleToSave);
    setChapterDialogTitle('');
    setOpenChapterDialog(false);
  };

  const handleSaveTopicDialog = async () => {
    if (!topicDialogTitle.trim() || !activeCourse || !topicChapterId) return;
    const currentChap = activeCourse.chapters?.find((c) => c.id === topicChapterId);
    const nextNum = (currentChap?.topics?.length || 0) + 1;
    const raw = topicDialogTitle.trim();
    const titleToSave = /^(bài|lesson|topic|\d+[\.:\-])\s*/i.test(raw)
      ? raw
      : `Bài ${nextNum}: ${raw}`;
    await onAddTopic(activeCourse.id, topicChapterId, titleToSave, topicDialogNote.trim() || undefined);
    setTopicDialogTitle('');
    setTopicDialogNote('');
    setTopicChapterId(null);
    setOpenTopicDialog(false);
  };

  const promptDeleteCourse = (course: Course) => {
    setConfirmDialog({
      open: true,
      title: 'Xóa khóa học',
      message: `Bạn có chắc chắn muốn xóa khóa học "${course.name}" và toàn bộ bài giảng bên trong?`,
      onConfirm: async () => {
        await onDeleteCourse(course.id);
        setConfirmDialog((prev) => ({ ...prev, open: false }));
      },
    });
  };

  const promptDeleteChapter = (chapterId: string, chapterTitle: string) => {
    if (!activeCourse) return;
    setConfirmDialog({
      open: true,
      title: 'Xóa Chapter',
      message: `Bạn có chắc chắn muốn xóa chapter "${chapterTitle}" và tất cả bài học trong chapter này?`,
      onConfirm: async () => {
        await onDeleteChapter(activeCourse.id, chapterId);
        setConfirmDialog((prev) => ({ ...prev, open: false }));
      },
    });
  };

  const promptDeleteTopic = (chapterId: string, topicId: string, topicTitle: string) => {
    if (!activeCourse) return;
    setConfirmDialog({
      open: true,
      title: 'Xóa bài học',
      message: `Bạn có chắc chắn muốn xóa bài học "${topicTitle}"?`,
      onConfirm: async () => {
        await onDeleteTopic(activeCourse.id, chapterId, topicId);
        setConfirmDialog((prev) => ({ ...prev, open: false }));
      },
    });
  };

  return (
    <Box>
      <Paper sx={{ p: { xs: 1.5, sm: 2 }, mb: 2.5, border: '1px solid #dadce0', borderRadius: 1 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' }, mb: 2 }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#202124', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              Lộ Trình Khóa Học & Bài Học
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
              Chọn khóa học để xem và quản lý danh sách Chapter cùng các bài giảng tương ứng
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => setOpenCourseDialog(true)}
            sx={{ bgcolor: '#1a73e8', whiteSpace: 'nowrap !important', py: { xs: 0.9, sm: 0.75 }, px: 2, flexShrink: 0 }}
          >
            Thêm khóa học
          </Button>
        </Stack>

        {courses.length === 0 ? (
          <Box sx={{ py: 3, textAlign: 'center', color: 'text.secondary' }}>
            <Typography variant="body2">Chưa có khóa học nào.</Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(auto-fill, minmax(280px, 340px))',
              },
              gap: 1.5,
            }}
          >
            {courses.map((course) => {
              const isSelected = course.id === activeCourse?.id;
              const totalChapters = course.chapters?.length || 0;
              const totalTopics = (course.chapters || []).reduce(
                (acc, ch) => acc + (ch.topics?.length || 0),
                0
              );
              const completedTopics = (course.chapters || []).reduce(
                (acc, ch) => acc + (ch.topics?.filter((t) => t.is_completed).length || 0),
                0
              );
              const percent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

              return (
                <Card
                  key={course.id}
                  onClick={() => setSelectedCourseId(course.id)}
                  sx={{
                    p: 1.5,
                    borderRadius: 1,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease-in-out',
                    border: isSelected ? '2px solid #1a73e8' : '1px solid #dadce0',
                    bgcolor: isSelected ? '#f8fafd' : '#ffffff',
                    boxShadow: isSelected ? '0 2px 8px rgba(26, 115, 232, 0.16)' : 'none',
                    '&:hover': {
                      borderColor: '#1a73e8',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
                    },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.75 }}>
                      <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start', flex: 1, minWidth: 0, mr: 0.5 }}>
                        <Box
                          sx={{
                            width: 28,
                            height: 28,
                            borderRadius: 1,
                            bgcolor: isSelected ? '#1a73e8' : '#e8f0fe',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            mt: 0.25,
                          }}
                        >
                          <SchoolIcon sx={{ fontSize: 16, color: isSelected ? '#ffffff' : '#1a73e8' }} />
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 700,
                              color: isSelected ? '#1a73e8' : '#202124',
                              fontSize: '0.85rem',
                              lineHeight: 1.3,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {course.name}
                          </Typography>
                        </Box>
                      </Stack>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          promptDeleteCourse(course);
                        }}
                        title="Xóa khóa học"
                        sx={{ p: 0.25, flexShrink: 0, color: '#80868b', '&:hover': { color: '#d93025' } }}
                      >
                        <DeleteIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Stack>
                  </Box>

                  <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid #f1f3f4' }}>
                    <Stack direction="row" spacing={0.75} sx={{ mb: 0.75, alignItems: 'center' }}>
                      <Chip
                        label={`${totalChapters} chương`}
                        size="small"
                        sx={{ height: 20, fontSize: '0.7rem', bgcolor: '#f1f3f4', fontWeight: 500 }}
                      />
                      <Chip
                        label={`${totalTopics} bài`}
                        size="small"
                        sx={{ height: 20, fontSize: '0.7rem', bgcolor: '#f1f3f4', fontWeight: 500 }}
                      />
                      {isSelected && (
                        <Chip
                          label="Đang xem"
                          size="small"
                          color="primary"
                          sx={{ height: 20, fontSize: '0.7rem', fontWeight: 600, ml: 'auto !important' }}
                        />
                      )}
                    </Stack>

                    <Box sx={{ width: '100%' }}>
                      <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 0.25 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                          Tiến độ
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.7rem',
                            color: percent === 100 ? '#1e8e3e' : '#1a73e8',
                          }}
                        >
                          {percent}% ({completedTopics}/{totalTopics})
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={percent}
                        sx={{
                          height: 4,
                          borderRadius: 1,
                          bgcolor: '#e8eaed',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: percent === 100 ? '#1e8e3e' : '#1a73e8',
                          },
                        }}
                      />
                    </Box>
                  </Box>
                </Card>
              );
            })}
          </Box>
        )}
      </Paper>

      {activeCourse ? (
        <Card sx={{ border: '1px solid #dadce0', borderRadius: 1, p: { xs: 1.5, sm: 2.5 } }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' }, mb: 2 }}
            spacing={1.5}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#1a73e8', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Danh Sách Chapter & Bài Học
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#202124', fontSize: { xs: '1.05rem', sm: '1.25rem' } }}>
                {activeCourse.name}
              </Typography>
            </Box>

            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              {activeCourse.chapters && activeCourse.chapters.length > 0 && (
                <>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={handleExpandAll}
                    sx={{ fontSize: '0.75rem', py: 0.5, px: 1, textTransform: 'none', borderColor: '#dadce0', color: '#5f6368' }}
                  >
                    Mở tất cả
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={handleCollapseAll}
                    sx={{ fontSize: '0.75rem', py: 0.5, px: 1, textTransform: 'none', borderColor: '#dadce0', color: '#5f6368' }}
                  >
                    Thu gọn
                  </Button>
                </>
              )}
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => {
                  setChapterDialogTitle('');
                  setOpenChapterDialog(true);
                }}
                sx={{ bgcolor: '#1a73e8', whiteSpace: 'nowrap !important', py: 0.8, px: 2, flexShrink: 0 }}
              >
                Thêm Chapter
              </Button>
            </Stack>
          </Stack>

          <Divider sx={{ mb: 2 }} />

          {(!activeCourse.chapters || activeCourse.chapters.length === 0) ? (
            <Box
              sx={{
                py: 5,
                textAlign: 'center',
                color: 'text.secondary',
                bgcolor: '#f8f9fa',
                borderRadius: 1,
                border: '1px dashed #dadce0',
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5, color: '#3c4043' }}>
                Khóa học này chưa có Chapter nào.
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Bấm nút bên dưới để tạo Chapter bài giảng đầu tiên cho khóa học này.
              </Typography>
              <Button
                variant="contained"
                size="medium"
                startIcon={<AddIcon />}
                onClick={() => {
                  setChapterDialogTitle('');
                  setOpenChapterDialog(true);
                }}
                sx={{ bgcolor: '#1a73e8' }}
              >
                Tạo Chapter đầu tiên
              </Button>
            </Box>
          ) : (
            <Stack spacing={1.25}>
              {activeCourse.chapters.map((chap, chapIndex) => {
                const totalTopics = chap.topics?.length || 0;
                const completedTopics = chap.topics?.filter((t) => t.is_completed).length || 0;
                const displayChapTitle = formatChapterTitle(chap.title, chapIndex);
                const isExpanded = Boolean(expandedChapterIds[chap.id]);

                return (
                  <Accordion
                    key={chap.id}
                    expanded={isExpanded}
                    onChange={() => toggleChapter(chap.id)}
                    sx={{
                      border: '1px solid #dadce0',
                      borderRadius: '6px !important',
                      boxShadow: 'none',
                      overflow: 'hidden',
                      '&:before': { display: 'none' },
                      '&.Mui-expanded': {
                        borderColor: '#1a73e8',
                        boxShadow: '0 1px 4px rgba(26, 115, 232, 0.12)',
                      },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon sx={{ color: '#5f6368', fontSize: 20 }} />}
                      sx={{
                        bgcolor: isExpanded ? '#f8fafd' : '#f8f9fa',
                        borderBottom: isExpanded ? '1px solid #e8eaed' : 'none',
                        minHeight: 48,
                        px: { xs: 1.25, sm: 2 },
                        '& .MuiAccordionSummary-content': { my: 0.75 },
                        '&:hover': { bgcolor: '#f1f3f4' },
                        transition: 'background-color 0.15s ease',
                      }}
                    >
                      <Stack
                        direction="row"
                        sx={{ width: '100%', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}
                      >
                        <Stack
                          direction={{ xs: 'column', sm: 'row' }}
                          spacing={{ xs: 0.5, sm: 1.25 }}
                          sx={{ alignItems: { sm: 'center' }, flex: 1, minWidth: 0, pr: 1 }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 700,
                              color: isExpanded ? '#1a73e8' : '#202124',
                              fontSize: { xs: '0.85rem', sm: '0.9rem' },
                              wordBreak: 'break-word',
                            }}
                          >
                            {displayChapTitle}
                          </Typography>
                          <Chip
                            label={`${completedTopics}/${totalTopics} bài`}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              bgcolor: completedTopics === totalTopics && totalTopics > 0 ? '#e6f4ea' : '#e8eaed',
                              color: completedTopics === totalTopics && totalTopics > 0 ? '#1e8e3e' : '#5f6368',
                              alignSelf: 'flex-start',
                              flexShrink: 0,
                            }}
                          />
                        </Stack>

                        <IconButton
                          component="span"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            promptDeleteChapter(chap.id, displayChapTitle);
                          }}
                          title="Xóa chapter"
                          sx={{ p: 0.5, color: '#80868b', '&:hover': { color: '#d93025' } }}
                        >
                          <DeleteIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Stack>
                    </AccordionSummary>

                    <AccordionDetails sx={{ p: { xs: 1.25, sm: 2 }, bgcolor: '#ffffff' }}>
                      {(!chap.topics || chap.topics.length === 0) ? (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
                          Chưa có bài học nào trong Chapter này.
                        </Typography>
                      ) : (
                        <List disablePadding sx={{ mb: 1.5 }}>
                          {chap.topics.map((topic, topicIndex) => {
                            const displayTopicTitle = formatTopicTitle(topic.title, topicIndex);

                            return (
                              <ListItem
                                key={topic.id}
                                sx={{
                                  py: 0.5,
                                  px: { xs: 0.5, sm: 1 },
                                  borderRadius: 1,
                                  bgcolor: topic.is_completed ? '#f8f9fa' : 'transparent',
                                  '&:hover': { bgcolor: '#f1f3f4' },
                                }}
                              >
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                  <Checkbox
                                    size="small"
                                    checked={Boolean(topic.is_completed)}
                                    onChange={() => onToggleTopic(activeCourse.id, chap.id, topic.id)}
                                    title="Đánh dấu đã dạy"
                                  />
                                </ListItemIcon>
                                <ListItemText
                                  primary={displayTopicTitle}
                                  secondary={topic.note}
                                  primaryTypographyProps={{
                                    fontSize: { xs: '0.85rem', sm: '0.9rem' },
                                    fontWeight: topic.is_completed ? 400 : 500,
                                    color: topic.is_completed ? '#5f6368' : '#202124',
                                    sx: {
                                      textDecoration: topic.is_completed ? 'line-through' : 'none',
                                      wordBreak: 'break-word',
                                    },
                                  }}
                                  secondaryTypographyProps={{
                                    fontSize: '0.75rem',
                                    color: '#5f6368',
                                  }}
                                />
                                <IconButton
                                  size="small"
                                  onClick={() => promptDeleteTopic(chap.id, topic.id, displayTopicTitle)}
                                  title="Xóa bài này"
                                  sx={{ p: 0.5, color: '#80868b', '&:hover': { color: '#d93025' } }}
                                >
                                  <DeleteIcon sx={{ fontSize: 16 }} />
                                </IconButton>
                              </ListItem>
                            );
                          })}
                        </List>
                      )}

                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<AddIcon fontSize="small" />}
                        onClick={() => {
                          setTopicChapterId(chap.id);
                          setTopicDialogTitle('');
                          setTopicDialogNote('');
                          setOpenTopicDialog(true);
                        }}
                        sx={{
                          textTransform: 'none',
                          color: '#1a73e8',
                          borderColor: '#dadce0',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                        }}
                      >
                        Thêm bài học mới
                      </Button>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </Stack>
          )}
        </Card>
      ) : (
        <Card sx={{ p: 4, textAlign: 'center', border: '1px solid #dadce0' }}>
          <Typography variant="body1">Chưa có khóa học nào.</Typography>
          <Button variant="contained" sx={{ mt: 2 }} onClick={() => setOpenCourseDialog(true)}>
            Tạo khóa học đầu tiên
          </Button>
        </Card>
      )}

      <Dialog
        open={openCourseDialog}
        onClose={() => setOpenCourseDialog(false)}
        maxWidth="sm"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            m: { xs: 2, sm: 3 },
            width: '100%',
            maxWidth: { xs: 'calc(100% - 32px)', sm: 540, md: 600 },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Tạo khóa học mới</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Tên khóa học"
              size="small"
              placeholder="VD: Lập trình Java Spring Boot, Luyện thi VIP..."
              value={newCourseName}
              onChange={(e) => setNewCourseName(e.target.value)}
              required
              fullWidth
              autoFocus
            />
            <TextField
              label="Mô tả khóa học"
              size="small"
              multiline
              rows={2}
              value={newCourseDesc}
              onChange={(e) => setNewCourseDesc(e.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 1.5 }}>
          <Button onClick={() => setOpenCourseDialog(false)} color="inherit">
            Hủy
          </Button>
          <Button variant="contained" onClick={handleCreateCourse}>
            Tạo khóa học
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openChapterDialog}
        onClose={() => setOpenChapterDialog(false)}
        maxWidth="sm"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            m: { xs: 2, sm: 3 },
            width: '100%',
            maxWidth: { xs: 'calc(100% - 32px)', sm: 500, md: 540 },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Thêm Chapter mới</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {activeCourse && (
              <Typography variant="body2" color="text.secondary">
                Khóa học: <strong>{activeCourse.name}</strong>
              </Typography>
            )}
            <TextField
              label="Tên Chapter"
              size="small"
              placeholder={`VD: Spring Boot, Lập trình Microservices... (tự động đánh số Chapter ${(activeCourse?.chapters?.length || 0) + 1})`}
              value={chapterDialogTitle}
              onChange={(e) => setChapterDialogTitle(e.target.value)}
              required
              fullWidth
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveChapterDialog();
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 1.5 }}>
          <Button onClick={() => setOpenChapterDialog(false)} color="inherit">
            Hủy
          </Button>
          <Button variant="contained" onClick={handleSaveChapterDialog}>
            Tạo Chapter
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openTopicDialog}
        onClose={() => setOpenTopicDialog(false)}
        maxWidth="sm"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            m: { xs: 2, sm: 3 },
            width: '100%',
            maxWidth: { xs: 'calc(100% - 32px)', sm: 500, md: 540 },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Thêm bài học mới</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {activeCourse && (
              <Typography variant="body2" color="text.secondary">
                Thuộc Chapter:{' '}
                <strong>
                  {(() => {
                    const idx = activeCourse.chapters?.findIndex((c) => c.id === topicChapterId) ?? -1;
                    const c = activeCourse.chapters?.[idx];
                    return c ? formatChapterTitle(c.title, idx) : '';
                  })()}
                </strong>
              </Typography>
            )}
            <TextField
              label="Tên bài học"
              size="small"
              placeholder="VD: Spring Boot là gì ?... (tự động đánh số Bài)"
              value={topicDialogTitle}
              onChange={(e) => setTopicDialogTitle(e.target.value)}
              required
              fullWidth
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveTopicDialog();
              }}
            />
            <TextField
              label="Ghi chú / Link tài liệu (tùy chọn)"
              size="small"
              placeholder="VD: Slide bài giảng, link github..."
              value={topicDialogNote}
              onChange={(e) => setTopicDialogNote(e.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 1.5 }}>
          <Button onClick={() => setOpenTopicDialog(false)} color="inherit">
            Hủy
          </Button>
          <Button variant="contained" onClick={handleSaveTopicDialog}>
            Thêm bài học
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, open: false }))}
      />
    </Box>
  );
}
