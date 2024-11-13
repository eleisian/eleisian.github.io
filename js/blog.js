import { BlogRenderer } from './blogRenderer.js';

class BlogHandler {
    constructor() {
        this.blogRenderer = new BlogRenderer();
        this.initialize();
    }

    initialize() {
        const blogGrid = document.querySelector('.blog-grid');
        if (blogGrid) {
            fetch(`../blog/blogPosts.js?v=${Date.now()}`)
                .then(response => response.text())
                .then(text => {
                    const cleanedText = text.replace('export const blogPosts =', 'const blogPosts =');
                    const posts = new Function(`
                        ${cleanedText}
                        return blogPosts;
                    `)();
                    
                    this.blogRenderer.initialize(posts);
                    this.blogRenderer.renderBlogPosts(blogGrid);
                });
        }
    }
}

// Initialize blog handler when navigating to blog page
document.addEventListener('DOMContentLoaded', () => {
    const originalNavigate = window.router.navigate;
    window.router.navigate = function(page, isPopState = false) {
        originalNavigate.call(this, page, isPopState);
        if (page === 'blog') {
            new BlogHandler();
        }
    };
}); 