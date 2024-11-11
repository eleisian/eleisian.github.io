import blogPosts from './blog.js';

export class MarkdownLoader {
    constructor() {
        this.blogPosts = [];
        this.currentSort = 'newest';
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
                const cleanPath = filename.replace(/^\./, '');
                const response = await fetch(cleanPath);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const content = await response.text();
                
                // Parse frontmatter and content
                const { metadata, content: bodyContent } = this.parseFrontMatter(content);
                
                return {
                    filename,
                    metadata,
                    content: bodyContent
                };
            });

            this.blogPosts = await Promise.all(markdownPromises);
            this.blogPosts.sort((a, b) => new Date(b.metadata.date) - new Date(a.metadata.date));
        } catch (error) {
            console.error('Error loading markdown files:', error);
        }
    }

    parseFrontMatter(markdown) {
        const frontMatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
        const match = markdown.match(frontMatterRegex);
        
        if (!match) {
            return {
                metadata: {},
                content: markdown
            };
        }

        const frontMatter = match[1];
        const content = match[2];

        // Parse front matter
        const metadata = {};
        frontMatter.split('\n').forEach(line => {
            const [key, value] = line.split(':').map(str => str.trim());
            if (key && value) {
                metadata[key] = value;
            }
        });

        return { metadata, content };
    }

    sortPosts(order = 'newest') {
        this.currentSort = order;
        this.blogPosts.sort((a, b) => {
            const dateA = new Date(a.metadata.date);
            const dateB = new Date(b.metadata.date);
            return order === 'newest' 
                ? dateB - dateA 
                : dateA - dateB;
        });
    }

    renderBlogPosts(container) {
        container.innerHTML = ''; // Clear existing content
        
        // Add sorting controls
        const controls = document.createElement('div');
        controls.className = 'blog-controls';
        controls.innerHTML = `
            <select class="sort-select">
                <option value="newest" ${this.currentSort === 'newest' ? 'selected' : ''}>Newest First</option>
                <option value="oldest" ${this.currentSort === 'oldest' ? 'selected' : ''}>Oldest First</option>
            </select>
        `;
        container.appendChild(controls);

        // Add event listener for sort select
        const sortSelect = controls.querySelector('.sort-select');
        sortSelect.addEventListener('change', (e) => {
            this.sortPosts(e.target.value);
            this.renderBlogPosts(container);
        });
        
        this.blogPosts.forEach((post, index) => {
            const article = document.createElement('article');
            article.className = 'blog-post';
            
            const date = new Date(post.metadata.date);
            const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            article.innerHTML = `
                <h2>${post.metadata.title}</h2>
                <time datetime="${post.metadata.date}">${formattedDate}</time>
                <div class="content">
                    ${marked.parse(post.content)}
                </div>
            `;
            
            container.appendChild(article);
            
            // Add divider if not the last post
            if (index < this.blogPosts.length - 1) {
                const divider = document.createElement('hr');
                divider.className = 'post-divider';
                container.appendChild(divider);
            }
        });
    }
} 