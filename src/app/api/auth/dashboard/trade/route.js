import prisma from '@/lib/prisma';
import { isTokenValid } from '@/util/auth';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized: No valid token provided' },
        { status: 401 }
      );
    }
    
    const token = authHeader.split(' ')[1];

    const isValid = isTokenValid(token)
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid token' },
        { status: 401 }
      );
    }

    const data = await prisma.tokenTransactionStatistics.findMany({});

    console.log(data);

    return NextResponse.json({ message: 'Success', data });
    
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      { error: 'Unauthorized: Invalid token' },
      { status: 401 }
    );
  }
}