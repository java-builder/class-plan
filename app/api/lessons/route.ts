import { NextResponse } from 'next/server';
import { StorageAPI } from '@/lib/storage';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('student_id');
  const classId = searchParams.get('class_id');
  const day = searchParams.get('day');

  let slots = await StorageAPI.getScheduleSlots();

  if (studentId) {
    slots = slots.filter((s) => s.student_id === studentId);
  }
  if (classId) {
    slots = slots.filter((s) => s.class_id === classId);
  }
  if (day !== null && day !== undefined && day !== '') {
    slots = slots.filter((s) => s.day_of_week === Number(day));
  }

  return NextResponse.json(slots);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || !body.start_time || !body.end_time || body.day_of_week === undefined) {
      return NextResponse.json({ error: 'Tiêu đề, thứ trong tuần, giờ bắt đầu và kết thúc là bắt buộc' }, { status: 400 });
    }
    const slot = await StorageAPI.saveScheduleSlot(body);
    return NextResponse.json(slot);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: 'Thiếu ID ca học' }, { status: 400 });
    }
    const slot = await StorageAPI.saveScheduleSlot(body);
    return NextResponse.json(slot);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID ca học' }, { status: 400 });
    }
    await StorageAPI.deleteScheduleSlot(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
