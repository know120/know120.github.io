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
      <Link to="/blog" className="glass-chip mb-10 inline-flex px-4 py-2 font-mono text-[11px] uppercase tracking-wider">
        <i className="pi pi-arrow-left" /> Back to Blog
      </Link>
      <article className="glass-panel prose prose-invert lg:prose-xl max-w-none rounded-sm p-6 text-[var(--text-secondary)] sm:p-10">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </article>
    </div>
  );
}
