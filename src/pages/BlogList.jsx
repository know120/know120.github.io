import { Link } from 'react-router-dom';
import { posts } from '../utils/postUtils';
import SectionHeading from '../components/common/SectionHeading';

export default function BlogList() {
  return (
    <div className="section-container">
      <Link to="/" className="glass-chip mb-10 px-4 py-2 font-mono text-[11px] uppercase tracking-wider">
        <i className="pi pi-arrow-left" /> Back to Home
      </Link>

      <SectionHeading
        index="ARCHIVE"
        eyebrow="All articles"
        title="Blogs"
        description="Notes on building, learning, and shipping."
        align="left"
      />

      {posts.length === 0 ? (
        <p className="glass-panel p-8 text-center text-[var(--text-tertiary)]">No posts yet!</p>
      ) : (
        <ul className="space-y-5">
          {posts.map((post) => (
            <li key={post.slug} className="glass-panel glass-interactive rounded-sm p-6">
              <Link
                to={`/blog/${post.slug}`}
                className="text-xl font-bold tracking-tight text-[var(--text-primary)] transition-colors hover:text-[var(--accent-primary)] sm:text-2xl"
              >
                {post.title}
              </Link>
              {post.date && (
                <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-[var(--text-tertiary)]">
                  {post.date.toLocaleDateString()}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
