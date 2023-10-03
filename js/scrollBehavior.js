// Function to replay the animation
function replayAnimation(element) {
  // Remove the 'name-text' class to clear the animation
  element.classList.remove("name-text");

  // Trigger a reflow to remove the animation
  void element.offsetWidth;

  // Add the 'name-text' class back to restart the animation
  element.classList.add("name-text");
}

// Create an Intersection Observer
// Create an Intersection Observer
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const element = entry.target;
    if (entry.isIntersecting) {
      // Element is in view, add the 'name-text' class
      element.classList.add("name-text");
      
      // Reset animation properties
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      void element.offsetWidth;
      element.style.animation = 'fade-in 1s 0.3s forwards, slide-up 1s 0.3s forwards';
    } else {
      // Element is out of view, remove the 'name-text' class
      element.classList.remove("name-text");
      
      // Reset animation properties for fade-out
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
      void element.offsetWidth;
      element.style.animation = 'fade-out 1s forwards, slide-down 1s forwards';
    }
  });
});


// Observe each 'name-text' element
const nameTextElements = document.querySelectorAll(".name-text");
nameTextElements.forEach(element => {
  observer.observe(element);
});

// Call reloadAnimations on page load to initialize animations
function reloadAnimations() {
  nameTextElements.forEach(element => {
    var rect = element.getBoundingClientRect();
    if (rect.top <= window.innerHeight && rect.bottom >= 0) {
      // Element is in view, reload animations
      replayAnimation(element);
    }
  });
}

// Add an event listener to track scroll and update active link
document.addEventListener("scroll", function () {
  var sections = document.querySelectorAll("section");
  sections.forEach(section => {
    var rect = section.getBoundingClientRect();
    if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
      var sectionId = section.id;
      var activeLink = document.querySelector(`[href="#${sectionId}"]`);
      var links = document.querySelectorAll(".navbarText");
      links.forEach(link => {
        link.classList.remove("active");
      });
      activeLink.classList.add("active");
    }
  });

  // Call the function to reload animations when scrolling
  reloadAnimations();
});

// Call the initializePage function when the page loads
function initializePage() {
  var firstSection = document.querySelector("section");
  var firstLinkId = firstSection.id;
  var firstLink = document.querySelector(`[href="#${firstLinkId}"]`);
  firstLink.classList.add("active");
}

window.addEventListener("load", initializePage);

// Modified scrollToSection to include the replayAnimations call
function scrollToSection(id) {
  event.preventDefault();
  var element = document.getElementById(id);
  element.scrollIntoView({ behavior: "smooth" });

  // Remove active class from all links
  var links = document.querySelectorAll(".navbarText");
  links.forEach(link => {
    link.classList.remove("active");
  });

  // Add active class to the clicked link
  var clickedLink = document.querySelector(`[href="#${id}"]`);
  clickedLink.classList.add("active");

  // Call the function to reload animations when scrolling
  reloadAnimations();
}
