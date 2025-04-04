import { getCommentsCount } from '@/services/comment';

export async function GET(req, { params }) {
  const { tokenId } = await params;

  try {
    const total = await getCommentsCount(tokenId);
    return NextResponse.json({
      total
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}