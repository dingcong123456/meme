import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=okb&vs_currencies=usd');
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    } else {
      return NextResponse.json(null);
    }
  } catch (error) {
    return NextResponse.json(null);
  }
}