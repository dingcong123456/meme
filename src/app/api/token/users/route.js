import { findHolders } from '@/services/token';
import { NextResponse } from 'next/server';

export async function GET(req) {
    const searchParams = req.nextUrl.searchParams;
    const tokenId = searchParams.get('tokenId')

    try {
        const holders = await findHolders(tokenId);
        return NextResponse.json({
            holders
        });
    } catch (error) {
        return NextResponse.json(null);
    }
}

