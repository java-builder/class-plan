'use client';

import * as React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  Stack,
  Box,
} from '@mui/material';
import { ScheduleSlot, Student, ClassItem } from '@/types/database';
import ConfirmDialog from './ConfirmDialog';

interface LessonDialogProps {
  open: boolean;
  onClose: () => void;
  onSaved: (slot: {
    id?: string;
    title: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
    student_id?: string | null;
    class_id?: string | null;
    location_or_link?: string | null;
    note?: string | null;
  }) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  slot?: ScheduleSlot | null;
  students: Student[];
  classes: ClassItem[];
  defaultDayOfWeek?: number;
}

const DAY_OPTIONS = [
  { value: 1, label: 'Thứ Hai' },
  { value: 2, label: 'Thứ Ba' },
  { value: 3, label: 'Thứ Tư' },
  { value: 4, label: 'Thứ Năm' },
  { value: 5, label: 'Thứ Sáu' },
  { value: 6, label: 'Thứ Bảy' },
  { value: 0, label: 'Chủ Nhật' },
];

export default function LessonDialog({
  open,
  onClose,
  onSaved,
  onDelete,
  slot,
  students,
  classes,
  defaultDayOfWeek = 1,
}: LessonDialogProps) {
  const isEdit = Boolean(slot?.id);

  const [type, setType] = React.useState<'student' | 'class'>('student');
  const [dayOfWeek, setDayOfWeek] = React.useState<number>(1);
  const [studentId, setStudentId] = React.useState('');
  const [classId, setClassId] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [startTime, setStartTime] = React.useState('19:00');
  const [endTime, setEndTime] = React.useState('20:30');
  const [location, setLocation] = React.useState('meet.google.com/');
  const [note, setNote] = React.useState('');
  const [saving, setSaving] = React.useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      if (slot) {
        setType(slot.class_id ? 'class' : 'student');
        setDayOfWeek(slot.day_of_week);
        setStudentId(slot.student_id || '');
        setClassId(slot.class_id || '');
        setTitle(slot.title);
        setStartTime(slot.start_time);
        setEndTime(slot.end_time);
        setLocation(slot.location_or_link || '');
        setNote(slot.note || '');
      } else {
        setDayOfWeek(defaultDayOfWeek);
        setTitle('');
        setLocation('meet.google.com/');
        setNote('');
        setStartTime('19:30');
        setEndTime('21:00');

        if (students.length > 0) {
          setType('student');
          setStudentId(students[0].id);
          setTitle(`Học 1:1 - ${students[0].name}`);
        } else if (classes.length > 0) {
          setType('class');
          setClassId(classes[0].id);
          setTitle(`Lớp - ${classes[0].name}`);
        }
      }
    }
  }, [open, slot, students, classes, defaultDayOfWeek]);

  const handleTypeChange = (newType: 'student' | 'class') => {
    setType(newType);
    if (newType === 'student' && students.length > 0) {
      const s = students.find((x) => x.id === studentId) || students[0];
      setStudentId(s.id);
      setTitle(`Học 1:1 - ${s.name}`);
    } else if (newType === 'class' && classes.length > 0) {
      const c = classes.find((x) => x.id === classId) || classes[0];
      setClassId(c.id);
      setTitle(`Lớp - ${c.name}`);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !startTime || !endTime) return;
    setSaving(true);
    try {
      await onSaved({
        id: slot?.id,
        title: title.trim(),
        day_of_week: dayOfWeek,
        start_time: startTime,
        end_time: endTime,
        student_id: type === 'student' ? studentId : null,
        class_id: type === 'class' ? classId : null,
        location_or_link: location.trim() || null,
        note: note.trim() || null,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          m: { xs: 2, sm: 3 },
          width: '100%',
          maxWidth: { xs: 'calc(100% - 32px)', sm: 600, md: 680 },
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>
        {isEdit ? 'Chỉnh sửa ca học cố định' : 'Thêm ca học cố định mới'}
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <FormControl>
            <FormLabel sx={{ fontSize: '0.85rem', fontWeight: 600, mb: 0.5 }}>Hình thức học</FormLabel>
            <RadioGroup
              row
              value={type}
              onChange={(e) => handleTypeChange(e.target.value as 'student' | 'class')}
              sx={{ gap: { xs: 0.5, sm: 2 } }}
            >
              <FormControlLabel value="student" control={<Radio size="small" />} label="Dạy 1:1 (Cá nhân)" />
              <FormControlLabel value="class" control={<Radio size="small" />} label="Dạy theo Lớp học" />
            </RadioGroup>
          </FormControl>

          {type === 'student' ? (
            <TextField
              select
              label="Chọn Học viên"
              size="small"
              value={studentId}
              onChange={(e) => {
                setStudentId(e.target.value);
                const s = students.find((x) => x.id === e.target.value);
                if (s) setTitle(`Học 1:1 - ${s.name}`);
              }}
              fullWidth
            >
              {students.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.name} {s.phone ? `(${s.phone})` : ''}
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <TextField
              select
              label="Chọn Lớp học"
              size="small"
              value={classId}
              onChange={(e) => {
                setClassId(e.target.value);
                const c = classes.find((x) => x.id === e.target.value);
                if (c) setTitle(`Lớp - ${c.name}`);
              }}
              fullWidth
            >
              {classes.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </TextField>
          )}

          <TextField
            label="Tiêu đề ca học"
            size="small"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <TextField
              select
              label="Thứ trong tuần"
              size="small"
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(Number(e.target.value))}
              sx={{ flex: 1.2 }}
            >
              {DAY_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              type="time"
              label="Bắt đầu"
              size="small"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ flex: 1 }}
              required
            />
            <TextField
              type="time"
              label="Kết thúc"
              size="small"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ flex: 1 }}
              required
            />
          </Stack>

          <TextField
            label="Link học Online (Google Meet / Zoom)"
            size="small"
            placeholder="meet.google.com/xyz hoặc zoom.us/j/123"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            fullWidth
          />

          <TextField
            label="Ghi chú ca học"
            size="small"
            multiline
            rows={2}
            placeholder="Nội dung khóa học, tài liệu cần nhắc học viên..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 1.5, justifyContent: 'space-between' }}>
        {isEdit && onDelete ? (
          <Button
            color="error"
            onClick={() => setConfirmDeleteOpen(true)}
          >
            Xóa ca học
          </Button>
        ) : <Box />}
        <Stack direction="row" spacing={1}>
          <Button onClick={onClose} color="inherit">
            Hủy
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? 'Đang lưu...' : 'Lưu ca học'}
          </Button>
        </Stack>
      </DialogActions>

      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Xóa ca học cố định"
        message="Bạn có chắc chắn muốn xóa ca học cố định này khỏi thời khóa biểu?"
        onConfirm={async () => {
          if (slot?.id && onDelete) {
            await onDelete(slot.id);
            setConfirmDeleteOpen(false);
            onClose();
          }
        }}
        onCancel={() => setConfirmDeleteOpen(false)}
      />
    </Dialog>
  );
}
