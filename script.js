document.addEventListener("DOMContentLoaded", () => {
  // ===== Kontakt-Collapsible =====
  document.querySelectorAll('.kontakt-collapsible').forEach(section => {
    const header = section.querySelector('.kontakt-header');
    header.addEventListener('click', () => {
      section.classList.toggle('collapsed');
    });
  });

  // ===== Menü-Button MENÜ/X =====
  const burgerBtn = document.getElementById("burgerButton");
  const mobileMenu = document.getElementById("mobileMenu");
  let menuOpen = false;
  if (burgerBtn && mobileMenu) {
    burgerBtn.addEventListener("click", () => {
      menuOpen = !menuOpen;
      burgerBtn.classList.toggle("open", menuOpen);
      mobileMenu.classList.toggle("open", menuOpen);
    });
  }

  // ===== Share Button (Desktop + Mobil) =====
  const shareButtonDesktop = document.getElementById("shareButton");
  const shareButtonMobile = document.getElementById("shareButtonMobile");
  [shareButtonDesktop, shareButtonMobile].forEach(button => {
    if (button && navigator.share) {
      button.addEventListener("click", (e) => {
        e.preventDefault();
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

  // ===== Countdown =====
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

  // ===== Login/Newsletter Status =====
  const newsletterBox = document.getElementById("newsletter");
  const galerieSection = document.getElementById("galerie");
  const galerieLoginBox = document.getElementById("galerie-login-box");
  const galerieLoginMitte = document.getElementById("galerie-login-mitte");
  function showOnlyNewsletter() {
    newsletterBox?.classList.remove("hidden");
    galerieLoginBox?.classList.add("hidden");
    galerieLoginMitte?.classList.add("hidden");
    galerieSection?.classList.add("hidden");
  }
  function showOnlyGalerieLogin() {
    newsletterBox?.classList.add("hidden");
    galerieLoginBox?.classList.remove("hidden");
    galerieLoginMitte?.classList.remove("hidden");
    galerieSection?.classList.add("hidden");
  }
  function showGalerie() {
    newsletterBox?.classList.add("hidden");
    galerieLoginBox?.classList.add("hidden");
    galerieLoginMitte?.classList.add("hidden");
    galerieSection?.classList.remove("hidden");
  }
  function checkLoginNewsletterStatus() {
    if (localStorage.getItem("loggedIn") === "true") {
      showGalerie();
    } else if (localStorage.getItem("newsletterVorname")) {
      showOnlyGalerieLogin();
    } else {
      showOnlyNewsletter();
    }
  }
  checkLoginNewsletterStatus();
  window.addEventListener("resize", checkLoginNewsletterStatus);

  // ===== Newsletter-Formular =====
  const newsletterForm = document.getElementById("newsletter-form");
  if (newsletterForm) {
    let lock = false;
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (lock) return;
      lock = true;
      const submitBtn = newsletterForm.querySelector("button[type='submit']");
      if (submitBtn) submitBtn.disabled = true;
      setTimeout(() => {
        lock = false;
        if (submitBtn) submitBtn.disabled = false;
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
        try { return JSON.parse(text); }
        catch (err) {
          alert("Fehlerhafte Serverantwort!");
          throw err;
        }
      })
      .then(data => {
        if (data.result === "success") {
          localStorage.setItem("newsletterVorname", vorname);
          alert(`Danke für deine Anmeldung, ${vorname || "Freund/in"}!`);
          newsletterForm.reset();
          checkLoginNewsletterStatus();
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
  }

  // ===== Galerie-Login =====
  function setupLoginForm(formId, emailId, codeId, msgId) {
    const form = document.getElementById(formId);
    if (!form) return;
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      const email = document.getElementById(emailId).value.trim();
      const code = document.getElementById(codeId).value.trim();
      const msg = document.getElementById(msgId);
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
          if (msg) {
            msg.textContent = "Erfolgreich eingeloggt.";
            msg.style.color = "green";
          }
          checkLoginNewsletterStatus();
        } else {
          if (msg) {
            msg.textContent = "Login fehlgeschlagen. Bitte prüfe deine Angaben.";
            msg.style.color = "red";
          }
        }
      })
      .catch(error => {
        if (msg) {
          msg.textContent = "Ein Fehler ist aufgetreten.";
          msg.style.color = "red";
        }
        console.error("Login-Fehler:", error);
      });
    });
  }
  setupLoginForm("loginForm", "loginEmail", "loginCode", "loginMessage");
  setupLoginForm("loginFormMitte", "loginEmailMitte", "loginCodeMitte", "loginMessageMitte");

  // ===== Kontaktformular =====
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

  // ===== Galerie-Slideshow =====
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
