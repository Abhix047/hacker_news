const axios = require('axios');
const cheerio = require('cheerio');
const Story = require('../models/Story');

const HN_URL = 'https://news.ycombinator.com';

/**
 * Scrapes top 10 stories from Hacker News and upserts them into MongoDB.
 * Maps rank, title, url, points, author, and timestamp.
 * 
 * @async
 * @returns {Promise<Story[]>} Array of saved story documents
 */
const runScraper = async () => {
  try {
    const { data: html } = await axios.get(HN_URL, {
      timeout: 15000,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
      },
    });

    const $ = cheerio.load(html);
    const stories = [];

    // Each story spans two <tr> rows — .athing for title, next sibling for meta
    $('.athing').each((index, el) => {
      if (stories.length >= 10) return false; // Stop after 10

      const titleEl = $(el).find('.titleline > a').first();
      const title = titleEl.text().trim();
      const url = titleEl.attr('href') || '';
      const hnId = $(el).attr('id') || '';
      const rank = parseInt($(el).find('.rank').text().replace('.', '').trim()) || index + 1;

      // Meta row is the immediately following sibling
      const metaRow = $(el).next('tr');
      const score = metaRow.find('.score').text().replace(' points', '').replace(' point', '').trim();
      const points = parseInt(score) || 0;
      const author = metaRow.find('.hnuser').text().trim() || 'unknown';
      const postedAt = metaRow.find('.age').attr('title') || metaRow.find('.age').text().trim() || '';
      const commentText = metaRow.find('a').last().text().trim();
      const commentCount = parseInt(commentText) || 0;

      if (title) {
        stories.push({ title, url, points, author, postedAt, hnId, rank, commentCount });
      }
    });

    // Upsert stories into MongoDB (match by hnId to avoid duplicates)
    const savedStories = await Promise.all(
      stories.map((story) =>
        Story.findOneAndUpdate(
          { hnId: story.hnId },
          story,
          { upsert: true, new: true, setDefaultsOnInsert: true }
        )
      )
    );

    console.log(`✅ Scraped and saved ${savedStories.length} stories from Hacker News`);
    return savedStories;
  } catch (error) {
    console.error('❌ Scraper error:', error.message);
    throw error;
  }
};

module.exports = { runScraper };
