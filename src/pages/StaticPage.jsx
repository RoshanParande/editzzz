import SiteLayout from '../components/SiteLayout.jsx';
import Seo from '../components/Seo.jsx';

const STATIC_PATHS = {
  'Privacy Policy': '/privacy.html',
  'Terms and Conditions': '/terms.html',
  Disclaimer: '/disclaimer.html'
};

export default function StaticPage({ title, text, sections = [] }) {
  return (
    <SiteLayout>
      <Seo
        title={`${title} | Roshan Editzz`}
        description={`${title} page for Roshan Editzz.`}
        keywords={`roshan editzz ${title.toLowerCase()}, roshanedits`}
        canonicalPath={STATIC_PATHS[title] || '/home.html'}
      />
      <section className="content-box content-box--left">
        <h2>{title}</h2>
        {text ? <p>{text}</p> : null}
        {sections.map((section) => (
          <div key={section.heading}>
            <h3>{section.heading}</h3>
            <p>{section.body}</p>
          </div>
        ))}
      </section>
    </SiteLayout>
  );
}
