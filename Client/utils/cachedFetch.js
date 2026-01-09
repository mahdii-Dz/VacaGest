const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function fetchWithCache(key, url, options = {}) {
  const cached = localStorage.getItem(key);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data; 
    }
  }

  // Fetch fresh data
  const response = await fetch(url, options);
  console.log('data fetched');
  
  if (!response.ok) throw new Error("Network response was not ok");
  
  const data = await response.json();

  // Cache it
  localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));

  return data;
}