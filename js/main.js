$(document).ready(function() {
    // Initialize Fullpage.js
    new fullpage('#fullpage', {
        navigation: true,
        sectionsColor: ['#f2f2f2', '#f2f2f2', '#f2f2f2', '#f2f2f2'],
        scrollingSpeed: 300,
        normalScrollElements: '.projects-container, .about-container',
        scrollOverflow: true,
        onLeave: function(origin, destination, direction) {
            // Remove fade-in class from all containers when leaving a section
            $('.about-container, .blog-container, .blog-post, .projects-container, .contact-container, #threeCanvas').removeClass('fade-in');
        },
        afterLoad: function(origin, destination, direction) {
            fadeInContainers(destination.index);
        }
    });

    // Dark mode toggle function
    function toggleDarkMode() {
        const body = $('body');
        const darkModeBtn = $('#darkModeBtn');
        const accordion = $('.accordion');
        const breadcrumbNav = $('nav[aria-label="breadcrumb"]');
        body.toggleClass('dark-mode');
        darkModeBtn.toggleClass('active');
        accordion.attr('data-bs-theme', body.hasClass('dark-mode') ? 'dark' : 'light');
        breadcrumbNav.attr('data-bs-theme', body.hasClass('dark-mode') ? 'dark' : 'light');
        const buttonText = body.hasClass('dark-mode') ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        darkModeBtn.html(buttonText);
        if (window.updateThreeJsColors) {
            window.updateThreeJsColors(body.hasClass('dark-mode'));
        }
    }

    // Update the toggleContent function
    window.toggleContent = function(showClass, hideClass) {
        const showContainers = document.getElementsByClassName(showClass);
        const hideContainers = document.getElementsByClassName(hideClass);

        // Hide all containers with the hideClass
        for (let container of hideContainers) {
            container.classList.remove('fade-in');
            container.style.display = 'none';
        }

        // Show all containers with the showClass
        for (let container of showContainers) {
            container.style.display = 'block';
            
            // Force a reflow before adding the fade-in class
            void container.offsetWidth;

            // Add fade-in class
            container.classList.add('fade-in');
        }

        if (showClass === 'blog-container') {
            loadBlogPosts();
        }
    }

    // Improved scroll handling
    let scrollOverflowUp = 0;
    let scrollOverflowDown = 0;
    const desktopOverflowThreshold = 3000;
    const mobileOverflowThreshold = 200; // Lower threshold for mobile devices
    let isChangingSection = false;
    let touchStartY = 0;

    function handleScroll(event) {
        if (isChangingSection) {
            return;
        }

        const $this = $(this);
        const scrollTop = $this.scrollTop();
        const scrollHeight = $this.prop('scrollHeight');
        const containerHeight = $this.innerHeight();
        let scrollDelta;
        
        // Improved mobile detection
        const isMobile = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(navigator.userAgent) || 'ontouchstart' in window;
        const overflowThreshold = isMobile ? mobileOverflowThreshold : desktopOverflowThreshold;

        // Determine scroll delta based on event type
        if (event.type === 'wheel') {
            scrollDelta = event.originalEvent.deltaY;
        } else if (event.type === 'touchmove') {
            const touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
            scrollDelta = touchStartY - touch.pageY;
            touchStartY = touch.pageY;
        }

        // Check if the container is scrollable
        const isScrollable = scrollHeight > containerHeight;

        // Update the scroll overflow only if the container is not scrollable or at the edges
        if (!isScrollable || (scrollDelta > 0 && scrollTop + containerHeight >= scrollHeight - 1) || (scrollDelta < 0 && scrollTop <= 1)) {
            if (scrollDelta > 0) {
                scrollOverflowDown += Math.abs(scrollDelta);
                scrollOverflowUp = 0;
            } else if (scrollDelta < 0) {
                scrollOverflowUp += Math.abs(scrollDelta);
                scrollOverflowDown = 0;
            }
        } else {
            // Reset overflow counters if scrolling within the container
            scrollOverflowDown = 0;
            scrollOverflowUp = 0;
        }

        // Check if overflow threshold is reached
        if (scrollOverflowDown >= overflowThreshold) {
            isChangingSection = true;
            fullpage_api.moveSectionDown();
            resetScrollState();
        } else if (scrollOverflowUp >= overflowThreshold) {
            isChangingSection = true;
            fullpage_api.moveSectionUp();
            resetScrollState();
        }

        // Prevent default only if changing section
        if (isChangingSection) {
            event.preventDefault();
        }
    }

    function resetScrollState() {
        setTimeout(() => {
            isChangingSection = false;
            scrollOverflowUp = 0;
            scrollOverflowDown = 0;
        }, 0); // Adjust this delay if needed
    }

    function handleTouchStart(event) {
        touchStartY = event.originalEvent.touches[0].pageY;
    }

    // Apply the scroll handlers to the containers
    $(document).on('wheel touchmove', '.blog-container, .projects-container, .about-container, .contact-container, .blog-post', handleScroll);
    $(document).on('touchstart', '.blog-container, .projects-container, .about-container, .contact-container, .blog-post', handleTouchStart);

    // Dark mode button click event
    $('#darkModeBtn').on('click', toggleDarkMode);

    // Update the fadeInContainers function
    function fadeInContainers(sectionIndex) {
        switch(sectionIndex) {
            case 0:
                $('.about-container, .blog-container').addClass('fade-in');
                setTimeout(() => {
                    $('.blog-post, .blog-content').addClass('fade-in');
                }, 100); // Slight delay for blog posts and content
                break;
            case 1:
                $('.projects-container').addClass('fade-in');
                break;
            case 2:
                $('.contact-container, #threeCanvas').addClass('fade-in');
                break;
        }
    }

    // Remove the setTimeout call for fadeInContainers
    // setTimeout(fadeInContainers, 100);

    // Load blog posts function
    async function loadBlogPosts() {
        try {
            const response = await fetch('blog-posts.json');
            const posts = await response.json();
            const blogPostsContainer = document.getElementById('blog-posts');
            blogPostsContainer.innerHTML = '';

            for (const post of posts) {
                const postElement = document.createElement('div');
                postElement.className = 'blog-post';
                
                const contentResponse = await fetch(post.contentFile);
                const content = await contentResponse.text();
                
                postElement.innerHTML = `
                    <h3>${post.title}</h3>
                    <div class="blog-content">${marked.parse(content)}</div>
                `;
                blogPostsContainer.appendChild(postElement);
            }

            // Force a reflow before adding the fade-in class
            void blogPostsContainer.offsetWidth;

            // Add fade-in class to blog posts after they're loaded
            $('.blog-post, .blog-content').addClass('fade-in');

            // Reattach scroll handlers to the newly loaded content
            $('.blog-post, .blog-content').each(function() {
                $(this).on('wheel touchmove', handleScroll);
                $(this).on('touchstart', handleTouchStart);
            });

        } catch (error) {
            console.error('Error loading blog posts:', error);
        }
    }

    async function loadBlogContent(contentFile) {
        try {
            const response = await fetch(contentFile);
            const content = await response.text();
            const blogPostsContainer = document.getElementById('blog-posts');
            blogPostsContainer.innerHTML = marked.parse(content);
        } catch (error) {
            console.error('Error loading blog content:', error);
        }
    }

    // Call this function when the page loads
    document.addEventListener('DOMContentLoaded', loadBlogPosts);

});