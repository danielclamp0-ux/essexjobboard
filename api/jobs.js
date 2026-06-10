module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { where, category, page, what } = req.query;
  const REED_API_KEY = process.env.REED_API_KEY;

  try {
    const resultsToSkip = page ? (parseInt(page) - 1) * 20 : 0;

    let url = `https://www.reed.co.uk/api/1.0/search?resultsToTake=20&resultsToSkip=${resultsToSkip}&locationName=${encodeURIComponent(where || 'Essex')}&distanceFromLocation=15`;

    if (what) url += `&keywords=${encodeURIComponent(what)}`;
    if (category) url += `&keywords=${encodeURIComponent(category)}`;

    const credentials = btoa(REED_API_KEY + ':');

    const response = await fetch(url, {
      headers: {
        'Authorization': 'Basic ' + credentials
      }
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(200).json({
        debug: true,
        status: response.status,
        url: url,
        body: text.substring(0, 500)
      });
    }

    const data = await response.json();

    const remapped = {
      results: (data.results || []).map(job => ({
        id: job.jobId,
        title: job.jobTitle,
        company: { display_name: job.employerName },
        location: { display_name: job.locationName },
        description: job.jobDescription,
        salary_min: job.minimumSalary,
        salary_max: job.maximumSalary,
        redirect_url: job.jobUrl,
        created: job.date ? new Date(job.date).toISOString() : null,
        contract_time: job.jobType,
        category: { label: '' }
      })),
      count: data.totalResults || 0
    };

    res.status(200).json(remapped);

  } catch (e) {
    res.status(500).json({ error: e.message, stack: e.stack });
  }
}
