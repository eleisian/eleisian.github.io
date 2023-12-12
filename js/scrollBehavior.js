// Function to replay the animation
function replayAnimation(element) {
  element.classList.remove("name-text");
  // Using requestAnimationFrame to trigger a reflow
  requestAnimationFrame(() => {
    element.classList.add("name-text");
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const element = entry.target;
    element.classList.toggle("name-text", entry.isIntersecting);
    element.style.opacity = entry.isIntersecting ? '0' : '1';
    element.style.transform = entry.isIntersecting ? 'translateY(20px)' : 'translateY(0)';
    // Using requestAnimationFrame instead of void element.offsetWidth
    requestAnimationFrame(() => {
      element.style.animation = entry.isIntersecting
        ? 'fade-in 1s 0.3s forwards, slide-up 1s 0.3s forwards'
        : 'fade-out 1s forwards, slide-down 1s forwards';
    });
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
  initializePage();
});

function scrollToSection(id, event) {
  if (event) {
    event.preventDefault();
  }
  var element = document.getElementById(id);
  element?.scrollIntoView({ behavior: "smooth" });
  document.querySelectorAll(".nav-text").forEach(function (link) {
    return link.classList.remove("active");
  });
  document.querySelector("[href='#" + id + "']").classList.add("active");
  reloadAnimations();
}

