document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    initializeCarousel();
});

document.addEventListener('routeChanged', (event) => {
    console.log('Route Changed:', event.detail.page);
    if (event.detail.page === 'projects') {
        setTimeout(() => {
            initializeCarousel();
        }, 100);
    }
});

function initializeCarousel() {
    console.log('Initializing carousel');
    const carousel = document.querySelector('.project-carousel');
    if (!carousel) {
        console.log('No carousel found');
        return;
    }

    const prevBtn = document.querySelector('#projects h2 .carousel-btn.prev');
    const nextBtn = document.querySelector('#projects h2 .carousel-btn.next');
    const counter = document.querySelector('#projects h2 .carousel-counter');
    const grids = carousel.querySelectorAll('.project-grid');
    
    console.log('Elements found:', {
        prevBtn: !!prevBtn,
        nextBtn: !!nextBtn,
        counter: !!counter,
        grids: grids.length
    });

    if (!prevBtn || !nextBtn || !counter || !grids.length) {
        console.error('Missing carousel elements');
        return;
    }

    let currentPage = 0;
    const totalPages = grids.length;

    function updateCarousel() {
        console.log('Updating carousel to page:', currentPage);
        
        grids.forEach((grid, index) => {
            grid.style.display = 'grid';
            grid.classList.remove('active', 'prev', 'next');
            
            if (index < currentPage) {
                grid.classList.add('prev');
            } else if (index > currentPage) {
                grid.classList.add('next');
            } else {
                grid.classList.add('active');
            }
        });
        
        counter.textContent = `${currentPage + 1} / ${totalPages}`;
        
        prevBtn.disabled = currentPage === 0;
        nextBtn.disabled = currentPage === totalPages - 1;
    }

    nextBtn.addEventListener('click', () => {
        console.log('Next button clicked');
        if (currentPage < totalPages - 1) {
            currentPage++;
            updateCarousel();
        }
    });

    prevBtn.addEventListener('click', () => {
        console.log('Prev button clicked');
        if (currentPage > 0) {
            currentPage--;
            updateCarousel();
        }
    });

    updateCarousel();
} 