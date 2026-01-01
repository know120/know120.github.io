import { Link } from 'react-router-dom';

const postModules = import.meta.glob('../blog/posts/*.md', { eager: true, query: '?raw', import: 'default' });

const posts = Object.entries(postModules)
  .map(([path, content]) => {
    const fileName = path.split('/').pop().replace('.md', '');
    const datePart = fileName.slice(0, 10);
    const slug = fileName.slice(11) || fileName;  // Everything after date
    let title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    let date = null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
      date = new Date(datePart);
    }
    return { slug: fileName, title, date, content };  // Use fileName as slug for simplicity
  })
  .sort((a, b) => (b.date || new Date(0)) - (a.date || new Date(0)));

export default function BlogList() {
  return (
    <div className="max-w-4xl mx-auto p-8 text-slate-900 dark:text-slate-100">
      <h1 className="text-4xl font-bold mb-8 text-slate-900 dark:text-white">Blog</h1>
      {posts.length === 0 ? (
        <p className="text-slate-500">No posts yet!</p>
      ) : (
        <ul className="space-y-6">
          {posts.map(post => (
            <li key={post.slug} className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <Link to={`/blog/${post.slug}`} className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                {post.title}
              </Link>
              {post.date && <p className="text-slate-500 dark:text-slate-400">{post.date.toLocaleDateString()}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}