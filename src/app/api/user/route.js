import { createUser, findUserList } from '@/services/user';
import { NextResponse } from 'next/server';

export async function GET() {

  try {
    const users = await findUserList();
    if (users) {
      return NextResponse.json(users);
    } else {
      return NextResponse.json(null);
    }
  } catch (error) {
    return NextResponse.json(null);
  }
}

export async function PUT(req) {
  const { username, address, bio } = await req.json();
  console.log(username, address, bio );

  if (!username || !address) {
    return NextResponse.json({ message: 'No username or not connected wallet!'}, { status: 400 });
  }
  try {
    const newUser = await createUser({ username, address, bio });
    return NextResponse.json(newUser);
  } catch (error) {
    return NextResponse.json(null);
  }
}
