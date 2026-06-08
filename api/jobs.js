module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  // Cache responses for 30 minutes at the edge
  res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600');

  const { where, category, page, what } = req.query;

  const ADZUNA_ID = process.env.ADZUNA_ID;
  const ADZUNA_KEY = process.env.ADZUNA_KEY;

  if (!ADZUNA_ID || !ADZUNA_KEY) {
    return res.status(500).json({ error: 'API keys not configured' });
  }

  try {
    const pageNum = page || 1;
    let url = `https://api.adzuna.com/v1/api/jobs/gb/search/${pageNum}?app_id=${ADZUNA_ID}&app_key=${ADZUNA_KEY}&results_per_page=20&content-type=application/json&days_old=90&sort_by=date`;
    if (where) url += `&where=${encodeURIComponent(where)}`;
    if (category) url += `&category=${encodeURIComponent(category)}`;
    if (what) url += `&what=${encodeURIComponent(what)}`;

    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
