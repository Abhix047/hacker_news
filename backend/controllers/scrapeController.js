const { runScraper } = require('../services/scraperService');

/**
 * @desc  Manually trigger the scraper
 * @route POST /api/scrape
 * @access Public
 */
const triggerScrape = async (req, res) => {
  try {
    const stories = await runScraper();
    res.json({
      success: true,
      message: `Successfully scraped ${stories.length} stories from Hacker News`,
      count: stories.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: `Scrape failed: ${error.message}` });
  }
};

module.exports = { triggerScrape };
