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
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Student, ClassItem } from '@/types/database';
import { EditIcon, DeleteIcon, AddIcon } from './Icons';

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tab, setTab] = React.useState<0 | 1>(0);

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
            + Thêm học viên
          </Button>
        ) : (
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={onAddClass}
            sx={{ alignSelf: { xs: 'stretch', sm: 'auto' } }}
          >
            + Tạo lớp học mới
          </Button>
        )}
      </Stack>

      <Paper sx={{ mb: 2, border: '1px solid #dadce0', borderRadius: 1 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: { xs: 1, sm: 2 } }}>
          <Tab label={`Học viên (${students.length})`} sx={{ textTransform: 'none', fontWeight: 600, fontSize: { xs: '0.85rem', sm: '0.9rem' } }} />
          <Tab label={`Lớp học (${classes.length})`} sx={{ textTransform: 'none', fontWeight: 600, fontSize: { xs: '0.85rem', sm: '0.9rem' } }} />
        </Tabs>
      </Paper>

      {/* TAB 0: HỌC VIÊN */}
      {tab === 0 && (
        isMobile ? (
          <Stack spacing={1.5}>
            {students.length === 0 ? (
              <Paper sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
                Chưa có học viên nào.
              </Paper>
            ) : (
              students.map((s) => (
                <Card key={s.id} sx={{ border: '1px solid #dadce0', borderRadius: 1 }}>
                  <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1a73e8' }}>
                          {s.name}
                        </Typography>
                        {s.phone && (
                          <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                            📞 {s.phone}
                          </Typography>
                        )}
                        {s.note && (
                          <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', mt: 0.25 }}>
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
                          onClick={() => {
                            if (window.confirm(`Xóa học viên "${s.name}"?`)) onDeleteStudent(s.id);
                          }}
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
        ) : (
          <TableContainer component={Paper} sx={{ border: '1px solid #dadce0', borderRadius: 1 }}>
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
                      Chưa có học viên nào. Bấm nút "+ Thêm học viên" để bắt đầu.
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
                          onClick={() => {
                            if (window.confirm(`Xóa học viên "${s.name}"?`)) onDeleteStudent(s.id);
                          }}
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
        )
      )}

      {/* TAB 1: LỚP HỌC */}
      {tab === 1 && (
        isMobile ? (
          <Stack spacing={1.5}>
            {classes.length === 0 ? (
              <Paper sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
                Chưa có lớp học nào.
              </Paper>
            ) : (
              classes.map((c) => (
                <Card key={c.id} sx={{ border: '1px solid #dadce0', borderRadius: 1 }}>
                  <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e8e3e' }}>
                            {c.name}
                          </Typography>
                          <Chip
                            label={`${c.members_count ?? 0} bạn`}
                            size="small"
                            sx={{ bgcolor: '#e6f4ea', color: '#1e8e3e', fontWeight: 600, height: 20, fontSize: '0.7rem' }}
                          />
                        </Stack>
                        {c.note && (
                          <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
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
                          onClick={() => {
                            if (window.confirm(`Xóa lớp "${c.name}"?`)) onDeleteClass(c.id);
                          }}
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
        ) : (
          <TableContainer component={Paper} sx={{ border: '1px solid #dadce0', borderRadius: 1 }}>
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
                      Chưa có lớp học nào. Bấm nút "+ Tạo lớp học mới" để bắt đầu.
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
                          onClick={() => {
                            if (window.confirm(`Xóa lớp "${c.name}"?`)) onDeleteClass(c.id);
                          }}
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
        )
      )}
    </Box>
  );
}
