import { createTransaction } from '@/services/tokenTransaction';
import { getTransactionList } from '@/services/transaction';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tokenAddress = searchParams.get('address');
    const pageNo = searchParams.get('pageNo') || 1;
    const [total, data] = await getTransactionList({ pageNo, tokenAddress });
    if (data) {
      return NextResponse.json({
        total,
        data
      });
    }
    return NextResponse.json(null);
  } catch (e) {
    console.log(e);
    return NextResponse.json(null);
  }
};

export async function POST(req) {
  try {
    const data = await req.json();
    await createTransaction(data);
    return NextResponse.json({
      success: true,
      data
    });
  } catch {
    return NextResponse.json({
      success: false
    });
  }
};
