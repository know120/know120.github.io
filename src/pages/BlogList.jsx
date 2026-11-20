import { Link } from 'react-router-dom';
import { posts } from '../utils/postUtils';

export default function BlogList() {
  return (
    <div className="section-container">
      <Link to="/" className="glass-chip mb-6 px-4 py-2 text-sm">&larr; Back to Home</Link>

      <div className="mb-10 text-center">
        <h1 className="heading-gradient text-4xl font-bold">Blogs</h1>
        <p className="mt-3 text-[var(--text-secondary)]">Notes on building, learning, and shipping.</p>
      </div>

      {posts.length === 0 ? (
        <p className="glass-panel p-8 text-center text-[var(--text-tertiary)]">No posts yet!</p>
      ) : (
        <ul className="space-y-5">
          {posts.map(post => (
            <li key={post.slug} className="glass-panel glass-interactive rounded-3xl p-6">
              <Link to={`/blog/${post.slug}`} className="text-2xl font-semibold text-white transition-colors hover:text-[var(--accent-secondary)]">
                {post.title}
              </Link>
              {post.date && <p className="mt-2 text-sm text-[var(--text-tertiary)]">{post.date.toLocaleDateString()}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
