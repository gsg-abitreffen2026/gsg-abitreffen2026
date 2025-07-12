document.addEventListener("DOMContentLoaded", () => {
  // === Hamburger & Mobile Menü ===
  const burgerButton = document.getElementById("burgerButton");
  const mobileMenu = document.getElementById("mobileMenu");
  burgerButton?.addEventListener("click", () => {
    mobileMenu.style.display = mobileMenu.style.display === "block" ? "none" : "block";
  });
  // Menü initial immer zu (mobil)
  if (mobileMenu) mobileMenu.style.display = "none";

  // === Share Buttons (weißes Icon auf Desktop/Mobil) ===
  const shareButtonDesktop = document.getElementById("shareButton");
  const shareButtonMobile = document.getElementById("shareButtonMobile");
  [shareButtonDesktop, shareButtonMobile].forEach(btn => {
    if (btn && navigator.share) {
      btn.addEventListener("click", e => {
        e.preventDefault();
        navigator.share({
          title: "Abi-Treffen 2026",
          text: "Sei dabei beim 20-jährigen Abiturjubiläum!",
          url: window.location.href
        }).catch(() => {});
      });
    } else if (btn) {
      btn.style.display = "none";
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

  // === Boxen-Logik (Newsletter → Galerie-Login → Galerie) ===
  const newsletterBox = document.getElementById("newsletter");
  const galerieLoginBox = document.getElementById("galerie-login-box");
  const galerieSection = document.getElementById("galerie");

  function showNewsletter() {
    newsletterBox?.classList.remove("hidden");
    galerieLoginBox?.classList.add("hidden");
    galerieSection?.classList.add("hidden");
  }
  function showGalerieLogin() {
    newsletterBox?.classList.add("hidden");
    galerieLoginBox?.classList.remove("hidden");
    galerieSection?.classList.add("hidden");
  }
  function showGalerie() {
    newsletterBox?.classList.add("hidden");
    galerieLoginBox?.classList.add("hidden");
    galerieSection?.classList.remove("hidden");
  }

  // Initialzustand bestimmen (localStorage)
  if (!localStorage.getItem("newsletterVorname")) {
    showNewsletter();
  } else if (!localStorage.getItem("loggedIn")) {
    showGalerieLogin();
  } else {
    showGalerie();
  }

  // === Newsletter-Formular (Button gegen Doppelklick) ===
  const newsletterForm = document.getElementById("newsletter-form");
  const newsletterBtn = document.getElementById("newsletter-submit-btn");
  let btnLock = false;
  newsletterForm?.addEventListener("submit", function (e) {
    e.preventDefault();
    if (btnLock) return;
    btnLock = true;
    newsletterBtn.disabled = true;

    setTimeout(() => {
      btnLock = false;
      newsletterBtn.disabled = false;
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
        showGalerieLogin();
        alert(`Danke für deine Anmeldung, ${vorname || "Freund/in"}!`);
        newsletterForm.reset();
      } else if (data.result === "ignored") {
        // Spam-Schutz
      } else {
        alert("Fehler bei der Anmeldung. Bitte versuche es später.");
      }
    })
    .catch(() => {
      alert("Es ist ein Fehler aufgetreten.");
    });
  });

  // === Galerie-Login ===
  const loginForm = document.getElementById("loginForm");
  const loginMessage = document.getElementById("loginMessage");
  loginForm?.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const code = document.getElementById("loginCode").value.trim();
    if (!email || !code) return;

    fetch("https://gsg-proxy.vercel.app/api/proxy", {
      method: "POST",
      body: new URLSearchParams({
        action: "login",
        email,
        code
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.result === "success") {
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("subscriberName", data.name || "");
        loginMessage.textContent = "Erfolgreich eingeloggt.";
        loginMessage.style.color = "green";
        showGalerie();
      } else {
        loginMessage.textContent = "Login fehlgeschlagen. Bitte prüfe deine Angaben.";
        loginMessage.style.color = "red";
      }
    })
    .catch(() => {
      loginMessage.textContent = "Ein Fehler ist aufgetreten.";
      loginMessage.style.color = "red";
    });
  });

  // === Kontaktformular ===
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
    } catch {
      alert("Fehler beim Absenden. Bitte versuche es später.");
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

  // === Kontaktbox einklappbar ===
  const collapsible = document.querySelector('.collapsible');
  const collapsibleHeader = collapsible?.querySelector('.collapsible-header');
  collapsibleHeader?.addEventListener('click', () => {
    collapsible.classList.toggle('open');
  });
  // Optional: Kontaktbox bei Laden zugeklappt lassen
  collapsible.classList.remove('open');
});
