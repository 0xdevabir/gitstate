import { NextRequest, NextResponse } from 'next/server';
import { fetchCompleteStats } from '@/lib/github-api';

export const revalidate = 3600; // Cache for 1 hour

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  try {

    // Fetch GitHub stats
    const { stats, user } = await fetchCompleteStats(username);

    return NextResponse.json({ stats, user }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch stats';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
