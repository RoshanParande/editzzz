import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { initTheme } from './lib/theme.js';
import FeedPage from './pages/FeedPage.jsx';
import PostPage from './pages/PostPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import StaticPage from './pages/StaticPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import AdminPostEditPage from './pages/AdminPostEditPage.jsx';

const legalPages = {
  privacy: {
    title: 'Privacy Policy',
    sections: [
      {
        heading: 'Information We Collect',
        body: 'When you submit the contact form, we collect your name, email address, and message. We also store post and media data created by admin users.'
      },
      {
        heading: 'How We Use Information',
        body: 'We use submitted information only to respond to your inquiry, manage website content, and improve site functionality.'
      },
      {
        heading: 'Data Storage',
        body: 'Contact messages and posts are stored in MongoDB. Uploaded images are stored on Cloudinary and referenced by URL in our database.'
      },
      {
        heading: 'Third-Party Links',
        body: 'Some posts may include links to external platforms. We are not responsible for the privacy practices of those external sites.'
      },
      {
        heading: 'Contact',
        body: 'If you want to request removal or correction of your submitted data, contact us through the Contact page.'
      }
    ]
  },
  terms: {
    title: 'Terms and Conditions',
    sections: [
      {
        heading: 'Use of Website',
        body: 'By using this website, you agree to use content for lawful purposes only and not to misuse, copy, or redistribute site material without permission.'
      },
      {
        heading: 'Content Accuracy',
        body: 'We try to keep all content accurate and updated, but we do not guarantee that every post, link, or resource is always complete or error-free.'
      },
      {
        heading: 'User Conduct',
        body: 'You agree not to submit harmful, abusive, or illegal material through the contact form or any site interaction.'
      },
      {
        heading: 'Changes to Terms',
        body: 'We may update these terms at any time. Continued use of the website after updates means you accept the revised terms.'
      }
    ]
  },
  disclaimer: {
    title: 'Disclaimer',
    sections: [
      {
        heading: 'General Information',
        body: 'All tutorials, editing resources, and related guidance on this site are provided for general informational purposes only.'
      },
      {
        heading: 'No Professional Advice',
        body: 'Content is shared as educational material and should not be treated as legal, financial, or professional advice.'
      },
      {
        heading: 'External Resources',
        body: 'Links, tools, and third-party assets are owned by their respective providers. Availability and policies may change without notice.'
      },
      {
        heading: 'Limitation of Liability',
        body: 'We are not liable for any direct or indirect loss, damage, or issue resulting from use of the website or third-party resources.'
      }
    ]
  }
};

export default function App() {
  useEffect(() => {
    initTheme();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home.html" replace />} />
      <Route path="/index.html" element={<Navigate to="/home.html" replace />} />
      <Route path="/home.html" element={<FeedPage pageKey="home" />} />
      <Route path="/lightroom.html" element={<FeedPage pageKey="lightroom" />} />
      <Route path="/snapseed.html" element={<FeedPage pageKey="snapseed" />} />
      <Route path="/Capcut.html" element={<FeedPage pageKey="capcut" />} />
      <Route path="/Reel.html" element={<FeedPage pageKey="reel" />} />
      <Route path="/aiprompts.html" element={<FeedPage pageKey="aiprompts" />} />
      <Route path="/post.html" element={<PostPage />} />
      <Route path="/post/:id" element={<PostPage />} />
      <Route path="/contact.html" element={<ContactPage />} />
      <Route path="/privacy.html" element={<StaticPage title={legalPages.privacy.title} sections={legalPages.privacy.sections} />} />
      <Route path="/terms.html" element={<StaticPage title={legalPages.terms.title} sections={legalPages.terms.sections} />} />
      <Route path="/disclaimer.html" element={<StaticPage title={legalPages.disclaimer.title} sections={legalPages.disclaimer.sections} />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/admin/post/:id" element={<AdminPostEditPage />} />
      <Route path="*" element={<Navigate to="/home.html" replace />} />
    </Routes>
  );
}
