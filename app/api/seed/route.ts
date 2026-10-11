import { NextResponse } from 'next/server';
import { StorageAPI } from '@/lib/storage';

export async function POST() {
  await StorageAPI.resetAll();
  return NextResponse.json({
    message: 'Khởi tạo dữ liệu mẫu thành công!',
  });
}
