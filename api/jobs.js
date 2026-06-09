module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { where, category, page, what } = req.query;

  const ADZUNA_ID = 'cbacab63';
  const ADZUNA_KEY = '4a3fdd790fe47dc7679e71b8bdf69b03';

  try {
    const pageNum = page || 1;
    let url = `https://api.adzuna.com/v1/api/jobs/gb/search/${pageNum}?app_id=${ADZUNA_ID}&app_key=${ADZUNA_KEY}&results_per_page=5`;
    if (where) url += `&where=${encodeURIComponent(where)}`;

    const response = await fetch(url);
    const text = await response.text();
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(`Status: ${response.status}\nBody start: ${text.substring(0, 200)}`);
  } catch (e) {
    res.status(500).send(`Error: ${e.message}`);
  }
}
