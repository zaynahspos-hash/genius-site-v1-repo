import React, { useEffect, useState } from 'react';
import { pageService } from '../../../services/pageService';
import { useParams } from 'react-router-dom';
import { ContactPage } from './ContactPage';

export const PageViewer: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (slug) {
        pageService.getPage(slug)
            .then(setPage)
            .catch(() => setError(true));
    }
  }, [slug]);

  if (error) return <div className="p-20 text-center text-gray-500">Page not found</div>;
  if (!page) return <div className="p-20 text-center">Loading...</div>;

  if (page.template === 'contact') return <ContactPage />;

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${page.template === 'full-width' ? 'max-w-none px-0' : ''}`}>
        {!page.template?.includes('full') && <h1 className="text-4xl font-bold text-gray-900 mb-8">{page.title}</h1>}
        <div className="prose prose-lg max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: page.content }} />
    </div>
  );
};