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
        return { slug: fileName, title: title, date: date, category: null, readTime: null, excerpt: null, image: null, content: content };
    })
    .sort((a, b) => (b.date || new Date(0)) - (a.date || new Date(0)));

export { posts };