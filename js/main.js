$(document).ready(function() {
    // Check if the device is mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // Set up normalScrollElements based on device type
    let normalScrollElements = '.projects-container';
    if (isMobile) {
        normalScrollElements += ', .about-container, .blog-container';
    }

    // Initialize Fullpage.js
    new fullpage('#fullpage', {
        navigation: true,
        sectionsColor: ['#f2f2f2', '#f2f2f2', '#f2f2f2', '#f2f2f2'],
        scrollingSpeed: 300,
        normalScrollElements: normalScrollElements,
        scrollOverflow: true,
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

    // Toggle content visibility function
    function toggleContent(showId, hideId) {
        event.preventDefault();
        var showContainer = $("#" + showId);
        var hideContainer = $("#" + hideId);
        hideContainer.removeClass('visible');
        showContainer.addClass('visible');
    }

    // Improved scroll handling
    let scrollOverflowUp = 0;
    let scrollOverflowDown = 0;
    let overflowThreshold = isMobile ? 100 : 1111; // Adjust this value to change the required overflow amount
    let isChangingSection = false;
    let touchStartY = 0;

    function handleScroll(event) {
        if (isChangingSection) {
            return;
        }

        const $this = $(this);
        
        // Check if this element should have normal scrolling on mobile
        if (isMobile && (
            $this.hasClass('projects-container') || 
            $this.hasClass('about-container') || 
            $this.hasClass('blog-container')
        )) {
            return; // Allow normal scrolling for these elements on mobile
        }

        const scrollTop = $this.scrollTop();
        const scrollHeight = $this.prop('scrollHeight');
        const containerHeight = $this.innerHeight();
        let scrollDelta;

        // Determine scroll delta based on event type
        if (event.type === 'wheel') {
            scrollDelta = event.originalEvent.deltaY;
        } else if (event.type === 'touchmove') {
            const touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
            scrollDelta = touchStartY - touch.pageY;
            touchStartY = touch.pageY;
        }

        // Update the scroll overflow
        if (scrollDelta > 0) {
            // Scrolling down
            if (scrollTop + containerHeight >= scrollHeight) {
                scrollOverflowDown += Math.abs(scrollDelta);
                scrollOverflowUp = 0; // Reset upward overflow
            } else {
                scrollOverflowDown = 0; // Reset if not at bottom
            }
        } else if (scrollDelta < 0) {
            // Scrolling up
            if (scrollTop <= 0) {
                scrollOverflowUp += Math.abs(scrollDelta);
                scrollOverflowDown = 0; // Reset downward overflow
            } else {
                scrollOverflowUp = 0; // Reset if not at top
            }
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

        // Prevent default scroll behavior when at the boundaries
        if ((scrollDelta > 0 && scrollTop + containerHeight >= scrollHeight) ||
            (scrollDelta < 0 && scrollTop <= 0)) {
            event.preventDefault();
        }
    }

    function resetScrollState() {
        setTimeout(() => {
            isChangingSection = false;
            scrollOverflowUp = 0;
            scrollOverflowDown = 0;
        }, 1000); // Adjust this delay if needed
    }

    function handleTouchStart(event) {
        touchStartY = event.originalEvent.touches[0].pageY;
    }

    // Apply the scroll handlers to the containers
    $('.blog-container, .projects-container, .about-container').on('wheel touchmove', handleScroll);
    $('.blog-container, .projects-container, .about-container').on('touchstart', handleTouchStart);

    // Dark mode button click event
    $('#darkModeBtn').on('click', toggleDarkMode);
});