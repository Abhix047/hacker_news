import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchStoryById, toggleBookmark } from '../api';
import { useAuth } from '../context/AuthContext';

const StoryDetailPage = () => {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const { user, isBookmarked, updateBookmarks } = useAuth();

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await fetchStoryById(id);
        setStory(data.data);
      } catch {
        setStory(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleBookmark = async () => {
    if (!user) return showToast('Login to bookmark stories', 'error');
    try {
      const { data } = await toggleBookmark(id);
      updateBookmarks(data.bookmarks);
      showToast(data.message);
    } catch {
      showToast('Failed to update bookmark', 'error');
    }
  };

  if (loading) {
    return (
      <div className="loader-wrap">
        <div className="loader" />
        <p className="loader-text">Loading story...</p>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="page">
        <div className="container">
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h2>Story not found</h2>
            <p>This story may have been removed or doesn't exist.</p>
            <Link to="/" className="btn-primary">← Back to Stories</Link>
          </div>
        </div>
      </div>
    );
  }

  const bookmarked = isBookmarked(story._id);

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: '800px' }}>
        <Link to="/" className="btn-back">← Back to Stories</Link>

        <div className="story-detail-card">
          <div className="story-detail-badge badge-hn">🔥 Hacker News</div>

          <h1 className="story-detail-title">{story.title}</h1>

          <div className="story-detail-meta">
            <div className="story-detail-meta-item">
              <span>⭐</span>
              <div>
                <strong style={{ color: 'var(--accent)' }}>{story.points}</strong>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>points</div>
              </div>
            </div>
            <div className="story-detail-meta-item">
              <span>👤</span>
              <div>
                <strong>{story.author}</strong>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>author</div>
              </div>
            </div>
            <div className="story-detail-meta-item">
              <span>🕒</span>
              <div>
                <strong>{story.postedAt}</strong>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>posted</div>
              </div>
            </div>
            {story.commentCount > 0 && (
              <div className="story-detail-meta-item">
                <span>💬</span>
                <div>
                  <strong>{story.commentCount}</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>comments</div>
                </div>
              </div>
            )}
          </div>

          <div className="story-detail-actions">
            {story.url && (
              <a href={story.url} target="_blank" rel="noopener noreferrer" className="btn-primary">
                🔗 Read Article
              </a>
            )}
            <button
              className={`btn-bookmark-lg${bookmarked ? ' bookmarked' : ''}`}
              onClick={handleBookmark}
            >
              {bookmarked ? '🔖 Bookmarked' : '🏷️ Bookmark'}
            </button>
            <Link to="/" className="btn-secondary">← All Stories</Link>
          </div>
        </div>
      </div>

      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === 'success' ? '✅' : '❌'} {toast.msg}
        </div>
      )}
    </div>
  );
};

export default StoryDetailPage;
