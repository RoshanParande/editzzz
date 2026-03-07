import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import SiteLayout from '../components/SiteLayout.jsx';
import Seo from '../components/Seo.jsx';
import { toCanonicalUrl } from '../lib/seo.js';

const FEED_SEO = {
  home: {
    title: 'Roshan Editzz (RoshanEdits) | Photo & Video Editing Resources',
    description: 'Roshan Editzz shares trending presets, templates, AI prompts, and editing guides for creators.',
    keywords: 'roshanedits, roshan editzz, editzz, photo editing, video editing, presets, templates',
    path: '/home.html'
  },
  lightroom: {
    title: 'Lightroom Presets | Roshan Editzz',
    description: 'Download and explore Lightroom presets for cinematic, moody, and viral editing styles.',
    keywords: 'lightroom preset, roshan editzz, roshanedits, presets',
    path: '/lightroom.html'
  },
  snapseed: {
    title: 'Snapseed Presets | Roshan Editzz',
    description: 'Find Snapseed preset styles and mobile photo editing tutorials from Roshan Editzz.',
    keywords: 'snapseed preset, roshan editzz, photo editing',
    path: '/snapseed.html'
  },
  capcut: {
    title: 'CapCut Templates | Roshan Editzz',
    description: 'Browse CapCut templates and viral reel editing resources published by Roshan Editzz.',
    keywords: 'capcut template, capcut editing, roshan editzz',
    path: '/Capcut.html'
  },
  reel: {
    title: 'VN Editing & Reels | Roshan Editzz',
    description: 'Get VN editing codes, reel ideas, and trending short-video editing guidance.',
    keywords: 'vn editing, reels editing, roshan editzz',
    path: '/Reel.html'
  },
  aiprompts: {
    title: 'AI Prompts for Editing | Roshan Editzz',
    description: 'Use AI prompts for photo and video editing workflows, captions, and creator content ideas.',
    keywords: 'ai prompts, chatgpt prompts, gemini prompts, roshan editzz',
    path: '/aiprompts.html'
  }
};

export default function FeedPage({ pageKey = 'home' }) {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const seo = FEED_SEO[pageKey] || FEED_SEO.home;

  useEffect(() => {
    const endpoint = pageKey === 'home' ? '/api/posts' : `/api/posts?page=${encodeURIComponent(pageKey)}`;
    api(endpoint)
      .then((data) => setPosts(data.posts || []))
      .catch((err) => setError(err.message));
  }, [pageKey]);

  return (
    <SiteLayout>
      <Seo
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
        canonicalPath={seo.path}
        jsonLd={
          pageKey === 'home'
            ? {
                '@context': 'https://schema.org',
                '@graph': [
                  {
                    '@type': 'WebSite',
                    name: 'Roshan Editzz',
                    alternateName: 'RoshanEdits',
                    url: toCanonicalUrl('/home.html')
                  },
                  {
                    '@type': 'Organization',
                    name: 'Roshan Editzz',
                    alternateName: 'RoshanEdits',
                    url: toCanonicalUrl('/home.html'),
                    email: 'roshaneditzz098@gmail.com'
                  }
                ]
              }
            : null
        }
      />
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
