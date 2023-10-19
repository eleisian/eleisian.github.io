// Function to replay the animation
function replayAnimation(element) {
  element.classList.remove("name-text");
  void element.offsetWidth;
  element.classList.add("name-text");
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const element = entry.target;
    element.classList.toggle("name-text", entry.isIntersecting);
    element.style.opacity = entry.isIntersecting ? '0' : '1';
    element.style.transform = entry.isIntersecting ? 'translateY(20px)' : 'translateY(0)';
    void element.offsetWidth;
    element.style.animation = entry.isIntersecting
      ? 'fade-in 1s 0.3s forwards, slide-up 1s 0.3s forwards'
      : 'fade-out 1s forwards, slide-down 1s forwards';
  });
});

document.querySelectorAll(".name-text").forEach(function (element) {
  return observer.observe(element);
});

function reloadAnimations() {
  document.querySelectorAll(".name-text").forEach(function (element) {
    var rect = element.getBoundingClientRect();
    if (rect.top <= window.innerHeight && rect.bottom >= 0) {
      replayAnimation(element);
    }
  });
}

document.addEventListener("scroll", function () {
  document.querySelectorAll("section").forEach(function (section) {
    var rect = section.getBoundingClientRect();
    if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
      document.querySelectorAll(".nav-text").forEach(function (link) {
        return link.classList.remove("active");
      });
      document.querySelector("[href='#" + section.id + "']").classList.add("active");
    }
  });
  reloadAnimations();
});

function initializePage() {
  var firstSection = document.querySelector("section");
  var firstLinkId = firstSection.id;
  document.querySelector("[href='#" + firstLinkId + ']').classList.add("active");
}

window.addEventListener("load", initializePage);

function scrollToSection(id) {
  event?.preventDefault();
  var element = document.getElementById(id);
  element?.scrollIntoView({ behavior: "smooth" });
  document.querySelectorAll(".nav-text").forEach(function (link) {
    return link.classList.remove("active");
  });
  document.querySelector("[href='#" + id + ']').classList.add("active");
  reloadAnimations();
}

var inkContainer = document.getElementById('ink-container');
var lastDotTime = 0;
var dotCooldown = 25;

document.addEventListener('mousemove', function (e) {
  var currentTime = Date.now();
  if (currentTime - lastDotTime > dotCooldown) {
    if (isMouseInBottom80Percent(e, document.querySelector('section'))) {
      createInkDot(e.clientX, e.clientY);
      lastDotTime = currentTime;
    }
  }
});

var navContainer = document.querySelector('.nav-container');

navContainer?.addEventListener('mouseenter', function () {
  return clearTimeout(inkDotTimeout);
});

navContainer?.addEventListener('mouseleave', function () {
  return createInkDot(x, y);
});

function createInkDot(x, y) {
  var inkDot = document.createElement('div');
  inkDot.className = 'ink-dot';
  inkDot.style.cssText = "left: " + x + "px; top: " + y + "px;";
  inkContainer.appendChild(inkDot);
  inkDotTimeout = setTimeout(function () {
    return inkContainer.removeChild(inkDot);
  }, 10000);
}

function isMouseInBottom80Percent(event, section) {
  var sectionRect = section.getBoundingClientRect();
  var sectionHeight = sectionRect.height;
  var mouseY = event.clientY;
  var bottom80Percent = sectionRect.top + sectionHeight * 0.2;
  return mouseY >= bottom80Percent && mouseY <= sectionRect.bottom;
}

var documentWidth = document.documentElement.offsetWidth;
