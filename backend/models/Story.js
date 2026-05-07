const mongoose = require('mongoose');

const storySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    url: {
      type: String,
      default: '',
    },
    points: {
      type: Number,
      default: 0,
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
    },
    postedAt: {
      type: String,
      default: '',
    },
    hnId: {
      type: String,
      unique: true,
      sparse: true,
    },
    rank: {
      type: Number,
      default: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);


storySchema.index({ points: -1 });

module.exports = mongoose.model('Story', storySchema);
