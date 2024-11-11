import { blogPosts } from './blog.js';

export class MarkdownLoader {
    constructor() {
        this.blogPosts = [];
        this.currentSort = 'newest'; // Default sort
    }

    parseFrontmatter(content) {
        const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
        const match = content.match(frontmatterRegex);
        
        if (!match) {
            return {
                metadata: {},
                content: content
            };
        }

        const metadata = {};
        const frontmatterContent = match[1];
        const markdownContent = match[2];

        frontmatterContent.split('\n').forEach(line => {
            const [key, value] = line.split(': ');
            if (key && value) {
                metadata[key.trim()] = value.trim();
            }
        });

        return {
            metadata,
            content: markdownContent
        };
    }

    async loadMarkdownFiles() {
        try {
            const markdownPromises = blogPosts.map(async (filename) => {
                const response = await fetch(`/blog/${filename}`);
                const rawContent = await response.text();
                const { metadata, content } = this.parseFrontmatter(rawContent);
                
                const title = metadata.title || filename.replace('.md', '')
                    .split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                
                const date = metadata.date ? new Date(metadata.date) : new Date();
                const preview = content.split('\n')[0];
                
                return {
                    title,
                    preview,
                    content,
                    date,
                    filename
                };
            });

            this.blogPosts = await Promise.all(markdownPromises);
            this.blogPosts.sort((a, b) => b.date - a.date);
            return this.blogPosts;
        } catch (error) {
            console.error('Error loading markdown files:', error);
            return [];
        }
    }

    sortPosts(order = 'newest') {
        this.currentSort = order;
        this.blogPosts.sort((a, b) => {
            return order === 'newest' 
                ? b.date - a.date 
                : a.date - b.date;
        });
    }

    renderBlogPosts(container) {
        container.innerHTML = `
            <div class="blog-controls">
                <div class="sort-controls">
                    <label>Sort by:</label>
                    <select class="sort-select">
                        <option value="newest" ${this.currentSort === 'newest' ? 'selected' : ''}>Newest First</option>
                        <option value="oldest" ${this.currentSort === 'oldest' ? 'selected' : ''}>Oldest First</option>
                    </select>
                </div>
            </div>
            ${this.blogPosts.map(post => `
                <article class="blog-post">
                    <h2>${post.title}</h2>
                    <time datetime="${post.date.toISOString()}">${post.date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}</time>
                    <div class="content">
                        ${marked.parse(post.content)}
                    </div>
                    <hr class="post-divider">
                </article>
            `).join('')}`;

        const sortSelect = container.querySelector('.sort-select');
        sortSelect.addEventListener('change', (e) => {
            this.sortPosts(e.target.value);
            this.renderBlogPosts(container);
        });
    }
} 