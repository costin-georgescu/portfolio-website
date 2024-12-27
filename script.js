let textLength = 0;
let text = `HTML5
CSS3/SASS/SCSS
Bootstrap & Tailwind
Javascript
TypeScript
React
Node.js
Express.js`;

function type() {
  let textChar = text.charAt(textLength++);
  let paragraph = document.getElementById('typed');
  let charElement = document.createTextNode(textChar);
  paragraph.appendChild(charElement);
  if (textLength < text.length + 1) {
    setTimeout('type()', 50);
  } else {
    text = '';
  }
}

// Create intersection observer
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      // When skills section is in view and animation hasn't run yet
      if (entry.isIntersecting && textLength === 0) {
        type(); // Start typing animation
        observer.unobserve(entry.target); // Stop observing after animation starts
      }
    });
  },
  {
    threshold: 0.5, // Trigger when 50% of the element is visible
  }
);

document.addEventListener('DOMContentLoaded', function () {
  // Start observing the skills section
  const skillsSection = document.querySelector('.skills-content');
  if (skillsSection) {
    observer.observe(skillsSection);
  }
});
