document.addEventListener("DOMContentLoaded", () => {
  // === Custom Menü-Icon: Drehanimation + Buchstaben ===
  const burgerButton = document.getElementById("burgerButton");
  const iconGroup = document.getElementById("iconGroup");
  const mText = document.getElementById("mText");
  const eText = document.getElementById("eText");
  const nText = document.getElementById("nText");
  const üText = document.getElementById("üText");
  const mobileMenu = document.getElementById("mobileMenu");

  let menuOpen = false;

  function setMenuIcon(open) {
    // Drehung (IM Uhrzeigersinn)
    iconGroup.setAttribute("transform", open ? "rotate(45,26,26)" : "rotate(0,26,26)");
    // Buchstaben drehen gegenläufig, damit sie lesbar bleiben
    mText.setAttribute("transform", open ? "rotate(-45,8,20)"  : "rotate(0,8,20)");
    eText.setAttribute("transform", open ? "rotate(-45,44,20)" : "rotate(0,44,20)");
    nText.setAttribute("transform", open ? "rotate(-45,44,44)" : "rotate(0,44,44)");
    üText.setAttribute("transform", open ? "rotate(-45,8,44)"  : "rotate(0,8,44)");
  }

  setMenuIcon(false);
  if (mobileMenu) mobileMenu.classList.remove("active");

  if (burgerButton && mobileMenu) {
    burgerButton.addEventListener("click", () => {
      menuOpen = !menuOpen;
      setMenuIcon(menuOpen);
      mobileMenu.classList.toggle("active", menuOpen);
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

  // === Galerie-Login/Newsletter Sichtbarkeit (mittig, mobil/Tablet) ===
  const newsletterBox = document.getElementById("newsletter");
  const galerieLoginMitte = document.getElementById("galerie-login-mitte");
  const galerieSection = document.getElementById("galerie");
  const loginFormMitte = document.getElementById("loginFormMitte");
  const loginMessageMitte = document.getElementById("loginMessageMitte");

  function updateMitteBoxen() {
    if (!localStorage.getItem("newsletterVorname")) {
      // Newsletter sichtbar, Galerie-Login (mittig) und Galerie versteckt
      newsletterBox?.classList.remove("hidden");
      galerieLoginMitte?.classList.add("hidden");
      galerieSection?.classList.add("hidden");
    } else if (!localStorage.getItem("loggedIn")) {
      // Newsletter erledigt, jetzt Galerie-Login zeigen
      newsletterBox?.classList.add("hidden");
      galerieLoginMitte?.classList.remove("hidden");
      galerieSection?.classList.add("hidden");
    } else {
      // Erfolgreich eingeloggt – Galerie zeigen
      newsletterBox?.classList.add("hidden");
      galerieLoginMitte?.classList.add("hidden");
      galerieSection?.classList.remove("hidden");
    }
  }
  updateMitteBoxen();

  // === Newsletter-Formular ===
  const newsletterForm = document.getElementById("newsletter-form");
  let newsletterLocked = false;

  newsletterForm?.addEventListener("submit", function (e) {
    e.preventDefault();
    if (newsletterLocked) return; // Button blocken!
    newsletterLocked = true;
    newsletterForm.querySelector("button").disabled = true;
    setTimeout(() => {
      newsletterLocked = false;
      newsletterForm.querySelector("button").disabled = false;
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
          updateMitteBoxen();
        } else if (data.result === "ignored") {
          // Spam-Schutz
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

  // === Galerie-Login (mittig) ===
  loginFormMitte?.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmailMitte").value.trim();
    const code = document.getElementById("loginCodeMitte").value.trim();
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
          loginMessageMitte.textContent = "Erfolgreich eingeloggt.";
          loginMessageMitte.style.color = "green";
          updateMitteBoxen();
        } else {
          loginMessageMitte.textContent = "Login fehlgeschlagen. Bitte prüfe deine Angaben.";
          loginMessageMitte.style.color = "red";
        }
      })
      .catch(error => {
        loginMessageMitte.textContent = "Ein Fehler ist aufgetreten.";
        loginMessageMitte.style.color = "red";
      });
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

  // === Kontaktbox – Einklappen ===
  const kontaktHeader = document.querySelector(".kontakt-header");
  const kontaktContent = document.querySelector(".kontakt-content");
  const arrow = document.querySelector(".kontakt-header .arrow");
  if (kontaktHeader && kontaktContent && arrow) {
    kontaktHeader.addEventListener("click", () => {
      const collapsed = kontaktContent.classList.toggle("hidden");
      kontaktHeader.classList.toggle("collapsed", collapsed);
      arrow.innerHTML = collapsed ? "&#9654;" : "&#9660;";
    });
    // Initial: Kontakt-Box zu
    kontaktContent.classList.add("hidden");
    kontaktHeader.classList.add("collapsed");
    arrow.innerHTML = "&#9654;";
  }
});
