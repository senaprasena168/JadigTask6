import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG and PNG are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (1MB)
    const maxSize = 1024 * 1024; // 1MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum 1MB allowed.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    const path = join(process.cwd(), 'public/uploads', filename);

    // Write file
    await writeFile(path, buffer);

    return NextResponse.json({ 
      url: `/uploads/${filename}`,
      message: 'File uploaded successfully' 
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}