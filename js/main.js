// XoLink Download Page JavaScript

// Download URLs configuration
const downloadUrls = {
  // Movie download URLs
  movie: {
    "420mb-480p-HEVC": "480p-420mb.html",
    "720mb-720p-HEVC": "720p.html",
    "1.1Gb-720p-HD": "720p-1gb.html",
    "2.5Gb-1080p-HD": "index.html",
  },
};

// Initialize the page when DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize download buttons
  initDownloadButtons();

  // Initialize animations
  initAnimations();

  // Check for mobile devices and adjust UI accordingly
  checkMobileDevice();

  // Add resize event listener for responsive adjustments
  window.addEventListener("resize", debounce(checkMobileDevice, 250));
});

// Initialize download buttons functionality
function initDownloadButtons() {
  const downloadButtons = document.querySelectorAll(".download-btn");

  downloadButtons.forEach((button) => {
    // Add hover effect
    button.addEventListener("mouseenter", () => {
      button.querySelector("i").classList.add("bx-tada");
    });

    button.addEventListener("mouseleave", () => {
      button.querySelector("i").classList.remove("bx-tada");
    });

    // Add click effect
    button.addEventListener("click", (e) => {
      e.preventDefault();

      // Prevent multiple clicks
      if (button.classList.contains("downloading")) return;

      const size = button.getAttribute("data-size");
      const quality = button.getAttribute("data-quality");
      const episode = button.getAttribute("data-episode");

      let downloadUrl;

      if (episode) {
        // This is an episode download button
        downloadUrl = downloadUrls.episode[`${episode}-${size}-${quality}`];
      } else {
        // This is a movie download button
        downloadUrl = downloadUrls.movie[`${size}-${quality}`];
      }

      if (downloadUrl) {
        // Add downloading state
        button.classList.add("downloading");

        // Store original background color
        const originalBg = button.className.match(/bg-[\w-]+/)[0];
        const originalHoverBg = button.className.match(/hover:bg-[\w-]+/)[0];

        // Remove original background and add loading animation
        button.classList.remove(originalBg);
        button.classList.add("bg-gray-600");

        // Add download animation
        button.innerHTML = `<i class='bx bx-loader-alt bx-spin'></i> Preparing Download...`;

        // Simulate download preparation (in a real app, this would be an actual download process)
        setTimeout(() => {
          // Change to downloading state
          button.innerHTML = `<i class='bx bx-download bx-flashing'></i> Starting Download...`;

          // Start the download
          window.location.href = downloadUrl;

          // Reset button text and style after a delay
          setTimeout(() => {
            button.classList.remove("downloading", "bg-gray-600");
            button.classList.add(originalBg);

            // Restore original text with icon
            const buttonText = episode
              ? `Download ${size} [${quality}]`
              : `Download ${size} [${quality}]`;
            button.innerHTML = `<i class='bx bx-download'></i> ${buttonText}`;

            // Add success indicator briefly
            const successIndicator = document.createElement("span");
            successIndicator.className = "absolute right-3 text-white";
            successIndicator.innerHTML = `<i class='bx bx-check-circle'></i>`;
            button.appendChild(successIndicator);

            // Remove success indicator after a delay
            setTimeout(() => {
              if (button.contains(successIndicator)) {
                button.removeChild(successIndicator);
              }
            }, 3000);
          }, 2000);
        }, 1500);
      }
    });
  });
}

// Initialize animations
function initAnimations() {
  // Animate elements as they come into view
  const animatedElements = document.querySelectorAll(
    ".movie-card, .episode-card, .notice-section, .thank-you-section"
  );

  // Create an Intersection Observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Add animation class with delay based on index
          setTimeout(() => {
            entry.target.classList.add("animated");
          }, 200);

          // Stop observing after animation
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
  );

  // Observe each element with staggered delay
  animatedElements.forEach((element, index) => {
    setTimeout(() => {
      observer.observe(element);
    }, index * 150);
  });

  // Add icon to download buttons
  const downloadButtons = document.querySelectorAll(".download-btn");
  downloadButtons.forEach((button) => {
    const originalText = button.textContent;
    button.innerHTML = `<i class='bx bx-download'></i> ${originalText}`;
  });

  // Add subtle animation to header
  animateHeader();
}

// Animate header elements
function animateHeader() {
  const header = document.querySelector("header");
  const headerImg = document.querySelector("header img:first-of-type");

  if (headerImg) {
    headerImg.style.opacity = "0";
    headerImg.style.transform = "translateY(-20px)";

    setTimeout(() => {
      headerImg.style.transition = "all 0.8s ease";
      headerImg.style.opacity = "1";
      headerImg.style.transform = "translateY(0)";
    }, 300);
  }

  // Add subtle parallax effect to header on mouse move
  if (window.innerWidth > 768) {
    header.addEventListener("mousemove", (e) => {
      const headerElements = document.querySelectorAll(".header-element");
      const moveX = (e.clientX - window.innerWidth / 2) / 50;
      const moveY = (e.clientY - window.innerHeight / 2) / 50;

      headerElements.forEach((element) => {
        element.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
    });
  }
}

// Check if device is mobile and adjust UI accordingly
function checkMobileDevice() {
  const isMobile = window.innerWidth < 768;
  const downloadButtons = document.querySelectorAll(".download-btn");

  if (isMobile) {
    // Optimize for mobile
    downloadButtons.forEach((button) => {
      // Make icons smaller on mobile
      const icon = button.querySelector("i");
      if (icon) icon.style.fontSize = "1rem";
    });
  } else {
    // Reset for desktop
    downloadButtons.forEach((button) => {
      const icon = button.querySelector("i");
      if (icon) icon.style.fontSize = "";
    });
  }
}

// Debounce function to limit function calls
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
