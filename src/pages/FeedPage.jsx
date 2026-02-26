import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import SiteLayout from '../components/SiteLayout.jsx';

export default function FeedPage({ pageKey = 'home' }) {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const endpoint = pageKey === 'home' ? '/api/posts' : `/api/posts?page=${encodeURIComponent(pageKey)}`;
    api(endpoint)
      .then((data) => setPosts(data.posts || []))
      .catch((err) => setError(err.message));
  }, [pageKey]);

  return (
    <SiteLayout>
      <section id="postsFeed" className="posts-feed">
        {error ? <p className="feed-empty">{error}</p> : null}
        {!error && posts.length === 0 ? <p className="feed-empty">No posts yet.</p> : null}
        {posts.map((post) => (
          <article className="read-card" key={post.id}>
            <div className="read-card-image-wrap">
              <img src={post.imageUrl} alt={post.title} />
            </div>
            <div className="read-card-body">
              <h2>{post.title}</h2>
              <p>{post.description}</p>
              <Link className="read-card-btn" to={`/post.html?id=${encodeURIComponent(post.id)}`}>
                Continue Reading <span aria-hidden="true">&#10140;</span>
              </Link>
            </div>
          </article>
        ))}
      </section>
    </SiteLayout>
  );
}
