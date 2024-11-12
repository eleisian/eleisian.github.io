import { BlogRenderer } from './blogRenderer.js';
import { blogPosts } from '../blog/blogPosts.js';

class BlogHandler {
    constructor() {
        this.blogRenderer = new BlogRenderer();
        this.initialize();
    }

    initialize() {
        const blogGrid = document.querySelector('.blog-grid');
        if (blogGrid) {
            this.blogRenderer.initialize(blogPosts);
            this.blogRenderer.renderBlogPosts(blogGrid);
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