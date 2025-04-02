export async function fetchRSSFeed(
  feedUrl,
  setFeed,
  setIsLoading,
  setError
) {
  setIsLoading(true);
  setError(null);
  try {
    const response = await fetch(
      `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`
    );
    const data = await response.json();

    if (data.status === 'ok') {
      setFeed(data);
    } else {
      throw new Error(data.message || 'Failed to fetch RSS feed');
    }
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to fetch RSS feed');
    setFeed(null);
  } finally {
    setIsLoading(false);
  }
}