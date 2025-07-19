import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type - only JPG and PNG
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG and PNG are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size - max 1MB
    const maxSize = 1024 * 1024; // 1MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum 1MB allowed.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure uploads directory exists
    const uploadsDir = join(process.cwd(), 'public/uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Create unique filename with proper extension
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const path = join(uploadsDir, filename);

    // Write file
    await writeFile(path, buffer);

    return NextResponse.json({ 
      url: `/uploads/${filename}`,
      message: 'File uploaded successfully',
      filename: filename,
      size: file.size,
      type: file.type
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
