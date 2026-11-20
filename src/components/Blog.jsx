import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { posts } from '../utils/postUtils';
import SectionHeading from './common/SectionHeading';
import BlogCard from './BlogCard';

const Blog = () => {
  const [latestPosts, setLatestPosts] = useState([]);

  useEffect(() => {
    setLatestPosts(posts.slice(0, 3));
  }, []);

  return (
    <section id="blog" className="relative py-16">
      <div className="section-container">
        <SectionHeading
          index="03"
          eyebrow="Notes & ideas"
          title="Latest Insights"
          description="Short notes on building, learning, and shipping things for the web."
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {latestPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link to="/blog" className="btn-secondary group inline-flex items-center gap-2 px-6 py-3">
            View All Articles
            <i className="pi pi-arrow-right text-xs transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Blog;
