import { NextResponse } from 'next/server';
import mockData from './mock.json';

export async function GET() {
  try {
    return NextResponse.json(mockData);
  } catch {
    return NextResponse.json(null);
  }
};
