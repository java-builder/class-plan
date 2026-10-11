'use client';

import * as React from 'react';
import {
  Box,
  Card,
  Typography,
  Stack,
  Button,
  ButtonGroup,
  Chip,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { AddIcon, AccessTimeIcon } from './Icons';
import { ScheduleSlot, Student, ClassItem } from '@/types/database';

interface CalendarViewProps {
  slots: ScheduleSlot[];
  students: Student[];
  classes: ClassItem[];
  onOpenCreate: (dayOfWeek?: number) => void;
  onEditSlot: (slot: ScheduleSlot) => void;
}

const DAYS_HEADER = [
  { day: 1, label: 'Thứ Hai', short: 'T2' },
  { day: 2, label: 'Thứ Ba', short: 'T3' },
  { day: 3, label: 'Thứ Tư', short: 'T4' },
  { day: 4, label: 'Thứ Năm', short: 'T5' },
  { day: 5, label: 'Thứ Sáu', short: 'T6' },
  { day: 6, label: 'Thứ Bảy', short: 'T7' },
  { day: 0, label: 'Chủ Nhật', short: 'CN' },
];

export default function CalendarView({
  slots,
  students: _students,
  classes: _classes,
  onOpenCreate,
  onEditSlot,
}: CalendarViewProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [filterType, setFilterType] = React.useState<'all' | '1-1' | 'class'>('all');
  const todayDayOfWeek = new Date().getDay();
  const [selectedMobileDay, setSelectedMobileDay] = React.useState<number | 'all'>(todayDayOfWeek);

  const filteredSlots = React.useMemo(() => {
    return slots.filter((s) => {
      if (filterType === '1-1') return Boolean(s.student_id);
      if (filterType === 'class') return Boolean(s.class_id);
      return true;
    });
  }, [slots, filterType]);

  const slotsByDay = React.useMemo(() => {
    const map = new Map<number, ScheduleSlot[]>();
    filteredSlots.forEach((slot) => {
      const list = map.get(slot.day_of_week) || [];
      list.push(slot);
      list.sort((a, b) => a.start_time.localeCompare(b.start_time));
      map.set(slot.day_of_week, list);
    });
    return map;
  }, [filteredSlots]);

  return (
    <Box>
      {/* Header controls */}
      <Paper sx={{ p: { xs: 1.5, sm: 2 }, mb: 2, border: '1px solid #dadce0', borderRadius: 1 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={1.5}
          sx={{ justifyContent: 'space-between', alignItems: { md: 'center' } }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#202124', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              Thời Khóa Biểu Cố Định Hàng Tuần
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
              Lịch dạy cố định cho các khóa học online
            </Typography>
          </Box>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            sx={{ alignItems: { xs: 'stretch', sm: 'center' } }}
          >
            <ButtonGroup size="small" variant="outlined" sx={{ width: { xs: '100%', sm: 'auto' } }}>
              <Button
                sx={{ flex: 1 }}
                variant={filterType === 'all' ? 'contained' : 'outlined'}
                onClick={() => setFilterType('all')}
              >
                Tất cả ({slots.length})
              </Button>
              <Button
                sx={{
                  flex: 1,
                  bgcolor: filterType === '1-1' ? '#1a73e8' : 'transparent',
                  color: filterType === '1-1' ? '#fff' : '#1a73e8',
                }}
                variant={filterType === '1-1' ? 'contained' : 'outlined'}
                onClick={() => setFilterType('1-1')}
              >
                1:1
              </Button>
              <Button
                sx={{
                  flex: 1,
                  bgcolor: filterType === 'class' ? '#1e8e3e' : 'transparent',
                  color: filterType === 'class' ? '#fff' : '#1e8e3e',
                }}
                variant={filterType === 'class' ? 'contained' : 'outlined'}
                onClick={() => setFilterType('class')}
              >
                Lớp
              </Button>
            </ButtonGroup>

            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => onOpenCreate(typeof selectedMobileDay === 'number' ? selectedMobileDay : 1)}
              sx={{ bgcolor: '#1a73e8', whiteSpace: 'nowrap' }}
            >
              + Thêm ca dạy
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* MOBILE VIEW: Day selector tabs + Full width cards */}
      {isMobile ? (
        <Box>
          {/* Day Pills Bar */}
          <Box
            sx={{
              display: 'flex',
              gap: 0.75,
              overflowX: 'auto',
              pb: 1.5,
              mb: 1.5,
              '&::-webkit-scrollbar': { height: 4 },
            }}
          >
            <Chip
              label="Tất cả các thứ"
              clickable
              color={selectedMobileDay === 'all' ? 'primary' : 'default'}
              variant={selectedMobileDay === 'all' ? 'filled' : 'outlined'}
              onClick={() => setSelectedMobileDay('all')}
              sx={{ fontWeight: 600, fontSize: '0.8rem', flexShrink: 0 }}
            />
            {DAYS_HEADER.map((d) => {
              const isSelected = selectedMobileDay === d.day;
              const count = slotsByDay.get(d.day)?.length || 0;
              const isToday = d.day === todayDayOfWeek;

              return (
                <Chip
                  key={d.day}
                  label={`${d.short}${count > 0 ? ` (${count})` : ''}${isToday ? ' •' : ''}`}
                  clickable
                  color={isSelected ? 'primary' : isToday ? 'info' : 'default'}
                  variant={isSelected ? 'filled' : 'outlined'}
                  onClick={() => setSelectedMobileDay(d.day)}
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    flexShrink: 0,
                    borderColor: isToday && !isSelected ? '#1a73e8' : undefined,
                  }}
                />
              );
            })}
          </Box>

          {/* Render Days for Mobile */}
          <Stack spacing={2}>
            {DAYS_HEADER.filter((d) => selectedMobileDay === 'all' || selectedMobileDay === d.day).map((d) => {
              const daySlots = slotsByDay.get(d.day) || [];
              const isToday = d.day === todayDayOfWeek;

              if (selectedMobileDay === 'all' && daySlots.length === 0) {
                return null;
              }

              return (
                <Card key={d.day} sx={{ border: isToday ? '2px solid #1a73e8' : '1px solid #dadce0', borderRadius: 1 }}>
                  <Box
                    sx={{
                      p: 1.25,
                      px: 2,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      bgcolor: isToday ? '#e8f0fe' : '#f8f9fa',
                      borderBottom: '1px solid #dadce0',
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: isToday ? '#1a73e8' : '#202124' }}>
                      {d.label} {isToday && '(Hôm nay)'}
                    </Typography>
                    <Button
                      size="small"
                      startIcon={<AddIcon fontSize="small" />}
                      onClick={() => onOpenCreate(d.day)}
                      sx={{ textTransform: 'none', py: 0.25, fontSize: '0.8rem' }}
                    >
                      Thêm ca
                    </Button>
                  </Box>

                  <Box sx={{ p: 1.5 }}>
                    {daySlots.length === 0 ? (
                      <Box
                        sx={{
                          py: 3,
                          textAlign: 'center',
                          color: '#80868b',
                          cursor: 'pointer',
                          borderRadius: 1,
                          border: '1px dashed #dadce0',
                        }}
                        onClick={() => onOpenCreate(d.day)}
                      >
                        <Typography variant="body2">+ Chưa có ca dạy. Bấm để thêm</Typography>
                      </Box>
                    ) : (
                      <Stack spacing={1.25}>
                        {daySlots.map((slot) => (
                          <SlotCard key={slot.id} slot={slot} onEdit={() => onEditSlot(slot)} isFullWidth />
                        ))}
                      </Stack>
                    )}
                  </Box>
                </Card>
              );
            })}
          </Stack>
        </Box>
      ) : (
        /* DESKTOP VIEW: 7 Columns Grid */
        <Box sx={{ overflowX: 'auto' }}>
          <Box sx={{ minWidth: 900 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1.25 }}>
              {DAYS_HEADER.map((d) => {
                const isToday = d.day === todayDayOfWeek;
                const daySlots = slotsByDay.get(d.day) || [];

                return (
                  <Card
                    key={d.day}
                    sx={{
                      minHeight: 520,
                      border: isToday ? '2px solid #1a73e8' : '1px solid #dadce0',
                      borderRadius: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      bgcolor: '#ffffff',
                    }}
                  >
                    <Box
                      sx={{
                        p: 1.25,
                        textAlign: 'center',
                        bgcolor: isToday ? '#e8f0fe' : '#f8f9fa',
                        borderBottom: '1px solid #dadce0',
                        cursor: 'pointer',
                        '&:hover': { bgcolor: '#e8eaed' },
                      }}
                      onClick={() => onOpenCreate(d.day)}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 700,
                          color: isToday ? '#1a73e8' : '#202124',
                          textTransform: 'uppercase',
                          fontSize: '0.8rem',
                        }}
                      >
                        {d.label} {isToday && '(Hôm nay)'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {daySlots.length} ca dạy
                      </Typography>
                    </Box>

                    <Box sx={{ p: 1, flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {daySlots.length === 0 ? (
                        <Box
                          sx={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#bdc1c6',
                            cursor: 'pointer',
                            borderRadius: 1,
                            border: '1px dashed #e8eaed',
                            '&:hover': { bgcolor: '#f8f9fa', borderColor: '#dadce0', color: '#5f6368' },
                          }}
                          onClick={() => onOpenCreate(d.day)}
                        >
                          <Typography variant="caption">+ Thêm ca</Typography>
                        </Box>
                      ) : (
                        daySlots.map((slot) => (
                          <SlotCard key={slot.id} slot={slot} onEdit={() => onEditSlot(slot)} />
                        ))
                      )}
                    </Box>
                  </Card>
                );
              })}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}

function SlotCard({
  slot,
  onEdit,
  isFullWidth = false,
}: {
  slot: ScheduleSlot;
  onEdit: () => void;
  isFullWidth?: boolean;
}) {
  const is1to1 = Boolean(slot.student_id);
  const color = is1to1 ? '#1a73e8' : '#1e8e3e';
  const bgColor = is1to1 ? '#e8f0fe' : '#e6f4ea';

  return (
    <Box
      onClick={onEdit}
      sx={{
        p: 1.25,
        borderRadius: 1,
        bgcolor: bgColor,
        border: '1px solid #dadce0',
        borderLeft: `5px solid ${color}`,
        cursor: 'pointer',
        transition: 'box-shadow 0.15s ease',
        '&:hover': {
          boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
        },
      }}
    >
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            color,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            fontSize: isFullWidth ? '0.85rem' : '0.75rem',
          }}
        >
          <AccessTimeIcon sx={{ fontSize: 14 }} />
          {slot.start_time} - {slot.end_time}
        </Typography>
        <Chip
          label={is1to1 ? '1:1' : 'Lớp'}
          size="small"
          sx={{
            height: 18,
            fontSize: '0.65rem',
            fontWeight: 700,
            bgcolor: color,
            color: '#fff',
            borderRadius: '2px',
          }}
        />
      </Stack>

      <Typography
        variant="body2"
        sx={{
          fontWeight: 700,
          color: '#202124',
          lineHeight: 1.25,
          fontSize: isFullWidth ? '0.95rem' : '0.85rem',
          mb: 0.25,
        }}
      >
        {slot.student?.name || slot.class?.name || slot.title}
      </Typography>

      {(slot.student?.name || slot.class?.name) && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', fontSize: '0.75rem', mb: 0.5 }}
          noWrap={!isFullWidth}
        >
          {slot.title}
        </Typography>
      )}

      {slot.location_or_link && (
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            color: '#1a73e8',
            fontSize: '0.75rem',
            wordBreak: 'break-all',
            fontWeight: 500,
          }}
          noWrap={!isFullWidth}
          onClick={(e) => {
            if (slot.location_or_link?.includes('.')) {
              e.stopPropagation();
              const url = slot.location_or_link.startsWith('http')
                ? slot.location_or_link
                : `https://${slot.location_or_link}`;
              window.open(url, '_blank');
            }
          }}
        >
          🔗 {slot.location_or_link}
        </Typography>
      )}
    </Box>
  );
}
