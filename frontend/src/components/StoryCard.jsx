import { Link } from 'react-router-dom';
import { toggleBookmark } from '../api';
import { useAuth } from '../context/AuthContext';

const getDomain = (url) => {
  try { return new URL(url).hostname.replace('www.', ''); }
  catch { return ''; }
};

const StoryCard = ({ story, rank }) => {
  const { user, isBookmarked, updateBookmarks } = useAuth();

  const handleBookmark = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      const { data } = await toggleBookmark(story._id);
      updateBookmarks(data.bookmarks);
    } catch (err) {
      console.error('Bookmark error:', err);
    }
  };

  const domain = getDomain(story.url);
  const bookmarked = isBookmarked(story._id);

  return (
    <article className="story-card">
      <div className="story-rank">#{rank || story.rank || '—'}</div>

      <div className="story-body">
        <a
          href={story.url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="story-title"
        >
          {story.title}
          {domain && <span className="story-domain">{domain}</span>}
        </a>

        <div className="story-meta">
          <span className="story-meta-item story-points">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            {story.points} pts
          </span>
          <span className="story-meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            {story.author}
          </span>
          <span className="story-meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            {story.postedAt}
          </span>
          {story.commentCount > 0 && (
            <span className="story-meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              {story.commentCount}
            </span>
          )}
        </div>
      </div>

      <div className="story-actions">
        {user && (
          <button
            className={`btn-bookmark${bookmarked ? ' bookmarked' : ''}`}
            onClick={handleBookmark}
            title={bookmarked ? 'Remove bookmark' : 'Bookmark'}
          >
            {bookmarked ? '🔖' : '🏷️'}
          </button>
        )}
        <Link to={`/stories/${story._id}`} className="btn-view">
          View →
        </Link>
      </div>
    </article>
  );
};

export default StoryCard;
