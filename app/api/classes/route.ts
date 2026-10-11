import { NextResponse } from 'next/server';
import { StorageAPI } from '@/lib/storage';

export async function GET() {
  const [classes, members] = await Promise.all([
    StorageAPI.getClasses(),
    StorageAPI.getClassMembers(),
  ]);

  const classesWithCount = classes.map((c) => ({
    ...c,
    members_count: members.filter((m) => m.class_id === c.id).length,
    student_ids: members.filter((m) => m.class_id === c.id).map((m) => m.student_id),
  }));

  return NextResponse.json(classesWithCount);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ error: 'Tên lớp là bắt buộc' }, { status: 400 });
    }
    const newClass = await StorageAPI.saveClass(body, body.student_ids);
    return NextResponse.json(newClass);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id || !body.name) {
      return NextResponse.json({ error: 'ID và Tên lớp là bắt buộc' }, { status: 400 });
    }
    const updated = await StorageAPI.saveClass(body, body.student_ids);
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID lớp' }, { status: 400 });
    }
    await StorageAPI.deleteClass(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
