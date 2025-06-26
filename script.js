document.addEventListener("DOMContentLoaded", () => {
  // === Hamburger-Menü ===
  const menuToggle = document.getElementById("menuToggle");
  const mobileNav = document.getElementById("mobileNav");

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", () => {
      mobileNav.classList.toggle("visible");
    });
  }

  // === Countdown ===
  const countdownEl = document.getElementById("countdown");
  const countdownDate = new Date("2026-07-01T00:00:00").getTime();

  function updateCountdown() {
    const now = Date.now();
    const diff = countdownDate - now;

    if (diff < 0) {
      countdownEl.textContent = "Es ist so weit!";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    countdownEl.textContent = `${days} Tage noch!`;
  }

  updateCountdown();
  setInterval(updateCountdown, 60 * 60 * 1000); // stündlich aktualisieren

  // === Galerie ===
  const galleryImage = document.getElementById("gallery-image");
  const images = [
    "bilder/bild1.jpg",
    "bilder/bild2.jpg",
    "bilder/bild3.jpg",
    "bilder/bild4.jpg",
    "bilder/bild5.jpg"
  ];
  let currentIndex = 0;

  function updateImage() {
    galleryImage.src = images[currentIndex];
  }

  document.getElementById("prevBtn")?.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateImage();
  });

  document.getElementById("nextBtn")?.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % images.length;
    updateImage();
  });

  // === Newsletter-Formular ===
  const newsletterForm = document.getElementById("newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("newsletter-email").value.trim();
      const vorname = document.getElementById("newsletter-vorname").value.trim();
      const nachname = document.getElementById("newsletter-nachname").value.trim();
      const honey = document.getElementById("newsletter-honey").value;

      if (honey) return; // Spam-Schutz

      try {
        const res = await fetch("https://script.google.com/macros/s/AKfycbz3f_Yaj_lp-GJkrgK5Kit9JG5cccnhAkcSV-oxGrTHAUFyORTfY8MiqYdE_DJwfu7d/exec", {
          method: "POST",
          body: new URLSearchParams({ email, vorname, nachname, _honey: honey })
        });
        const data = await res.json();

        if (data.result === "success") {
          localStorage.setItem("subscriberName", vorname);
          alert(`Danke für deine Anmeldung, ${vorname || "Freund/in"}!`);
          newsletterForm.reset();
        } else if (data.result === "ignored") {
          console.log("Spam-Schutz ausgelöst.");
        } else {
          alert("Fehler bei der Anmeldung. Bitte später erneut versuchen.");
        }
      } catch (error) {
        alert("Es ist ein Fehler aufgetreten.");
        console.error(error);
      }
    });
  }

  // === Kontaktformular ===
  const kontaktForm = document.getElementById("kontakt-form");
  if (kontaktForm) {
    kontaktForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(kontaktForm);

      try {
        const res = await fetch("https://script.google.com/macros/s/AKfycbxYT1R888mhW0clVOqJWOVGfdWj6n4n6XkmwYHw2tdRz0A9l-q4S-47s1ZIzIANyVelVg/exec", {
          method: "POST",
          body: formData
        });
        const text = await res.text();
        alert(text === "Erfolg" ? "Nachricht erfolgreich gesendet!" : "Unbekannte Antwort vom Server.");
        kontaktForm.reset();
      } catch (error) {
        alert("Fehler beim Absenden.");
        console.error(error);
      }
    });
  }

  // === Galerie-Login ===
  const loginForm = document.getElementById("loginForm");
  const loginMessage = document.getElementById("loginMessage");
  const galerieSection = document.getElementById("galerie");

  if (localStorage.getItem("loggedIn") === "true" && galerieSection) {
    galerieSection.style.display = "block";
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value.trim();
      const code = document.getElementById("loginCode").value.trim();

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
        } else {
          loginMessage.textContent = "Login fehlgeschlagen.";
          loginMessage.style.color = "red";
        }
      } catch (error) {
        loginMessage.textContent = "Ein Fehler ist aufgetreten.";
        loginMessage.style.color = "red";
      }
    });
  }

  // === Personalisierte Begrüßung ===
  const greetingName = localStorage.getItem("subscriberName");
  if (greetingName) {
    const headline = document.querySelector("header h1");
    if (headline) {
      headline.textContent = `Willkommen zurück, ${greetingName}!`;
    }
  }
});
