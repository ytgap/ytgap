import { useEffect, useState } from "react";
import { fetchYouTubeTrends } from "../services/youtubeTrendService";

export default function Home() {
  const [trends, setTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    const result = await fetchYouTubeTrends("", "AI Music", "10000", "0.01");
    setTrends(result);
    setLoading(false);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1 style={{ fontWeight: 700, fontSize: 32 }}>YTGap (Starter Preview)</h1>
      <p>Click below to see some YouTube/Google Trends data in action.</p>
      <button onClick={handleSearch} style={{ margin: "20px 0", padding: "10px 30px", fontWeight: 700 }}>
        Search for Gaps
      </button>
      {loading && <div>Loading...</div>}
      <ul>
        {trends.map((trend) => (
          <li key={trend.term}>
            <b>{trend.term}</b>: {trend.dailySearches} searches/day, {trend.videoCount} videos on YouTube
          </li>
        ))}
      </ul>
    </div>
  );
}
