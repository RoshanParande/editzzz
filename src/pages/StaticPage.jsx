import SiteLayout from '../components/SiteLayout.jsx';

export default function StaticPage({ title, text, sections = [] }) {
  return (
    <SiteLayout>
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
