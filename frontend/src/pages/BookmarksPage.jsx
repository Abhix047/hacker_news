import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StoryCard from '../components/StoryCard';
import { getMe } from '../api';

const BookmarksPage = () => {
  const [bookmarkedStories, setBookmarkedStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const { data } = await getMe();
        setBookmarkedStories(data.user.bookmarks || []);
      } catch {
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    loadBookmarks();
  }, [navigate]);

  if (loading) {
    return (
      <div className="loader-wrap">
        <div className="loader" />
        <p className="loader-text">Loading bookmarks...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>🔖 My Bookmarks</h1>
          <p>Stories you've saved — {bookmarkedStories.length} total</p>
        </div>

        {bookmarkedStories.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏷️</div>
            <h2>No bookmarks yet</h2>
            <p>Browse stories and click the bookmark icon to save them here.</p>
            <Link to="/" className="btn-primary">← Browse Stories</Link>
          </div>
        ) : (
          <div className="stories-grid">
            {bookmarkedStories.map((story, idx) => (
              <StoryCard key={story._id} story={story} rank={idx + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarksPage;
