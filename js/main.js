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
            $('.about-container, .blog-container, .projects-container, .contact-container, #threeCanvas').removeClass('fade-in');
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

    // Toggle content visibility function
    function toggleContent(event, showId, hideId) {
        event.preventDefault();
        var showContainer = $("#" + showId);
        var hideContainer = $("#" + hideId);
        hideContainer.removeClass('visible');
        showContainer.addClass('visible');
    }

    // Improved scroll handling
    let scrollOverflowUp = 0;
    let scrollOverflowDown = 0;
    const overflowThreshold = 1000; // Adjust this value to change the required overflow amount
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
            if (scrollTop + containerHeight >= scrollHeight - 1) { // Allow for small rounding errors
                scrollOverflowDown += Math.abs(scrollDelta);
                scrollOverflowUp = 0; // Reset upward overflow
            } else {
                scrollOverflowDown = 0; // Reset if not at bottom
            }
        } else if (scrollDelta < 0) {
            // Scrolling up
            if (scrollTop <= 1) { // Allow for small rounding errors
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

        // Don't prevent default scroll behavior
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
    $('.blog-container, .projects-container, .about-container, .contact-container').on('wheel touchmove', handleScroll);
    $('.blog-container, .projects-container, .about-container, .contact-container').on('touchstart', handleTouchStart);

    // Dark mode button click event
    $('#darkModeBtn').on('click', toggleDarkMode);

    // Update the fadeInContainers function
    function fadeInContainers(sectionIndex) {
        switch(sectionIndex) {
            case 0:
                $('.about-container, .blog-container').addClass('fade-in');
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
});