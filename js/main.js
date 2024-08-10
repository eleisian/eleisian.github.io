    new fullpage('#fullpage', {
        navigation: true, // Add navigation dots
        sectionsColor: ['#f2f2f2', '#f2f2f2', '#f2f2f2', '#f2f2f2'], // Set section background colors
        scrollingSpeed: 300, // Set the scrolling speed
    });
    
    // Dark mode toggle function
    function toggleDarkMode() {
        const body = $('body');
        const darkModeBtn = $('#darkModeBtn');
        const accordion = $('.accordion');
        const breadcrumbNav = $('nav[aria-label="breadcrumb"]');
    
        body.toggleClass('dark-mode');
        darkModeBtn.toggleClass('active');
    
        // Update data-bs-theme attribute for accordion
        accordion.attr('data-bs-theme', body.hasClass('dark-mode') ? 'dark' : 'light');
        
        // Update data-bs-theme attribute for breadcrumb
        breadcrumbNav.attr('data-bs-theme', body.hasClass('dark-mode') ? 'dark' : 'light');
    
        // Update button text
        const buttonText = body.hasClass('dark-mode') ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i> ';
        darkModeBtn.html(buttonText);
    
        // Example Three.js update for dark mode
        const darkModeMaterial = new THREE.LineBasicMaterial({ color: body.hasClass('dark-mode') ? 0xffffff : 0x000000 });
        outerWireframe.material = darkModeMaterial;
        innerWireframe.material = darkModeMaterial;
    
        // Additional Three.js updates as needed
    }
    
    
    
    function toggleContent(showId, hideId) {
        event.preventDefault();
        var showContainer = $("#" + showId);
        var hideContainer = $("#" + hideId);

        hideContainer.removeClass('visible');
        showContainer.addClass('visible');
    }

    $(document).ready(function() {
        // Check if the browser is Chrome
        if(/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)) {
            $(".blog-container").addClass("chrome-specific");
        }
    });

    $('.blog-container' && '.projects-container').on('wheel touchmove', function(event) {
        event.stopPropagation();
    });

    if (window.innerWidth < 768) {
        $('.about-container').on('wheel touchmove', function(event) {
            event.stopPropagation();
        });
    }
    // Dark mode button click event
    $('#darkModeBtn').on('click', toggleDarkMode);
    window.addEventListener('load', function () {
    twttr.widgets.load();
  });