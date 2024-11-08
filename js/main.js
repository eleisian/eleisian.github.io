document.addEventListener('DOMContentLoaded', function () {
    const carousel = document.querySelector('.carousel');
    const slides = document.querySelectorAll('.carousel-slide');
    const nextButton = document.querySelector('.carousel-button.next');
    const prevButton = document.querySelector('.carousel-button.prev');
    const dots = document.querySelectorAll('.carousel-dot');
    
    let currentSlide = 0;
    const slidesPerView = 4; // Number of slides to show at once
    const totalSlides = Math.ceil(slides.length / slidesPerView);

    function updateCarousel() {
        // Calculate the translation based on slidesPerView
        const translation = (currentSlide * 25); // 25% per slide group
        carousel.style.transform = `translateX(-${translation}%)`;
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }

    // Add event listeners
    nextButton.addEventListener('click', nextSlide);
    prevButton.addEventListener('click', prevSlide);
    
    // Add click events to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateCarousel();
        });
    });

    // Optional: Auto-advance slides
    // setInterval(nextSlide, 5000);

    // Handle responsive updates
    function updateSlidesPerView() {
        if (window.innerWidth <= 480) {
            slidesPerView = 1;
        } else if (window.innerWidth <= 768) {
            slidesPerView = 2;
        } else if (window.innerWidth <= 1024) {
            slidesPerView = 3;
        } else {
            slidesPerView = 4;
        }
        // Recalculate totalSlides
        totalSlides = Math.ceil(slides.length / slidesPerView);
        // Reset position if needed
        if (currentSlide >= totalSlides) {
            currentSlide = totalSlides - 1;
            updateCarousel();
        }
    }

    window.addEventListener('resize', updateSlidesPerView);
    updateSlidesPerView();
});