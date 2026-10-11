import { NextResponse } from 'next/server';
import { StorageAPI } from '@/lib/storage';

export async function GET() {
  const students = await StorageAPI.getStudents();
  return NextResponse.json(students);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ error: 'Tên học viên là bắt buộc' }, { status: 400 });
    }
    const student = await StorageAPI.saveStudent(body);
    return NextResponse.json(student);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id || !body.name) {
      return NextResponse.json({ error: 'ID và Tên học viên là bắt buộc' }, { status: 400 });
    }
    const student = await StorageAPI.saveStudent(body);
    return NextResponse.json(student);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID học viên' }, { status: 400 });
    }
    await StorageAPI.deleteStudent(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
