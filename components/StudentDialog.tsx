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
} from '@mui/material';
import { Student } from '@/types/database';

interface StudentDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (student: { id?: string; name: string; phone?: string; note?: string }) => Promise<void>;
  student?: Student | null;
}

export default function StudentDialog({ open, onClose, onSave, student }: StudentDialogProps) {
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [note, setNote] = React.useState('');
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setName(student?.name || '');
      setPhone(student?.phone || '');
      setNote(student?.note || '');
    }
  }, [open, student]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await onSave({
        id: student?.id,
        name: name.trim(),
        phone: phone.trim() || undefined,
        note: note.trim() || undefined,
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
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          m: { xs: 2, sm: 3 },
          width: '100%',
          maxWidth: { xs: 'calc(100% - 32px)', sm: 520, md: 560 },
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 600 }}>
          {student ? 'Chỉnh sửa học viên' : 'Thêm học viên mới'}
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Họ và tên học viên"
              size="small"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
              autoFocus
            />
            <TextField
              label="Số điện thoại"
              size="small"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="VD: 0912345678"
              fullWidth
            />
            <TextField
              label="Ghi chú (Lớp, mục tiêu học tập...)"
              size="small"
              multiline
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 1.5 }}>
          <Button onClick={onClose} color="inherit">
            Hủy
          </Button>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? 'Đang lưu...' : 'Lưu học viên'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
