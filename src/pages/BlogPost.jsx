import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPost } from '../utils/postUtils';

export default function BlogPost() {
  const { slug } = useParams();
  const fullSlug = slug + '.md';
  const content = getPost(fullSlug);

  return (
    <div className="section-container">
      <Link to="/blog" className="glass-chip mb-6 inline-flex px-4 py-2 text-sm">&larr; Back to Blog</Link>
      <article className="glass-panel prose prose-invert lg:prose-xl max-w-none rounded-3xl p-6 text-[var(--text-secondary)] sm:p-10">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </article>
    </div>
  );
}
