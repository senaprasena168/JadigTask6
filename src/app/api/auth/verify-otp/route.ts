import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    // Validate input
    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Find user with matching email and OTP
    const user = await db.select().from(users).where(
      and(
        eq(users.email, email),
        eq(users.otp, otp)
      )
    );

    if (user.length === 0) {
      return NextResponse.json(
        { error: 'Invalid OTP or email' },
        { status: 400 }
      );
    }

    const foundUser = user[0];

    // Check if OTP has expired
    if (foundUser.otpExpiry && new Date() > foundUser.otpExpiry) {
      return NextResponse.json(
        { error: 'OTP has expired' },
        { status: 400 }
      );
    }

    // Update user as verified and clear OTP
    await db.update(users)
      .set({
        isVerified: true,
        otp: null,
        otpExpiry: null,
        updatedAt: new Date()
      })
      .where(eq(users.id, foundUser.id));

    return NextResponse.json({
      message: 'Account verified successfully',
      user: {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role
      }
    }, { status: 200 });

  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error during OTP verification' },
      { status: 500 }
    );
  }
}