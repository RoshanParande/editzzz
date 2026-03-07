import { useEffect } from 'react';
import { toCanonicalUrl } from '../lib/seo.js';

function upsertMeta(attr, key, content) {
  if (!content) return;
  const selector = `meta[${attr}="${key}"]`;
  let tag = document.head.querySelector(selector);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

export default function Seo({
  title,
  description,
  keywords,
  canonicalPath = '/',
  imageUrl = '',
  noindex = false,
  jsonLd = null
}) {
  useEffect(() => {
    const fullTitle = title || 'Roshan Editzz | RoshanEdits';
    document.title = fullTitle;

    upsertMeta('name', 'description', description || 'Roshan Editzz shares presets, templates, AI prompts, and reel editing guides.');
    upsertMeta('name', 'keywords', keywords || 'roshanedits, roshan editzz, editzz, photo editing, video editing');
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');

    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', description || '');
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:url', toCanonicalUrl(canonicalPath));
    upsertMeta('property', 'og:image', imageUrl);

    upsertMeta('name', 'twitter:card', imageUrl ? 'summary_large_image' : 'summary');
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', description || '');
    upsertMeta('name', 'twitter:image', imageUrl);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', toCanonicalUrl(canonicalPath));

    const scriptId = 'seo-json-ld';
    const prevScript = document.getElementById(scriptId);
    if (prevScript) prevScript.remove();
    if (jsonLd) {
      const jsonLdScript = document.createElement('script');
      jsonLdScript.id = scriptId;
      jsonLdScript.type = 'application/ld+json';
      jsonLdScript.text = JSON.stringify(jsonLd);
      document.head.appendChild(jsonLdScript);
    }
  }, [title, description, keywords, canonicalPath, imageUrl, noindex, jsonLd]);

  return null;
}
