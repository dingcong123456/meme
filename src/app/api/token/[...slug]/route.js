import { findToken, updateToken, remoteToken } from '@/services/token';
import { NextResponse } from 'next/server';
import { getTokenMarket } from '../route';

export async function GET(req, { params }) {
  const { slug } = await params;
  const tokenId = slug[0];

  try {
    const token = await findToken(tokenId);
    if (token) {
      const marcket = await getTokenMarket(token);
      return NextResponse.json({
        ...token,
        marketCap: marcket
      });
    } else {
      return NextResponse.json(null);
    }
  } catch (error) {
    return NextResponse.json(null);
  }
}

export async function PATCH(req, { params }) {
  const { slug } = await params;
  const tokenId = slug[0];
  const { tokenname, bio } = await req.json();

  if (!tokenId) {
    return NextResponse.json({ message: 'No tokenId provided!' }, { status: 400 });
  }

  try {
    const updatedToken = await updateToken(tokenId, { tokenname, bio });
    return NextResponse.json(updatedToken);
  } catch (error) {
    return NextResponse.json(null);
  }
}

export async function DELETE(req, { params }) {
  const { slug } = await params;
  const tokenId = slug[0];

  if (!tokenId) {
    return NextResponse.json({ message: 'No tokenId provided!' }, { status: 400 });
  }

  try {
    // TODO: 检查合约是否存在上链，如果上链则不允许删除
    await remoteToken(tokenId);
    return NextResponse.json({ message: 'Token deleted successfully!' });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete token!' }, { status: 500 });
  }
}


