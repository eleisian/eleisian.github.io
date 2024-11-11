import { MarkdownLoader } from './markdownLoader.js';

export const blogPosts = [
    "murphyslaw.md",
    "situationships.md",
    "thenewworld.md"
];

class BlogHandler {
    constructor() {
        this.markdownLoader = new MarkdownLoader();
        this.initialize();
    }

    async initialize() {
        const blogGrid = document.querySelector('.blog-grid');
        if (blogGrid) {
            await this.markdownLoader.loadMarkdownFiles();
            this.markdownLoader.renderBlogPosts(blogGrid);
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