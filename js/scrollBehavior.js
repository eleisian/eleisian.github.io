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
    const entry = observer.takeRecords().find(entry => entry.target === element);
    if (entry && entry.isIntersecting) {
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
  document.querySelector("[href='#" + firstLinkId + "']").classList.add("active");
}

window.addEventListener("load", function () {
  initializePage(); // Call the initializePage function when the page is loaded.
});


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
var dotCooldown = 100; // Set a lower cooldown for smoother trail
var inkDots = [];

document.addEventListener('mousemove', function (e) {
  if (isMouseInBottom80Percent(e, document.querySelector('section'))) {
    createInkDot(e.clientX, e.clientY);
  }
});

function isMouseInBottom80Percent(event, section) {
  var sectionRect = section.getBoundingClientRect();
  var sectionHeight = sectionRect.height;
  var mouseY = event.clientY;
  var top20Percent = sectionRect.top + sectionHeight * 0.2;
  return mouseY >= top20Percent && mouseY <= sectionRect.bottom;
}

function createInkDot(x, y) {
  var inkDot = document.createElement('div');
  inkDot.className = 'ink-dot';
  inkDot.style.cssText = "left: " + x + "px; top: " + y + "px;";
  inkContainer.appendChild(inkDot);

  // Add the new dot to the array of dots
  inkDots.push(inkDot);

  // Remove the oldest dot if there are too many dots in the trail
  if (inkDots.length > 10) {
    inkContainer.removeChild(inkDots.shift());
  }
}



var documentWidth = document.documentElement.offsetWidth;
