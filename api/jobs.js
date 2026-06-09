module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { where, category, page, what } = req.query;

  const ADZUNA_ID = 'cbacab63';
  const ADZUNA_KEY = '4a3fdd790fe47dc7679e71b8bdf69b03';

  try {
    const pageNum = page || 1;
    let url = `https://api.adzuna.com/v1/api/jobs/gb/search/${pageNum}?app_id=${ADZUNA_ID}&app_key=${ADZUNA_KEY}&results_per_page=20&days_old=90&sort_by=date`;
    if (where) url += `&where=${encodeURIComponent(where)}`;
    if (category) url += `&category=${encodeURIComponent(category)}`;
    if (what) url += `&what=${encodeURIComponent(what)}`;

    const response = await fetch(url);
if (!response.ok) {
  const text = await response.text();
  return res.status(500).json({ status: response.status, url: url, body: text.substring(0, 300) });
}
    const data = await response.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
