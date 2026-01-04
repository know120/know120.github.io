# How to Add a Blog to Your Portfolio Using Markdown

Adding a blog to your portfolio is a great way to share your thoughts and document your learning journey. In this post, I'll show you how to build a simple, file-based blogging system using **React**, **Vite**, and **Markdown**.

## Why Markdown?
Markdown is perfect for blogging because:
- **Write once, use anywhere**: It's a universal format.
- **Developer-friendly**: You can use your favorite code editor.
- **Version Control**: Since your posts are just files, they live right in your Git repository.

## The Architecture
Our blog system consists of three main parts:
1. **Markdown Files**: Stored in a directory (e.g., `src/blog/posts/`).
2. **Metadata Loader**: Using Vite's `import.meta.glob` to discover and load these files.
3. **Renderer**: Using `react-markdown` to convert Markdown into HTML.

## Step 1: Setting Up the Posts
Create a folder at `src/blog/posts/` and add your first post: `2026-01-01-first-blog.md`.

```markdown
# My First Post
This is my blog post content.
```

## Step 2: Loading Posts with Vite
Vite makes it easy to load multiple files at once using `import.meta.glob`. This snippet finds all `.md` files in the posts directory:

```javascript
const postModules = import.meta.glob('../blog/posts/*.md', { 
  eager: true, 
  query: '?raw', 
  import: 'default' 
});
```

## Step 3: Rendering the Content
We use the `react-markdown` library to handle the conversion. Combined with `@tailwindcss/typography`, your blog will look professional with minimal effort.

```jsx
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function BlogPost({ content }) {
  return (
    <article className="prose lg:prose-xl mx-auto">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </article>
  );
}
```

## Step 4: Adding "Prose" Styling
To make the blog look beautiful, we use the Tailwind CSS Typography plugin. Add the plugin to your `index.css`:

```css
@plugin "@tailwindcss/typography";
```

Then, simply use the `prose` class on your container. It automatically styles headings, lists, links, and code blocks!

## Conclusion
And that's it! You now have a fast, SEO-friendly, and easy-to-maintain blog built directly into your portfolio. Happy coding!
