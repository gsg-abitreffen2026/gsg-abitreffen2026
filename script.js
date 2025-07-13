document.addEventListener("DOMContentLoaded", () => {
  // ===== MENÜ-ICON (animiert mit MENÜ/X und Buchstaben) =====
  const burgerButton = document.getElementById("burgerButton");
  const mobileMenu = document.getElementById("mobileMenu");
  let menuOpen = false;

  if (burgerButton && mobileMenu) {
    burgerButton.addEventListener("click", () => {
      menuOpen = !menuOpen;
      mobileMenu.classList.toggle("active", menuOpen);
      burgerButton.classList.toggle("open", menuOpen);
    });
    // Menü am Start immer zu!
    mobileMenu.classList.remove("active");
    burgerButton.classList.remove("open");
  }

  // ===== SHARE BUTTON (Desktop + Mobil) =====
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

  // ===== COUNTDOWN =====
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

  // ===== ZUSTANDSSTEUERUNG: Galerie-Login, Newsletter, Galerie =====
  const newsletterBox = document.getElementById("newsletter");
  const galerieSection = document.getElementById("galerie");
  const loginBoxDesktop = document.getElementById("galerie-login-box");
  const loginBoxMobile = document.getElementById("galerie-login-mobile");

  function updateBoxVisibility() {
    const isNewsletter = !!localStorage.getItem("newsletterVorname");
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";
    // NEWSLETTER
    if (newsletterBox) newsletterBox.style.display = isNewsletter ? "none" : "";
    // GALERIE-LOGIN
    if (loginBoxDesktop) loginBoxDesktop.style.display = (isNewsletter && !isLoggedIn) ? "" : "none";
    if (loginBoxMobile) loginBoxMobile.style.display = (isNewsletter && !isLoggedIn) ? "" : "none";
    // GALERIE
    if (galerieSection) galerieSection.classList.toggle("hidden", !isLoggedIn);
  }
  updateBoxVisibility();

  // ===== NEWSLETTER-FORMULAR =====
  const newsletterForm = document.getElementById("newsletter-form");
  const newsletterButton = newsletterForm?.querySelector("button[type='submit']");
  let newsletterLock = false;

  newsletterForm?.addEventListener("submit", function (e) {
    e.preventDefault();
    if (newsletterLock) return; // Klick-Sperre!
    newsletterLock = true;
    newsletterButton.disabled = true;
    setTimeout(() => {
      newsletterLock = false;
      newsletterButton.disabled = false;
    }, 5000);

    const email = document.getElementById("newsletter-email").value.trim();
    const vorname = document.getElementById("newsletter-vorname").value.trim();
    const nachname = document.getElementById("newsletter-nachname").value.trim();
    const honey = document.getElementById("newsletter-honey").value;

    if (honey) return;

    fetch("https://gsg-proxy.vercel.app/api/proxy", {
      method: "POST",
      body: new URLSearchParams({
        action: "newsletter",
        email, vorname, nachname,
        _honey: honey
      })
    })
      .then(async response => {
        const text = await response.text();
        try {
          return JSON.parse(text);
        } catch (err) {
          throw err;
        }
      })
      .then(data => {
        if (data.result === "success") {
          localStorage.setItem("newsletterVorname", vorname);
          alert(`Danke für deine Anmeldung, ${vorname || "Freund/in"}!`);
          newsletterForm.reset();
          updateBoxVisibility();
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

  // ===== GALERIE-LOGIN MOBIL & DESKTOP =====
  function loginSubmitHandler(e) {
    e.preventDefault();
    const email = e.target.querySelector("input[type='email']").value.trim();
    const code = e.target.querySelector("input[type='text']").value.trim();
    const loginMessage = e.target.querySelector(".loginMessage");
    if (!email || !code) return;

    fetch("https://gsg-proxy.vercel.app/api/proxy", {
      method: "POST",
      body: new URLSearchParams({
        action: "login",
        email, code
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data.result === "success") {
          localStorage.setItem("loggedIn", "true");
          localStorage.setItem("subscriberName", data.name || "");
          loginMessage.textContent = "Erfolgreich eingeloggt.";
          loginMessage.style.color = "green";
          updateBoxVisibility();
        } else {
          loginMessage.textContent = "Login fehlgeschlagen. Bitte prüfe deine Angaben.";
          loginMessage.style.color = "red";
        }
      })
      .catch(error => {
        loginMessage.textContent = "Ein Fehler ist aufgetreten.";
        loginMessage.style.color = "red";
        console.error("Login-Fehler:", error);
      });
  }
  loginBoxDesktop?.querySelector("form")?.addEventListener("submit", loginSubmitHandler);
  loginBoxMobile?.querySelector("form")?.addEventListener("submit", loginSubmitHandler);

  // ===== KONTAKTFORMULAR EINKLAPPBAR =====
  const kontaktBox = document.getElementById("kontakt");
  if (kontaktBox) {
    kontaktBox.classList.add("einklappbar");
    const headline = kontaktBox.querySelector("h2");
    headline.classList.add("toggle-headline");
    const icon = document.createElement("span");
    icon.className = "icon-toggle";
    icon.innerHTML = "&#9660;";
    headline.prepend(icon);

    let offen = false;
    function toggleBox() {
      offen = !offen;
      kontaktBox.classList.toggle("open", offen);
      icon.innerHTML = offen ? "&#9650;" : "&#9660;";
      kontaktBox.querySelector("form").style.display = offen ? "" : "none";
    }
    headline.addEventListener("click", toggleBox);
    // Anfangszustand: zugeklappt
    kontaktBox.querySelector("form").style.display = "none";
  }

  // ===== KONTAKTFORMULAR ABSENDEN =====
  const kontaktForm = document.getElementById("kontakt-form");
  kontaktForm?.addEventListener("submit", async function (e) {
    e.preventDefault();
    const name = kontaktForm.elements["name"].value.trim();
    const email = kontaktForm.elements["email"].value.trim();
    const message = kontaktForm.elements["message"].value.trim();
    try {
      const res = await fetch("https://gsg-proxy.vercel.app/api/proxy", {
        method: "POST",
        body: new URLSearchParams({ name, email, message })
      });
      const text = await res.text();
      alert(text === "Erfolg" ? "Nachricht erfolgreich gesendet!" : "Unbekannte Antwort.");
      kontaktForm.reset();
    } catch (error) {
      alert("Fehler beim Absenden. Bitte versuche es später.");
      console.error(error);
    }
  });

  // ===== GALERIE-SLIDESHOW =====
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
    if (galleryImage) galleryImage.src = images[currentIndex];
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
