'use client';

import * as React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'error' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title = 'Xác nhận xóa',
  message,
  confirmText = 'Xác nhận xóa',
  cancelText = 'Hủy bỏ',
  confirmColor = 'error',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          m: { xs: 2, sm: 3 },
          width: '100%',
          maxWidth: { xs: 'calc(100% - 32px)', sm: 460, md: 500 },
          borderRadius: 1,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600, fontSize: '1.1rem', pb: 1 }}>
        {title}
      </DialogTitle>
      <DialogContent sx={{ pb: 2 }}>
        <DialogContentText sx={{ color: '#3c4043', fontSize: '0.925rem' }}>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button onClick={onCancel} color="inherit" size="medium" sx={{ textTransform: 'none', fontWeight: 500 }}>
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={confirmColor}
          size="medium"
          autoFocus
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            bgcolor: confirmColor === 'error' ? '#d93025' : '#1a73e8',
            '&:hover': {
              bgcolor: confirmColor === 'error' ? '#b31412' : '#1557b0',
            },
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
