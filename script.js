document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";
  const subscriberName = localStorage.getItem("newsletterVorname");

  // === Personalisierte Begrüßung nach Newsletter-Anmeldung ===
  if (subscriberName) {
    const headline = document.querySelector("h1");
    if (headline) {
      headline.textContent = `Willkommen zurück, ${subscriberName}!`;
    }
  }

  // === Galerie Login Sichtbarkeit ===
  const galerieSection = document.getElementById("galerie");
  const loginFormBox = document.getElementById("galerie-login-box");
  if (isLoggedIn) {
    if (galerieSection) galerieSection.style.display = "block";
    if (loginFormBox) loginFormBox.style.display = "none";
  } else {
    if (galerieSection) galerieSection.style.display = "none";
    if (loginFormBox) loginFormBox.style.display = "block";
  }

  // === Newsletter-Box ausblenden, wenn bereits angemeldet ===
  const newsletterBox = document.getElementById("newsletter");
  if (subscriberName && newsletterBox) {
    newsletterBox.style.display = "none";
  }

  // === Galerie-Login-Formular ===
  const loginForm = document.getElementById("loginForm");
  const loginMessage = document.getElementById("loginMessage");
  if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value.trim();
      const code = document.getElementById("loginCode").value.trim();
      if (!email || !code) return;

      try {
        const res = await fetch("https://script.google.com/macros/s/AKfycbw-lreBTRtyeqtmibO8NGYKc0oKgZ2Du7Sdl3BhpOIC9nSENWOlwQrlIH7DxYDGJhPi/exec", {
          method: "POST",
          body: new URLSearchParams({ action: "login", email, code })
        });

        const data = await res.json();
        if (data.result === "success") {
          localStorage.setItem("loggedIn", "true");
          loginMessage.textContent = "Erfolgreich eingeloggt.";
          loginMessage.style.color = "green";
          galerieSection.style.display = "block";
          loginFormBox.style.display = "none";
        } else {
          loginMessage.textContent = "Login fehlgeschlagen. Bitte prüfen.";
          loginMessage.style.color = "red";
        }
      } catch (error) {
        console.error("Login-Fehler:", error);
        loginMessage.textContent = "Ein Fehler ist aufgetreten.";
        loginMessage.style.color = "red";
      }
    });
  }

  // === Newsletter-Formular ===
  const newsletterForm = document.getElementById("newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("newsletter-email").value.trim();
      const vorname = document.getElementById("newsletter-vorname").value.trim();
      const nachname = document.getElementById("newsletter-nachname").value.trim();
      const honey = document.getElementById("newsletter-honey").value;

      if (honey) return;

      fetch("https://script.google.com/macros/s/AKfycbz3f_Yaj_lp-GJkrgK5Kit9JG5cccnhAkcSV-oxGrTHAUFyORTfY8MiqYdE_DJwfu7d/exec", {
        method: "POST",
        body: new URLSearchParams({ email, vorname, nachname, _honey: honey })
      })
      .then(response => response.json())
      .then(data => {
        if (data.result === "success") {
          localStorage.setItem("newsletterVorname", vorname);
          alert(`Danke für deine Anmeldung, ${vorname}!`);
          newsletterForm.reset();
          if (newsletterBox) newsletterBox.style.display = "none";
        } else {
          alert("Fehler bei der Anmeldung.");
        }
      })
      .catch(error => {
        alert("Fehler beim Senden.");
        console.error("Fetch-Fehler:", error);
      });
    });
  }

  // === Galerie-Navigation ===
  const images = ["bilder/bild1.jpg", "bilder/bild2.jpg", "bilder/bild3.jpg", "bilder/bild4.jpg", "bilder/bild5.jpg"];
  let currentIndex = 0;
  const galleryImage = document.getElementById("gallery-image");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  function updateImage() {
    galleryImage.src = images[currentIndex];
  }

  if (prevBtn && nextBtn && galleryImage) {
    prevBtn.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      updateImage();
    });

    nextBtn.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % images.length;
      updateImage();
    });

    updateImage();
  }

  // === Mobile Menü toggeln ===
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("active");
    });
  }

  // === Seite teilen ===
  const shareButton = document.getElementById("share-btn");
  if (shareButton) {
    shareButton.addEventListener("click", async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: "20 Jahre Abi – GSG 2006",
            text: "Schau dir unser Abitreffen an!",
            url: window.location.href
          });
        } catch (err) {
          console.error("Share-Funktion fehlgeschlagen", err);
        }
      } else {
        alert("Teilen wird von deinem Gerät nicht unterstützt.");
      }
    });
  }
});
