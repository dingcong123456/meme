import { findUser, updateUser } from '@/services/user';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { slug } = await params;
  const address = slug[0];

  try {
    const user = await findUser(address);
    if (user) {
      return NextResponse.json(user);
    } else {
      return NextResponse.json(null);
    }
  } catch (error) {
    return NextResponse.json(null);
  }
}

export async function PATCH(req, { params }) {
  const { slug } = await params;
  const userId = slug[0];
  const { username, bio } = await req.json();

  if (!userId) {
    return NextResponse.json({ message: 'No userId provided!' }, { status: 400 });
  }

  try {
    const updatedUser = await updateUser(userId, { username, bio });
    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json(null);
  }
}
