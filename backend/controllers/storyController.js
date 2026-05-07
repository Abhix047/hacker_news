const Story = require('../models/Story');
const User = require('../models/User');

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

/**
 * @desc  Get all stories (sorted by points desc, with pagination)
 * @route GET /api/stories?page=1&limit=10
 * @access Public
 */
const getStories = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(req.query.limit) || DEFAULT_LIMIT));
    const skip = (page - 1) * limit;

    const [stories, total] = await Promise.all([
      Story.find().sort({ points: -1 }).skip(skip).limit(limit),
      Story.countDocuments(),
    ]);

    res.json({
      success: true,
      data: stories,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc  Get a single story by ID
 * @route GET /api/stories/:id
 * @access Public
 */
const getStoryById = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found' });
    }
    res.json({ success: true, data: story });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc  Toggle bookmark for a story
 * @route POST /api/stories/:id/bookmark
 * @access Private
 */
const toggleBookmark = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found' });
    }

    const user = await User.findById(req.user.id);
    const alreadyBookmarked = user.bookmarks.includes(req.params.id);

    if (alreadyBookmarked) {
      user.bookmarks = user.bookmarks.filter((id) => id.toString() !== req.params.id);
    } else {
      user.bookmarks.push(req.params.id);
    }

    await user.save();

    res.json({
      success: true,
      bookmarked: !alreadyBookmarked,
      message: alreadyBookmarked ? 'Bookmark removed' : 'Story bookmarked',
      bookmarks: user.bookmarks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getStories, getStoryById, toggleBookmark };
