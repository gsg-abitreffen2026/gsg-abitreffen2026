document.addEventListener("DOMContentLoaded", () => {
  // === Personalisierte Begrüßung ===
  const subscriberName = localStorage.getItem("newsletterVorname");
  if (subscriberName) {
    const headline = document.querySelector("h1");
    if (headline) headline.textContent = `Willkommen zurück, ${subscriberName}!`;
  }

  // === Galerie-Login Prüfung ===
  const loggedIn = localStorage.getItem("loggedIn") === "true";
  const galerieSection = document.getElementById("galerie");
  const galerieLoginBox = document.getElementById("galerie-login-box");
  const newsletterBox = document.getElementById("newsletter-box");

  if (loggedIn) {
    if (galerieSection) galerieSection.style.display = "block";
    if (galerieLoginBox) galerieLoginBox.style.display = "none";
    if (newsletterBox) newsletterBox.style.display = "none";
  } else {
    if (galerieSection) galerieSection.style.display = "none";
  }

  // === Login-Formular ===
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
          body: new URLSearchParams({
            action: "login",
            email,
            code
          })
        });

        const data = await res.json();
        if (data.result === "success") {
          localStorage.setItem("loggedIn", "true");
          if (galerieSection) galerieSection.style.display = "block";
          if (galerieLoginBox) galerieLoginBox.style.display = "none";
          if (newsletterBox) newsletterBox.style.display = "none";
          loginMessage.textContent = "Erfolgreich eingeloggt.";
          loginMessage.style.color = "green";
        } else {
          loginMessage.textContent = "Login fehlgeschlagen.";
          loginMessage.style.color = "red";
        }
      } catch (error) {
        loginMessage.textContent = "Fehler beim Login.";
        loginMessage.style.color = "red";
        console.error(error);
      }
    });
  }

  // === Galerie-Bilder ===
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

  if (galleryImage && prevBtn && nextBtn) {
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

  // === Newsletter ===
  const newsletterForm = document.getElementById("newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("newsletter-email").value.trim();
      const vorname = document.getElementById("newsletter-vorname").value.trim();
      const nachname = document.getElementById("newsletter-nachname").value.trim();
      const honey = document.getElementById("newsletter-honey").value;

      if (honey) return; // Spam-Schutz

      fetch("https://script.google.com/macros/s/AKfycby0G5vxerMS7KcI8b60qlGFcBVyGZ8YjrY8YNX81pD7cyZQigL_cTF0uvL5Ka1XZZ1e/exec", {
        method: "POST",
        body: new URLSearchParams({
          email,
          vorname,
          nachname
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.result === "success") {
            localStorage.setItem("newsletterVorname", vorname);
            alert(`Danke für deine Anmeldung, ${vorname}!`);
            newsletterForm.reset();
          } else {
            alert("Anmeldung fehlgeschlagen.");
          }
        })
        .catch(error => {
          alert("Fehler bei der Anmeldung.");
          console.error(error);
        });
    });
  }

  // === Share-Button ===
  const shareButton = document.getElementById("share-button");
  if (shareButton) {
    shareButton.addEventListener("click", async () => {
      try {
        if (navigator.share) {
          await navigator.share({
            title: "Abi-Treffen 2006",
            text: "Schau dir unsere Abi-Treffen-Seite an!",
            url: window.location.href
          });
        } else {
          alert("Dein Browser unterstützt die Teilen-Funktion nicht.");
        }
      } catch (err) {
        console.error("Share fehlgeschlagen:", err);
      }
    });
  }

  // === Burger Menü ===
  const burgerBtn = document.getElementById("burger-menu");
  const navMenu = document.getElementById("mobile-nav");

  if (burgerBtn && navMenu) {
    burgerBtn.addEventListener("click", () => {
      navMenu.classList.toggle("open");
    });
  }
});
