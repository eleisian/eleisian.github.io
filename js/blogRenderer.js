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
        
        this.blogPosts.forEach((post, index) => {
            const article = document.createElement('article');
            article.className = 'blog-post';
            
            const date = new Date(post.date + 'T12:00:00');
            const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            const contentHtml = post.content.includes('<audio') 
                ? post.content  // If content contains audio tag, use it as-is
                : post.content.split('\n').map(line => `<p>${line}</p>`).join(''); // Otherwise, wrap in p tags

            article.innerHTML = `
                <h2>${post.title}</h2>
                <time datetime="${post.date}">${formattedDate}</time>
                <div class="content">
                    ${contentHtml}
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