document.addEventListener('DOMContentLoaded', function() {
    const projectsSection = document.getElementById('projects');
    const blogSection = document.getElementById('blog');
    const blogPostsContainer = document.getElementById('blog-posts');
    const showProjectsLink = document.getElementById('show-projects');
    const showBlogLink = document.getElementById('show-blog');

    // Function to switch between projects and blog
    function switchContent(showBlog) {
        if (showBlog) {
            projectsSection.classList.remove('active');
            projectsSection.classList.add('hidden');
            blogSection.classList.remove('hidden');
            blogSection.classList.add('active');
            showProjectsLink.classList.remove('active');
            showBlogLink.classList.add('active');
        } else {
            blogSection.classList.remove('active');
            blogSection.classList.add('hidden');
            projectsSection.classList.remove('hidden');
            projectsSection.classList.add('active');
            showBlogLink.classList.remove('active');
            showProjectsLink.classList.add('active');
        }
    }

    // Function to load blog posts
    async function loadBlogPosts() {
        try {
            const response = await fetch('blog-posts.json');
            const posts = await response.json();
            
            blogPostsContainer.innerHTML = '';
            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.classList.add('blog-post');
                postElement.innerHTML = `
                    <h3>${post.title}</h3>
                    <p>Date: ${post.date}</p>
                    <a href="#" class="read-more" data-content-file="${post.contentFile}">Read More</a>
                `;
                blogPostsContainer.appendChild(postElement);
            });

            // Add event listeners to "Read More" links
            document.querySelectorAll('.read-more').forEach(link => {
                link.addEventListener('click', async (e) => {
                    e.preventDefault();
                    const contentFile = e.target.getAttribute('data-content-file');
                    const content = await fetchBlogContent(contentFile);
                    displayBlogPost(content);
                });
            });
        } catch (error) {
            console.error('Error loading blog posts:', error);
        }
    }

    // Function to fetch blog content
    async function fetchBlogContent(contentFile) {
        const response = await fetch(contentFile);
        return await response.text();
    }

    // Function to display a blog post
    function displayBlogPost(content) {
        blogPostsContainer.innerHTML = `
            <div class="blog-post-content">
                ${marked.parse(content)}
            </div>
            <a href="#" id="back-to-posts">Back to Posts</a>
        `;

        document.getElementById('back-to-posts').addEventListener('click', (e) => {
            e.preventDefault();
            loadBlogPosts();
        });
    }

    // Add event listeners to navigation links
    showProjectsLink.addEventListener('click', (e) => {
        e.preventDefault();
        switchContent(false);
    });

    showBlogLink.addEventListener('click', (e) => {
        e.preventDefault();
        switchContent(true);
        loadBlogPosts();
    });

    // Initial load
    loadBlogPosts();
});