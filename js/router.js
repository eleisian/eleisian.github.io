class Router {
  constructor() {
      const mainContent = document.querySelector('main');
      
      // Store initial content from template
      const homeTemplate = document.querySelector('#home-template');
      this.routes = {
          home: {
              'visual-work': homeTemplate.content.querySelector('#visual-work')?.innerHTML,
              'about': homeTemplate.content.querySelector('#about')?.innerHTML
          },
          skills: '',
          projects: ''
      };

      // Remove the template after storing content
      homeTemplate.remove();
      
      // Load templates first, then handle initial route
      Promise.all([
          this.loadTemplate('skills', 'templates/skills.html'),
          this.loadTemplate('projects', 'templates/projects.html')
      ]).then(() => {
          // Add check for empty path and update URL if needed
          if (window.location.hash === '') {
              window.location.hash = '#home';
          }
          
          // Always perform initial navigation
          const initialPage = window.location.hash.slice(1) || 'home';
          this.navigate(initialPage, true);
          
          // Mark router as ready after initial navigation
          mainContent.classList.remove('loading');
          mainContent.classList.add('router-ready');
      });
      
      this.setupEventListeners();
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
          return sectionContent;  // Return the content for Promise.all
      } catch (error) {
          console.error(`Error loading template ${path}:`, error);
          return null;
      }
  }

  setupEventListeners() {
      document.addEventListener('click', (e) => {
          const link = e.target.closest('[data-page]');
          if (link) {
              e.preventDefault();
              const page = link.getAttribute('data-page');
              this.navigate(page);
          }
      });

      window.addEventListener('hashchange', (e) => {
          const page = window.location.hash.slice(1) || 'home';
          this.navigate(page, true);
      });

      // Handle browser back/forward buttons
      window.addEventListener('popstate', (e) => {
          if (e.state && e.state.page) {
              this.navigate(e.state.page, true);
          }
      });
  }

  navigate(page, isPopState = false) {
      // Add check for template loading
      if (!this.routes[page] && page !== 'home') {
          console.warn(`Route ${page} not loaded yet`);
          return;
      }
      
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
      
      // Reinitialize the background
      if (window.background) {
          window.background.destroy();
      }
      window.background = new Background();
      
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

// Initialize router when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.router = new Router();
}); 