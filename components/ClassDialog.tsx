'use client';

import * as React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Box,
  Divider,
} from '@mui/material';
import { ClassItem, Student } from '@/types/database';

interface ClassDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (cls: { id?: string; name: string; note?: string }, studentIds: string[]) => Promise<void>;
  classItem?: ClassItem | null;
  students: Student[];
  currentStudentIds?: string[];
}

export default function ClassDialog({
  open,
  onClose,
  onSave,
  classItem,
  students,
  currentStudentIds = [],
}: ClassDialogProps) {
  const [name, setName] = React.useState('');
  const [note, setNote] = React.useState('');
  const [selectedStudentIds, setSelectedStudentIds] = React.useState<string[]>([]);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setName(classItem?.name || '');
      setNote(classItem?.note || '');
      setSelectedStudentIds(currentStudentIds);
    }
  }, [open, classItem, currentStudentIds]);

  const handleToggleStudent = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await onSave(
        {
          id: classItem?.id,
          name: name.trim(),
          note: note.trim() || undefined,
        },
        selectedStudentIds
      );
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 600 }}>
          {classItem ? 'Chỉnh sửa lớp học' : 'Tạo lớp học mới'}
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <TextField
              label="Tên lớp học"
              size="small"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Lớp Toán 10A, Lớp Luyện Đề VIP..."
              required
              fullWidth
              autoFocus
            />
            <TextField
              label="Ghi chú lịch học / phòng học"
              size="small"
              multiline
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="VD: Học tối thứ 3 và thứ 5 tại phòng 201..."
              fullWidth
            />

            <Divider />

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Chọn học viên vào lớp ({selectedStudentIds.length} học viên đã chọn)
              </Typography>
              {students.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Chưa có học viên nào trong hệ thống. Hãy thêm học viên ở tab Học viên trước.
                </Typography>
              ) : (
                <Box
                  sx={{
                    maxHeight: 180,
                    overflowY: 'auto',
                    border: '1px solid #dadce0',
                    borderRadius: 1,
                    p: 1.5,
                  }}
                >
                  <FormGroup>
                    {students.map((s) => (
                      <FormControlLabel
                        key={s.id}
                        control={
                          <Checkbox
                            size="small"
                            checked={selectedStudentIds.includes(s.id)}
                            onChange={() => handleToggleStudent(s.id)}
                          />
                        }
                        label={
                          <Typography variant="body2">
                            {s.name} {s.phone ? `(${s.phone})` : ''}
                          </Typography>
                        }
                      />
                    ))}
                  </FormGroup>
                </Box>
              )}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 1.5 }}>
          <Button onClick={onClose} color="inherit">
            Hủy
          </Button>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? 'Đang lưu...' : 'Lưu lớp học'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
