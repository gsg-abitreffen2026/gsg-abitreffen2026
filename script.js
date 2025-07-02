
document.addEventListener("DOMContentLoaded", () => {
  // === Hamburger-Menü ===
  const burgerButton = document.getElementById("burgerButton");
  const mobileMenu = document.getElementById("mobileMenu");

  if (burgerButton && mobileMenu) {
    burgerButton.addEventListener("click", () => {
      mobileMenu.style.display = mobileMenu.style.display === "block" ? "none" : "block";
    });
  }

  // === Share Button (Desktop + Mobil) ===
  const shareButtonDesktop = document.getElementById("shareButton");
  const shareButtonMobile = document.getElementById("shareButtonMobile");

  [shareButtonDesktop, shareButtonMobile].forEach(button => {
    if (button && navigator.share) {
      button.addEventListener("click", () => {
        navigator.share({
          title: "Abi-Treffen 2026",
          text: "Sei dabei beim 20-jährigen Abiturjubiläum!",
          url: window.location.href
        }).catch(err => {
          console.error("Teilen abgebrochen oder nicht möglich:", err);
        });
      });
    } else if (button) {
      button.style.display = "none";
    }
  });

  // === Countdown ===
  const countdownDate = new Date("2026-07-01T00:00:00").getTime();
  const countdownEls = document.querySelectorAll("#countdown, #countdown-box");

  function updateCountdown() {
    const now = new Date().getTime();
    const diff = countdownDate - now;
    const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
    const text = diff < 0 ? "Es ist so weit!" : `${days} Tage noch!`;

    countdownEls.forEach(el => el.textContent = text);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000 * 60 * 60);

  // === Galerie-Login + Newsletter nach Status verstecken ===
  const loginBox = document.getElementById("galerie-login-box");
  const galerieSection = document.getElementById("galerie");
  const newsletterBox = document.getElementById("newsletter");

  if (localStorage.getItem("loggedIn") === "true") {
    loginBox?.remove();
    galerieSection?.classList.remove("hidden");
  } else {
    galerieSection?.classList.add("hidden");
  }

  if (localStorage.getItem("newsletterVorname")) {
    newsletterBox?.remove();
  }

  // === Newsletter-Formular ===
  const newsletterForm = document.getElementById("newsletter-form");

  newsletterForm?.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("newsletter-email").value.trim();
    const vorname = document.getElementById("newsletter-vorname").value.trim();
    const nachname = document.getElementById("newsletter-nachname").value.trim();
    const honey = document.getElementById("newsletter-honey").value;

    if (honey) return;

    fetch("https://script.google.com/macros/s/AKfycbwwlu6CF5YrsvGGYPM7lXqBjQOsiIwgUZmco5qEDaPtC_AJt_i0eucICNlYYSLosrnx/exec", {
      method: "POST",
      body: new URLSearchParams({
        action: "newsletter",
        email,
        vorname,
        nachname,
        _honey: honey
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.result === "success") {
        localStorage.setItem("newsletterVorname", vorname);
        alert(`Danke für deine Anmeldung, ${vorname || "Freund/in"}!`);
        newsletterForm.reset();
        newsletterBox?.remove();
      } else if (data.result === "ignored") {
        console.log("Spam-Schutz ausgelöst");
      } else {
        alert("Fehler bei der Anmeldung. Bitte versuche es später.");
        console.error(data.message || "Unbekannter Fehler");
      }
    })
    .catch(error => {
      alert("Es ist ein Fehler aufgetreten.");
      console.error("Fetch-Fehler:", error);
    });
  });

  // === Kontaktformular ===
  const kontaktForm = document.getElementById("kontakt-form");

  kontaktForm?.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(kontaktForm);

    try {
      const res = await fetch("https://script.google.com/macros/s/AKfycbxYT1R888mhW0clVOqJWOVGfdWj6n4n6XkmwYHw2tdRz0A9l-q4S-47s1ZIzIANyVelVg/exec", {
        method: "POST",
        body: formData
      });

      const text = await res.text();
      alert(text === "Erfolg" ? "Nachricht erfolgreich gesendet!" : "Unbekannte Antwort.");
      kontaktForm.reset();
    } catch (error) {
      alert("Fehler beim Absenden. Bitte versuche es später.");
      console.error(error);
    }
  });

  // === Galerie-Login ===
  const loginForm = document.getElementById("loginForm");
  const loginMessage = document.getElementById("loginMessage");

  loginForm?.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const code = document.getElementById("loginCode").value.trim();

    if (!email || !code) return;

    try {
      const res = await fetch("https://script.google.com/macros/s/AKfycbw-lreBTRtyeqtmibO8NGYKc0oKgZ2Du7Sdl3BhpOIC9nSENWOlwQrlIH7DxYDGJhPi/exec", {
        method: "POST",
        body: new URLSearchParams({
          action: "login",
          email,
          code
        })
      });

      const data = await res.json();
      if (data.result === "success") {
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("subscriberName", data.name || "");
        loginMessage.textContent = "Erfolgreich eingeloggt.";
        loginMessage.style.color = "green";
        loginBox?.remove();
        galerieSection?.classList.remove("hidden");
      } else {
        loginMessage.textContent = "Login fehlgeschlagen. Bitte prüfe deine Angaben.";
        loginMessage.style.color = "red";
      }
    } catch (error) {
      console.error("Login-Fehler:", error);
      loginMessage.textContent = "Ein Fehler ist aufgetreten.";
      loginMessage.style.color = "red";
    }
  });

  // === Galerie-Slideshow ===
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
    if (galleryImage) {
      galleryImage.src = images[currentIndex];
    }
  }

  updateImage();

  prevBtn?.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateImage();
  });

  nextBtn?.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % images.length;
    updateImage();
  });

  galleryImage?.addEventListener("error", () => {
    console.error(`Bild nicht gefunden: ${galleryImage.src}`);
  });
});
