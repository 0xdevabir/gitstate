import { NextRequest, NextResponse } from 'next/server';
import { fetchCompleteStats } from '@/lib/github-api';
import { generateStatsSVG, createCardConfig } from '@/lib/card-generator';

export const revalidate = 3600; // Cache for 1 hour

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  try {

    const searchParams = request.nextUrl.searchParams;
    const theme = searchParams.get('theme') || 'dark';
    const displayOptions = {
      showRepositories: searchParams.get('showRepositories') !== 'false',
      showFollowers: searchParams.get('showFollowers') !== 'false',
      showStars: searchParams.get('showStars') !== 'false',
      showLanguages: searchParams.get('showLanguages') !== 'false',
      showJoinDate: searchParams.get('showJoinDate') !== 'false',
      showLocation: searchParams.get('showLocation') !== 'false',
      showName: searchParams.get('showName') !== 'false',
      showContributions: searchParams.get('showContributions') !== 'false',
    };

    // Fetch GitHub stats
    const { stats, user } = await fetchCompleteStats(username);

    // Create card configuration
    const config = createCardConfig(username, theme, displayOptions);

    // Generate SVG
    const svg = generateStatsSVG(username, stats, config, user);

    // Return SVG response
    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error generating insights:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate insights';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
