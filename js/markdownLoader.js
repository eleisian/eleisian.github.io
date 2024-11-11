export class BlogRenderer {
    constructor() {
        this.blogPosts = [];
        this.currentSort = 'newest';
    }

    initialize(posts) {
        this.blogPosts = posts;
        this.sortPosts(this.currentSort);
    }

    sortPosts(order) {
        this.currentSort = order;
        this.blogPosts.sort((a, b) => {
            const dateA = new Date(a.date + 'T12:00:00');
            const dateB = new Date(b.date + 'T12:00:00');
            return order === 'newest' ? dateB - dateA : dateA - dateB;
        });
    }

    renderBlogPosts(container) {
        container.innerHTML = '';
        
        const controls = document.createElement('div');
        controls.className = 'blog-controls';
        controls.innerHTML = `
            <select class="sort-select">
                <option value="newest" ${this.currentSort === 'newest' ? 'selected' : ''}>Newest First</option>
                <option value="oldest" ${this.currentSort === 'oldest' ? 'selected' : ''}>Oldest First</option>
            </select>
        `;

        controls.querySelector('.sort-select').addEventListener('change', (e) => {
            this.sortPosts(e.target.value);
            this.renderBlogPosts(container);
        });

        container.appendChild(controls);

        this.blogPosts.forEach((post, index) => {
            const article = document.createElement('article');
            article.className = 'blog-post';
            
            const date = new Date(post.date + 'T12:00:00');
            const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            article.innerHTML = `
                <h2>${post.title}</h2>
                <time datetime="${post.date}">${formattedDate}</time>
                <div class="content">
                    ${marked.parse(post.content)}
                </div>
            `;
            
            container.appendChild(article);
            
            if (index < this.blogPosts.length - 1) {
                const divider = document.createElement('hr');
                divider.className = 'post-divider';
                container.appendChild(divider);
            }
        });
    }
}