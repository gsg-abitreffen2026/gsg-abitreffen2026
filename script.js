// === Hamburger-Menü ===
document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobile-nav");

  hamburger.addEventListener("click", () => {
    mobileNav.classList.toggle("active");
  });

  // === Galerie-Bildnavigation ===
  const images = [
    "bilder/bild1.jpg",
    "bilder/bild2.jpg",
    "bilder/bild3.jpg",
    "bilder/bild4.jpg",
    "bilder/bild5.jpg"
  ];
  let currentIndex = 0;

  const galleryImage = document.getElementById("gallery-image");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  function updateImage() {
    galleryImage.src = images[currentIndex];
  }

  prevBtn?.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateImage();
  });

  nextBtn?.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % images.length;
    updateImage();
  });

  updateImage();
});
