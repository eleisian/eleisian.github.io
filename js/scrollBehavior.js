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
});

// Call the initializePage function when the page loads
function initializePage() {
  var firstSection = document.querySelector("section");
  var firstLinkId = firstSection.id;
  var firstLink = document.querySelector(`[href="#${firstLinkId}"]`);
  firstLink.classList.add("active");
}

window.addEventListener("load", initializePage);
window.scrollToSection = function(id) {
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
};
