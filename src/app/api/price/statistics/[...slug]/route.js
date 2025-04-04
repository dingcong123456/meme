import {findPriceStatistics} from '@/services/price';
import { NextResponse } from 'next/server';

export async function POST(req, { params }) {
  const { slug } = await params;
  const tokenAddress = slug[0];
  const { startTime, endTime } = await req.json();

  try {
    const statistics = await findPriceStatistics(tokenAddress, new Date(startTime), new Date(endTime));
    const data = statistics.map((item) => {
      return {
        time: item.timestamp,
        open: item.startPrice.toString(),
        high: item.maxPrice.toString(),
        low: item.minPrice.toString(),
        close: item.endPrice.toString(),
      };
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch price statistics:', error);
    return NextResponse.json({ error: 'Failed to fetch price statistics' }, { status: 500 });
  }
}
