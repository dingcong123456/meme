import { NextResponse } from 'next/server';

const coinmarketcap_key = '86499d16-436d-43ca-87c3-2d187861b03f'

export async function GET() {
    const url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=ETH&convert=USD';
    // const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
    const res = await fetch(url, {
      headers: {
        'X-CMC_PRO_API_KEY': coinmarketcap_key,
      },
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data?.data?.ETH?.quote?.USD?.price || 1);
    } else {
      return NextResponse.json(null);
    }
}