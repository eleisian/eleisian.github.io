// Function to replay the animation
function replayAnimation(element: HTMLElement) {
  element.classList.remove("name-text");
  void element.offsetWidth;
  element.classList.add("name-text");
}

const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
  entries.forEach((entry: IntersectionObserverEntry) => {
    const element = entry.target as HTMLElement;
    element.classList.toggle("name-text", entry.isIntersecting);
    element.style.opacity = entry.isIntersecting ? '0' : '1';
    element.style.transform = entry.isIntersecting ? 'translateY(20px)' : 'translateY(0)';
    void element.offsetWidth;
    element.style.animation = entry.isIntersecting
      ? 'fade-in 1s 0.3s forwards, slide-up 1s 0.3s forwards'
      : 'fade-out 1s forwards, slide-down 1s forwards';
  });
});

document.querySelectorAll<HTMLElement>(".name-text").forEach(element => observer.observe(element));

function reloadAnimations() {
  document.querySelectorAll<HTMLElement>(".name-text").forEach(element => {
    const rect = element.getBoundingClientRect();
    if (rect.top <= window.innerHeight && rect.bottom >= 0) {
      replayAnimation(element);
    }
  });
}

document.addEventListener("scroll", () => {
  document.querySelectorAll<HTMLElement>("section").forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
      document.querySelectorAll<HTMLElement>(".nav-text").forEach(link => link.classList.remove("active"));
      document.querySelector<HTMLElement>(`[href="#${section.id}"]`)!.classList.add("active");
    }
  });
  reloadAnimations();
});

function initializePage() {
  const firstSection = document.querySelector<HTMLElement>("section");
  const firstLinkId = firstSection!.id;
  document.querySelector<HTMLElement>(`[href="#${firstLinkId}"]`)!.classList.add("active");
}

window.addEventListener("load", initializePage);

function scrollToSection(id: string) {
  event?.preventDefault();
  const element = document.getElementById(id);
  element?.scrollIntoView({ behavior: "smooth" });
  document.querySelectorAll<HTMLElement>(".nav-text").forEach(link => link.classList.remove("active"));
  document.querySelector<HTMLElement>(`[href="#${id}"]`)!.classList.add("active");
  reloadAnimations();
}

const inkContainer = document.getElementById('ink-container') as HTMLElement;
let lastDotTime = 0;
const dotCooldown = 25;

document.addEventListener('mousemove', e => {
  const currentTime = Date.now();
  if (currentTime - lastDotTime > dotCooldown) {
    // Check if the mouse is in the bottom 80% of the section
    if (isMouseInBottom80Percent(e, document.querySelector<HTMLElement>('section')!)) {
      createInkDot(e.clientX, e.clientY);
      lastDotTime = currentTime;
    }
  }
});

const navContainer = document.querySelector<HTMLElement>('.nav-container');

navContainer?.addEventListener('mouseenter', () => clearTimeout(inkDotTimeout));

navContainer?.addEventListener('mouseleave', () => createInkDot(x, y));

  

function createInkDot(x: number, y: number) {
  const inkDot = document.createElement('div');
  inkDot.className = 'ink-dot';
  inkDot.style.cssText = `left: ${x}px; top: ${y}px;`;
  inkContainer.appendChild(inkDot);
  inkDotTimeout = setTimeout(() => inkContainer.removeChild(inkDot), 10000);
}

function isMouseInBottom80Percent(event: MouseEvent, section: HTMLElement) {
  const sectionRect = section.getBoundingClientRect();
  const sectionHeight = sectionRect.height;
  const mouseY = event.clientY;

  // Calculate the bottom 80% of the section
  const bottom80Percent = sectionRect.top + sectionHeight * 0.2;

  return mouseY >= bottom80Percent && mouseY <= sectionRect.bottom;
}

const documentWidth = document.documentElement.offsetWidth;


