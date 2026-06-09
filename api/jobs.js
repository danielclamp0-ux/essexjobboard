module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { where, category, page, what } = req.query;

  const ADZUNA_ID = 'cbacab63';
  const ADZUNA_KEY = '3dbd4fc1588d887046be997587945964';

  try {
    const pageNum = page || 1;
    let url = `https://api.adzuna.com/v1/api/jobs/gb/search/${pageNum}?app_id=${ADZUNA_ID}&app_key=${ADZUNA_KEY}&results_per_page=20&days_old=90&sort_by=date`;
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
