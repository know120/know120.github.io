import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const postModules = import.meta.glob('../blog/posts/*.md', { eager: true, query: '?raw', import: 'default' });  // Adjust path if needed

export default function BlogPost() {
  const { slug } = useParams();
  const fullSlug = slug + '.md';
  const content = Object.entries(postModules).find(([path]) => path.endsWith(fullSlug))?.[1] || '# Post Not Found';
  console.log(content);

  return (
    <div className="section-container">
      <Link to="/blog" className="text-blue-500 hover:underline mb-4 inline-block">&larr; Back to Blog</Link>
      <article className="prose lg:prose-xl dark:prose-invert dark:text-slate-300 max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </article>
    </div>
  );
}