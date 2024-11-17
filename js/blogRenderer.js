export class BlogRenderer {
    constructor() {
        this.blogPosts = [];
        this.currentSort = 'newest';
        this.loadTwitterWidget();
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

    loadTwitterWidget() {
        if (!window.twttr) {
            const script = document.createElement('script');
            script.src = "https://platform.twitter.com/widgets.js";
            script.async = true;
            script.charset = "utf-8";
            document.head.appendChild(script);
        }
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

            const contentHtml = post.content.includes('twitter-tweet') 
                ? post.content  // Keep tweet HTML as-is
                : post.content.split('\n').map(line => `<p>${line}</p>`).join('');

            article.innerHTML = `
                <h2>${post.title}</h2>
                <time datetime="${post.date}">${formattedDate}</time>
                <div class="content">
                    ${contentHtml}
                </div>
            `;
            
            container.appendChild(article);

            if (post.content.includes('twitter-tweet') && window.twttr) {
                window.twttr.widgets.load(article);
            }
            
            if (index < this.blogPosts.length - 1) {
                const divider = document.createElement('hr');
                divider.className = 'post-divider';
                container.appendChild(divider);
            }
        });
    }
}