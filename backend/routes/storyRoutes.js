const express = require('express');
const { getStories, getStoryById, toggleBookmark } = require('../controllers/storyController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getStories);
router.get('/:id', getStoryById);
router.post('/:id/bookmark', protect, toggleBookmark);

module.exports = router;
