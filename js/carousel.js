document.addEventListener('DOMContentLoaded', () => {
    initializeCarousel();
});

document.addEventListener('routeChanged', (event) => {
    if (event.detail.page === 'projects') {
        setTimeout(() => {
            initializeCarousel();
        }, 100);
    }
});

function initializeCarousel() {
    const carousel = document.querySelector('.project-carousel');
    if (!carousel) {
        return;
    }

    const prevBtn = document.querySelector('#projects h2 .carousel-btn.prev');
    const nextBtn = document.querySelector('#projects h2 .carousel-btn.next');
    const counter = document.querySelector('#projects h2 .carousel-counter');
    const grids = carousel.querySelectorAll('.project-grid');
    
    if (!prevBtn || !nextBtn || !counter || !grids.length) {
        return;
    }

    let currentPage = 0;
    const totalPages = grids.length;

    function updateCarousel() {
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
        if (currentPage < totalPages - 1) {
            currentPage++;
            updateCarousel();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            updateCarousel();
        }
    });

    updateCarousel();
} 