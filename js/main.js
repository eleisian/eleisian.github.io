        document.addEventListener('DOMContentLoaded', function () {
            const trackContainer = document.querySelector('.carousel-track-container');
            const nextButton = document.querySelector('.carousel-button.next');
            const prevButton = document.querySelector('.carousel-button.prev');
            const gridWidth = trackContainer.clientWidth;

            const moveToGrid = (direction) => {
                const currentScroll = trackContainer.scrollLeft;
                const newScroll = direction === 'next' ? currentScroll + gridWidth : currentScroll - gridWidth;
                trackContainer.scrollTo({ left: newScroll, behavior: 'smooth' });
            };

            prevButton.addEventListener('click', () => moveToGrid('prev'));
            nextButton.addEventListener('click', () => moveToGrid('next'));
        });