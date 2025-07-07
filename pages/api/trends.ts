import type { NextApiRequest, NextApiResponse } from 'next';
import googleTrends from 'google-trends-api';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY!;

async function getSearchVolume(term: string): Promise<number> {
  try {
    const results = await googleTrends.interestOverTime({
      keyword: term,
      startTime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      geo: 'US',
      property: 'youtube',
    });
    const data = JSON.parse(results);
    const points = data.default.timelineData;
    const avg =
      points.reduce((sum: number, p: any) => sum + Number(p.value[0]), 0) /
      points.length;
    return Math.round((avg / 100) * 100000);
  } catch (e) {
    return 0;
  }
}

async function getYouTubeVideoCount(term: string): Promise<number> {
  const params = new URLSearchParams({
    key: YOUTUBE_API_KEY,
    part: 'snippet',
    type: 'video',
    q: term,
    maxResults: '1',
  });
  const res = await fetch(`https://www.googleapis.com/youtube/v3/search?${params}`);
  const data = await res.json();
  return data.pageInfo?.totalResults ?? 0;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { niche = '' } = req.query;
  const keywords = niche
    ? [niche, `${niche} tutorial`, `${niche} tips`, `${niche} beginner`, `${niche} secrets`]
    : ['YouTube Automation', 'AI Music', 'Unboxing', 'Viral Shorts', 'Gaming News'];

  const trends = await Promise.all(
    keywords.map(async (term) => {
      const [videoCount, dailySearches] = await Promise.all([
        getYouTubeVideoCount(term),
        getSearchVolume(term),
      ]);
      return {
        term,
        videoCount,
        dailySearches,
      };
    })
  );

  res.status(200).json(trends);
}
