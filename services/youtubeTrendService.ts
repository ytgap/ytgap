export async function fetchYouTubeTrends(
  date: string,
  niche: string,
  searchVolume: string,
  saturationLevel: string
) {
  const params = new URLSearchParams({
    date,
    niche,
    searchVolume,
    saturationLevel,
  });

  const res = await fetch(`/api/trends?${params.toString()}`);
  if (!res.ok) {
    throw new Error('Failed to fetch YouTube trends.');
  }
  return res.json();
}
