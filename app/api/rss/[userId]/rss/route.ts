import { NextResponse } from 'next/server';
import { generateFeed } from '../atom/route';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const { searchParams } = new URL(request.url);
  const rows = searchParams.get('rows') ? parseInt(searchParams.get('rows')!) : 20;
  const origin = request.headers.get('origin') || request.headers.get('host') || 'http://localhost:1111';
  const fullOrigin = origin.startsWith('http') ? origin : `http://${origin}`;
  const feed = await generateFeed(Number(params.userId), fullOrigin, rows);
  return new NextResponse(feed.rss2(), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=UTF-8',
      'Cache-Control': 'public, max-age=10800',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'X-Content-Type-Options': 'nosniff'
    }
  });
}