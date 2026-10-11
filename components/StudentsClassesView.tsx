'use client';

import * as React from 'react';
import {
  Box,
  Typography,
  Stack,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Paper,
  Card,
  CardContent,
} from '@mui/material';
import { Student, ClassItem } from '@/types/database';
import { EditIcon, DeleteIcon, AddIcon } from './Icons';
import ConfirmDialog from './ConfirmDialog';

interface StudentsClassesViewProps {
  students: Student[];
  classes: (ClassItem & { members_count?: number; student_ids?: string[] })[];
  onAddStudent: () => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => Promise<void>;
  onAddClass: () => void;
  onEditClass: (cls: ClassItem) => void;
  onDeleteClass: (id: string) => Promise<void>;
}

export default function StudentsClassesView({
  students,
  classes,
  onAddStudent,
  onEditStudent,
  onDeleteStudent,
  onAddClass,
  onEditClass,
  onDeleteClass,
}: StudentsClassesViewProps) {
  const [tab, setTab] = React.useState<0 | 1>(0);
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

  const promptDeleteStudent = (student: Student) => {
    setConfirmDialog({
      open: true,
      title: 'Xóa học viên',
      message: `Bạn có chắc chắn muốn xóa học viên "${student.name}"?`,
      onConfirm: async () => {
        await onDeleteStudent(student.id);
        setConfirmDialog((prev) => ({ ...prev, open: false }));
      },
    });
  };

  const promptDeleteClass = (cls: ClassItem) => {
    setConfirmDialog({
      open: true,
      title: 'Xóa lớp học',
      message: `Bạn có chắc chắn muốn xóa lớp học "${cls.name}"?`,
      onConfirm: async () => {
        await onDeleteClass(cls.id);
        setConfirmDialog((prev) => ({ ...prev, open: false }));
      },
    });
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' }, mb: 2 }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, fontSize: { xs: '1.15rem', sm: '1.5rem' } }}>
            Quản lý Học viên & Lớp học
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
            Danh sách học viên học 1:1 và các nhóm lớp học trực tuyến
          </Typography>
        </Box>

        {tab === 0 ? (
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={onAddStudent}
            sx={{ alignSelf: { xs: 'stretch', sm: 'auto' } }}
          >
            Thêm học viên
          </Button>
        ) : (
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={onAddClass}
            sx={{ alignSelf: { xs: 'stretch', sm: 'auto' } }}
          >
            Tạo lớp học mới
          </Button>
        )}
      </Stack>

      <Paper sx={{ mb: 2, border: '1px solid #dadce0', borderRadius: 1 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: { xs: 1, sm: 2 } }}>
          <Tab label={`Học viên (${students.length})`} sx={{ textTransform: 'none', fontWeight: 600, fontSize: { xs: '0.85rem', sm: '0.9rem' } }} />
          <Tab label={`Lớp học (${classes.length})`} sx={{ textTransform: 'none', fontWeight: 600, fontSize: { xs: '0.85rem', sm: '0.9rem' } }} />
        </Tabs>
      </Paper>

      {tab === 0 && (
        <Box>
          <Stack spacing={1.5} sx={{ display: { xs: 'flex', sm: 'none' } }}>
            {students.length === 0 ? (
              <Paper sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
                Chưa có học viên nào.
              </Paper>
            ) : (
              students.map((s) => (
                <Card key={s.id} sx={{ border: '1px solid #dadce0', borderRadius: 1 }}>
                  <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ flex: 1, pr: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1a73e8', wordBreak: 'break-word' }}>
                          {s.name}
                        </Typography>
                        {s.phone && (
                          <Typography
                            component="a"
                            href={`tel:${s.phone}`}
                            variant="caption"
                            sx={{
                              display: 'block',
                              color: '#1a73e8',
                              textDecoration: 'none',
                              mt: 0.25,
                              fontWeight: 500,
                            }}
                          >
                            📞 {s.phone}
                          </Typography>
                        )}
                        {s.note && (
                          <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', mt: 0.5, wordBreak: 'break-word' }}>
                            📝 {s.note}
                          </Typography>
                        )}
                      </Box>
                      <Stack direction="row" spacing={0.5}>
                        <IconButton size="small" onClick={() => onEditStudent(s)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => promptDeleteStudent(s)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              ))
            )}
          </Stack>

          <TableContainer component={Paper} sx={{ display: { xs: 'none', sm: 'block' }, border: '1px solid #dadce0', borderRadius: 1 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Họ và tên</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Số điện thoại</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Ghi chú học tập</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      Chưa có học viên nào. Bấm nút &quot;+ Thêm học viên&quot; để bắt đầu.
                    </TableCell>
                  </TableRow>
                ) : (
                  students.map((s) => (
                    <TableRow key={s.id} hover>
                      <TableCell sx={{ fontWeight: 600, color: '#1a73e8' }}>
                        {s.name}
                      </TableCell>
                      <TableCell>{s.phone || '—'}</TableCell>
                      <TableCell sx={{ color: 'text.secondary', maxWidth: 300 }}>
                        {s.note || '—'}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => onEditStudent(s)} title="Sửa">
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => promptDeleteStudent(s)}
                          title="Xóa"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {tab === 1 && (
        <Box>
          <Stack spacing={1.5} sx={{ display: { xs: 'flex', sm: 'none' } }}>
            {classes.length === 0 ? (
              <Paper sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
                Chưa có lớp học nào.
              </Paper>
            ) : (
              classes.map((c) => (
                <Card key={c.id} sx={{ border: '1px solid #dadce0', borderRadius: 1 }}>
                  <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ flex: 1, pr: 1 }}>
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5, flexWrap: 'wrap' }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e8e3e', wordBreak: 'break-word' }}>
                            {c.name}
                          </Typography>
                          <Chip
                            label={`${c.members_count ?? 0} bạn`}
                            size="small"
                            sx={{ bgcolor: '#e6f4ea', color: '#1e8e3e', fontWeight: 600, height: 20, fontSize: '0.7rem' }}
                          />
                        </Stack>
                        {c.note && (
                          <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', wordBreak: 'break-word' }}>
                            📝 {c.note}
                          </Typography>
                        )}
                      </Box>
                      <Stack direction="row" spacing={0.5}>
                        <IconButton size="small" onClick={() => onEditClass(c)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => promptDeleteClass(c)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              ))
            )}
          </Stack>

          <TableContainer component={Paper} sx={{ display: { xs: 'none', sm: 'block' }, border: '1px solid #dadce0', borderRadius: 1 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Tên lớp học</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Số học viên</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Ghi chú</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {classes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      Chưa có lớp học nào. Bấm nút &quot;+ Tạo lớp học mới&quot; để bắt đầu.
                    </TableCell>
                  </TableRow>
                ) : (
                  classes.map((c) => (
                    <TableRow key={c.id} hover>
                      <TableCell sx={{ fontWeight: 600, color: '#1e8e3e' }}>
                        {c.name}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${c.members_count ?? 0} bạn`}
                          size="small"
                          sx={{ bgcolor: '#e6f4ea', color: '#1e8e3e', fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: 'text.secondary', maxWidth: 300 }}>
                        {c.note || '—'}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => onEditClass(c)} title="Sửa">
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => promptDeleteClass(c)}
                          title="Xóa"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

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
