class Router {
    constructor() {
        // Store initial content
        const mainContent = document.querySelector('main');
        this.routes = {
            home: {
                'visual-work': mainContent.querySelector('#visual-work')?.innerHTML,
                'about': mainContent.querySelector('#about')?.innerHTML
            },
            skills: '',
            projects: ''
        };
        
        // Load templates
        this.loadTemplate('skills', 'templates/skills.html');
        this.loadTemplate('projects', 'templates/projects.html');
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Handle initial route based on URL hash
        const initialPage = window.location.hash.slice(1) || 'home';
        if (initialPage === 'home') {
            history.replaceState({ page: 'home' }, '', '#home');
        } else {
            this.navigate(initialPage, true);
        }
    }

    async loadTemplate(routeName, path) {
        try {
            const response = await fetch(path);
            const html = await response.text();
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            // Extract only the section content
            const sectionContent = tempDiv.querySelector('section').innerHTML;
            this.routes[routeName] = sectionContent;
        } catch (error) {
            console.error(`Error loading template ${path}:`, error);
        }
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-page]')) {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
                this.navigate(page);
            }
        });

        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.page) {
                this.navigate(e.state.page, true);
            }
        });
    }

    navigate(page, isPopState = false) {
        if (this.routes[page]) {
            const main = document.querySelector('main');
            const header = main.querySelector('header');
            
            // Clear all sections after header
            main.innerHTML = '';
            main.appendChild(header);

            if (page === 'home') {
                // Add visual-work section
                if (this.routes.home['visual-work']) {
                    const visualSection = document.createElement('section');
                    visualSection.id = 'visual-work';
                    visualSection.innerHTML = this.routes.home['visual-work'];
                    visualSection.classList.add('page-transition');
                    main.appendChild(visualSection);
                }
                
                // Add about section
                if (this.routes.home['about']) {
                    const aboutSection = document.createElement('section');
                    aboutSection.id = 'about';
                    aboutSection.innerHTML = this.routes.home['about'];
                    aboutSection.classList.add('page-transition');
                    main.appendChild(aboutSection);
                }
            } else {
                // Add the page-specific section with transition
                const newSection = document.createElement('section');
                newSection.id = page;
                newSection.innerHTML = this.routes[page];
                newSection.classList.add('page-transition');
                main.appendChild(newSection);
            }
            
            // Trigger animation after a brief delay
            requestAnimationFrame(() => {
                const sections = document.querySelectorAll('.page-transition');
                sections.forEach(section => {
                    section.classList.add('visible');
                });
            });
            
            if (!isPopState) {
                history.pushState({ page }, '', `#${page}`);
            }
        }
    }
}

// Initialize router when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.router = new Router();
}); 