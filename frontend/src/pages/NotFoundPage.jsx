import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="page">
      <div className="container">
        <div className="empty-state">
          <div className="empty-icon">🗺️</div>
          <h2>404 - Page Not Found</h2>
          <p>The page you are looking for doesn't exist or has been moved.</p>
          <Link to="/" className="btn-primary">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
