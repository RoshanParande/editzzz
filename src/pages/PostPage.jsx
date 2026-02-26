import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api.js';
import SiteLayout from '../components/SiteLayout.jsx';

export default function PostPage() {
  const [search] = useSearchParams();
  const { id: routeId } = useParams();
  const postId = search.get('id') || routeId || '';
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    if (!postId) return;
    api(`/api/posts/${encodeURIComponent(postId)}`)
      .then((data) => setPost(data.post || null))
      .catch((err) => setError(err.message));
  }, [postId]);

  const paragraphs = useMemo(() => {
    const text = (post?.content || post?.description || '').trim();
    return text ? text.split(/\n{2,}/) : [];
  }, [post]);

  const canPopup = (post?.pageKey === 'reel' || post?.pageKey === 'capcut') && post?.popupImageUrl;
  const isPrompt = post?.pageKey === 'aiprompts';

  const copyPrompt = async () => {
    const text = post?.content || post?.description || '';
    await navigator.clipboard.writeText(text);
  };

  return (
    <SiteLayout>
      <article className="post-detail">
        {error ? <p className="feed-empty">{error}</p> : null}
        {!error && !post ? <p className="feed-empty">Loading post...</p> : null}

        {post ? (
          <>
            <Link className="read-card-btn" to="/home.html">Back to Home</Link>
            <h1>{post.title}</h1>
            <p className="post-meta">{post.description}</p>
            <div className="post-image-wrap">
              <img src={post.imageUrl} alt={post.title} />
            </div>
            <div className="post-content">
              {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>
            <div className="post-card-actions post-detail-actions">
              {isPrompt ? (
                <button type="button" className="read-card-btn" onClick={copyPrompt}>Copy Prompt</button>
              ) : null}
              {canPopup ? (
                <button type="button" className="read-card-btn" onClick={() => setPopupOpen(true)}>
                  {post.buttonIconUrl ? <img src={post.buttonIconUrl} alt="" className="post-btn-icon" /> : null}
                  {post.buttonText || 'Open'}
                </button>
              ) : null}
              {!canPopup && post.buttonLink ? (
                <a className="read-card-btn" href={post.buttonLink} target="_blank" rel="noopener">
                  {post.buttonIconUrl ? <img src={post.buttonIconUrl} alt="" className="post-btn-icon" /> : null}
                  {post.buttonText || 'Open'}
                </a>
              ) : null}
            </div>
          </>
        ) : null}
      </article>

      {popupOpen && canPopup ? (
        <div className="post-popup-modal">
          <div className="post-popup-backdrop" onClick={() => setPopupOpen(false)} />
          <div className="post-popup-box">
            <button type="button" className="post-popup-close" onClick={() => setPopupOpen(false)}>&times;</button>
            <img src={post.popupImageUrl} alt="Code image" />
          </div>
        </div>
      ) : null}
    </SiteLayout>
  );
}
