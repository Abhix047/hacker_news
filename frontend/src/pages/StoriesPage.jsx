import { useState, useEffect, useCallback } from 'react';
import { fetchStories, triggerScrape } from '../api';
import StoryCard from '../components/StoryCard';
import Pagination from '../components/Pagination';
import { useAuth } from '../context/AuthContext';

const StoriesPage = () => {
  const [stories, setStories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [toast, setToast] = useState(null);
  const { user } = useAuth();

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadStories = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await fetchStories(page, 10);
      setStories(data.data);
      setPagination(data.pagination);
    } catch {
      showToast('Failed to load stories', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadStories(1); }, [loadStories]);

  const handleScrape = async () => {
    setScraping(true);
    try {
      const { data } = await triggerScrape();
      showToast(data.message, 'success');
      await loadStories(1);
    } catch {
      showToast('Scrape failed. Try again.', 'error');
    } finally {
      setScraping(false);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div className="page-header-actions">
            <div>
              <h1>🔥 Top Stories</h1>
              <p>Latest from Hacker News — sorted by points</p>
            </div>
            <button className="btn-scrape" onClick={handleScrape} disabled={scraping}>
              {scraping ? <span className="spin">⟳</span> : '⚡'}
              {scraping ? 'Scraping...' : 'Refresh Stories'}
            </button>
          </div>
        </div>

        {!loading && stories.length > 0 && (
          <div className="stats-bar">
            <div className="stat-item">
              <span className="stat-value">{pagination.total}</span>
              <span className="stat-label">Total Stories</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-value">{stories[0]?.points || 0}</span>
              <span className="stat-label">Top Score</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-value">Page {pagination.page}/{pagination.totalPages}</span>
              <span className="stat-label">Current Page</span>
            </div>
            {user && (
              <>
                <div className="stat-divider" />
                <div className="stat-item">
                  <span className="stat-value" style={{ color: 'var(--accent)' }}>👤 {user.username}</span>
                  <span className="stat-label">Logged In</span>
                </div>
              </>
            )}
          </div>
        )}

        {loading ? (
          <div className="loader-wrap">
            <div className="loader" />
            <p className="loader-text">Loading stories...</p>
          </div>
        ) : stories.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📰</div>
            <h2>No stories yet</h2>
            <p>Click "Refresh Stories" to scrape the latest from Hacker News.</p>
            <button className="btn-scrape" onClick={handleScrape} disabled={scraping}>
              ⚡ Fetch Stories Now
            </button>
          </div>
        ) : (
          <>
            <div className="stories-grid">
              {stories.map((story, idx) => (
                <StoryCard
                  key={story._id}
                  story={story}
                  rank={(pagination.page - 1) * 10 + idx + 1}
                />
              ))}
            </div>
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={loadStories}
            />
          </>
        )}
      </div>

      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === 'success' ? '✅' : '❌'} {toast.msg}
        </div>
      )}
    </div>
  );
};

export default StoriesPage;
