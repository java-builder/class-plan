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
} from '@mui/material';
import { Course } from '@/types/database';
import { AddIcon, DeleteIcon, SchoolIcon } from './Icons';

interface CurriculumViewProps {
  courses: Course[];
  onAddCourse: (name: string, description?: string) => Promise<void>;
  onDeleteCourse: (id: string) => Promise<void>;
  onAddChapter: (courseId: string, title: string) => Promise<void>;
  onDeleteChapter: (courseId: string, chapterId: string) => Promise<void>;
  onAddTopic: (courseId: string, chapterId: string, title: string) => Promise<void>;
  onToggleTopic: (courseId: string, chapterId: string, topicId: string) => Promise<void>;
  onDeleteTopic: (courseId: string, chapterId: string, topicId: string) => Promise<void>;
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

  const [openCourseDialog, setOpenCourseDialog] = React.useState(false);
  const [newCourseName, setNewCourseName] = React.useState('');
  const [newCourseDesc, setNewCourseDesc] = React.useState('');

  const [newChapterTitle, setNewChapterTitle] = React.useState('');
  const [activeChapterIdForTopic, setActiveChapterIdForTopic] = React.useState<string | null>(null);
  const [newTopicTitle, setNewTopicTitle] = React.useState('');

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

  const handleCreateChapter = async () => {
    if (!newChapterTitle.trim() || !activeCourse) return;
    await onAddChapter(activeCourse.id, newChapterTitle.trim());
    setNewChapterTitle('');
  };

  const handleCreateTopic = async (chapterId: string) => {
    if (!newTopicTitle.trim() || !activeCourse) return;
    await onAddTopic(activeCourse.id, chapterId, newTopicTitle.trim());
    setNewTopicTitle('');
    setActiveChapterIdForTopic(null);
  };

  return (
    <Box sx={{ maxWidth: 950, mx: 'auto' }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' }, mb: 2 }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, fontSize: { xs: '1.15rem', sm: '1.5rem' } }}>
            Lộ Trình Khóa Học & Bài Học
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
            Thiết kế các Chapter và bài giảng cho từng khóa học để theo dõi tiến độ dạy
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => setOpenCourseDialog(true)}
          sx={{ bgcolor: '#1a73e8', alignSelf: { xs: 'stretch', sm: 'auto' } }}
        >
          + Thêm khóa học
        </Button>
      </Stack>

      <Paper sx={{ p: 1.5, mb: 2, border: '1px solid #dadce0', borderRadius: 1 }}>
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            overflowX: 'auto',
            alignItems: 'center',
            pb: { xs: 0.5, sm: 0 },
            '&::-webkit-scrollbar': { height: 4 },
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#5f6368', mr: 0.5, flexShrink: 0 }}>
            KHÓA HỌC:
          </Typography>
          {courses.map((c) => {
            const isSelected = c.id === activeCourse?.id;
            return (
              <Chip
                key={c.id}
                icon={<SchoolIcon fontSize="small" />}
                label={c.name}
                onClick={() => setSelectedCourseId(c.id)}
                color={isSelected ? 'primary' : 'default'}
                variant={isSelected ? 'filled' : 'outlined'}
                sx={{
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  borderRadius: 1,
                  flexShrink: 0,
                }}
              />
            );
          })}
        </Box>
      </Paper>

      {activeCourse ? (
        <Card sx={{ border: '1px solid #dadce0', borderRadius: 1, p: { xs: 1.5, sm: 2.5 } }}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#202124', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                {activeCourse.name}
              </Typography>
              {activeCourse.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25, fontSize: '0.85rem' }}>
                  {activeCourse.description}
                </Typography>
              )}
            </Box>
            <IconButton
              size="small"
              color="error"
              onClick={() => {
                if (window.confirm(`Xóa khóa học "${activeCourse.name}"?`)) {
                  onDeleteCourse(activeCourse.id);
                }
              }}
              title="Xóa khóa học"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>

          <Divider sx={{ mb: 2 }} />

          <Paper
            variant="outlined"
            sx={{
              p: 1.5,
              mb: 2,
              bgcolor: '#f8f9fa',
              borderColor: '#dadce0',
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 1.25,
              alignItems: { xs: 'stretch', sm: 'center' },
            }}
          >
            <TextField
              size="small"
              placeholder="VD: Chapter Spring Data JPA, Chapter Spring Security..."
              value={newChapterTitle}
              onChange={(e) => setNewChapterTitle(e.target.value)}
              fullWidth
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateChapter();
              }}
              sx={{ bgcolor: '#fff' }}
            />
            <Button
              variant="contained"
              size="small"
              onClick={handleCreateChapter}
              sx={{ whiteSpace: 'nowrap', py: { xs: 1, sm: 0.75 } }}
            >
              + Thêm Chapter
            </Button>
          </Paper>

          {(!activeCourse.chapters || activeCourse.chapters.length === 0) ? (
            <Box sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>
              <Typography variant="body2">Khóa học này chưa có Chapter nào.</Typography>
              <Typography variant="caption">Nhập tên Chapter ở ô phía trên để bắt đầu tạo giáo trình.</Typography>
            </Box>
          ) : (
            <Stack spacing={1.5}>
              {activeCourse.chapters.map((chap) => {
                const totalTopics = chap.topics?.length || 0;
                const completedTopics = chap.topics?.filter((t) => t.is_completed).length || 0;

                return (
                  <Accordion
                    key={chap.id}
                    defaultExpanded
                    sx={{
                      border: '1px solid #dadce0',
                      borderRadius: '4px !important',
                      boxShadow: 'none',
                      '&:before': { display: 'none' },
                    }}
                  >
                    <AccordionSummary
                      sx={{
                        bgcolor: '#f8f9fa',
                        borderBottom: '1px solid #e8eaed',
                        minHeight: 48,
                        '& .MuiAccordionSummary-content': { my: 0.5 },
                      }}
                    >
                      <Stack
                        direction="row"
                        sx={{ width: '100%', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}
                      >
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 0.5, sm: 1 }} sx={{ alignItems: { sm: 'center' } }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1a73e8', fontSize: '0.9rem' }}>
                            {chap.title}
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
                            }}
                          />
                        </Stack>

                        <IconButton
                          component="span"
                          size="small"
                          color="inherit"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Xóa chapter "${chap.title}"?`)) {
                              onDeleteChapter(activeCourse.id, chap.id);
                            }
                          }}
                          title="Xóa chapter"
                        >
                          <DeleteIcon sx={{ fontSize: 18, color: '#80868b' }} />
                        </IconButton>
                      </Stack>
                    </AccordionSummary>

                    <AccordionDetails sx={{ p: { xs: 1, sm: 2 } }}>
                      {(!chap.topics || chap.topics.length === 0) ? (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
                          Chưa có bài học nào trong Chapter này.
                        </Typography>
                      ) : (
                        <List disablePadding sx={{ mb: 1.5 }}>
                          {chap.topics.map((topic) => (
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
                                primary={topic.title}
                                primaryTypographyProps={{
                                  fontSize: { xs: '0.85rem', sm: '0.9rem' },
                                  fontWeight: topic.is_completed ? 400 : 500,
                                  color: topic.is_completed ? '#5f6368' : '#202124',
                                  sx: { textDecoration: topic.is_completed ? 'line-through' : 'none' },
                                }}
                              />
                              <IconButton
                                size="small"
                                onClick={() => onDeleteTopic(activeCourse.id, chap.id, topic.id)}
                                title="Xóa bài này"
                              >
                                <DeleteIcon sx={{ fontSize: 16, color: '#bdc1c6' }} />
                              </IconButton>
                            </ListItem>
                          ))}
                        </List>
                      )}

                      {activeChapterIdForTopic === chap.id ? (
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ alignItems: 'stretch' }}>
                          <TextField
                            size="small"
                            placeholder="VD: Bài 1: QueryMethod, Bài 2: Projection..."
                            value={newTopicTitle}
                            onChange={(e) => setNewTopicTitle(e.target.value)}
                            fullWidth
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleCreateTopic(chap.id);
                            }}
                          />
                          <Stack direction="row" spacing={1} sx={{ alignSelf: { xs: 'flex-end', sm: 'auto' } }}>
                            <Button variant="contained" size="small" onClick={() => handleCreateTopic(chap.id)}>
                              Lưu
                            </Button>
                            <Button size="small" color="inherit" onClick={() => setActiveChapterIdForTopic(null)}>
                              Hủy
                            </Button>
                          </Stack>
                        </Stack>
                      ) : (
                        <Button
                          size="small"
                          startIcon={<AddIcon fontSize="small" />}
                          onClick={() => {
                            setActiveChapterIdForTopic(chap.id);
                            setNewTopicTitle('');
                          }}
                          sx={{ textTransform: 'none', color: '#1a73e8', fontWeight: 600, fontSize: '0.85rem' }}
                        >
                          + Thêm bài học mới
                        </Button>
                      )}
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
            + Tạo khóa học đầu tiên
          </Button>
        </Card>
      )}

      <Dialog open={openCourseDialog} onClose={() => setOpenCourseDialog(false)} maxWidth="xs" fullWidth>
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
    </Box>
  );
}
