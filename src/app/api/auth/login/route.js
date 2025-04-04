import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    const body = await request.json();
    const { account, password } = body;

    if (!account || !password) {
      return NextResponse.json(
        { message: 'account and password are required' },
        { status: 400 }
      );
    }

    const username = process.env.ADMIN_USERNAME;

    if (account !== username) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const encryptedPassword = process.env.ADMIN_PASSWORD;

    const isMatch = password === encryptedPassword;

    if (!isMatch) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const jwtSecret = process.env.JWT_SECRET;
    
    if (!jwtSecret) {
      return NextResponse.json(
        { message: 'Server configuration error' },
        { status: 500 }
      );
    }

    const token = jwt.sign({ username }, jwtSecret, { expiresIn: '12h' });

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'An error occurred during login' },
      { status: 500 }
    );
  }
}