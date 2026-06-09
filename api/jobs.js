module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { where, category, page, what } = req.query;

  const ADZUNA_ID = 'cbacab63';
  const ADZUNA_KEY = '4a3fdd790fe47dc7679e71b8bdf69b03';

  try {
    const pageNum = page || 1;
    let url = `https://api.adzuna.com/v1/api/jobs/gb/search/${pageNum}?app_id=${ADZUNA_ID}&app_key=${ADZUNA_KEY}&results_per_page=20&content-type=application/json&days_old=90&sort_by=date`;
    if (where) url += `&where=${encodeURIComponent(where)}`;
    if (category) url += `&category=${encodeURIComponent(category)}`;
    if (what) url += `&what=${encodeURIComponent(what)}`;

    const response = await fetch(url);
    const text = await response.text();
    
    // Return raw text so we can see what Adzuna is actually sending back
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(`Status: ${response.status}\nURL: ${url}\nBody: ${text.substring(0, 500)}`);
  } catch (e) {
    res.status(500).json({ error: e.message, stack: e.stack });
  }
}
