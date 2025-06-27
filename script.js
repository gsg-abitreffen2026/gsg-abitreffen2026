// === Hamburger-Menü ===
document.addEventListener("DOMContentLoaded", () => {
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("nav");

if (menuToggle && nav) {
menuToggle.addEventListener("click", () => {
nav.classList.toggle("active");
});
}
});

document.addEventListener("DOMContentLoaded", () => {
  const shareButton = document.getElementById("shareButton");
  if (shareButton && navigator.share) {
    shareButton.addEventListener("click", () => {
      navigator.share({
        title: "Abi-Treffen 2026",
        text: "Sei dabei beim 20-jährigen Abiturjubiläum!",
        url: window.location.href
      }).catch(err => {
        console.error("Teilen abgebrochen oder nicht möglich:", err);
      });
    });
  } else if (shareButton) {
    // Fallback
    shareButton.style.display = "none"; // verstecken, wenn nicht unterstützt
  }
});

// === Countdown ===
const countdownDate = new Date("2026-07-01T00:00:00").getTime();
const countdownEl = document.getElementById("countdown");

setInterval(() => {
const now = new Date().getTime();
const diff = countdownDate - now;
if (diff < 0) {
countdownEl.textContent = "Es ist so weit!";
return;
}
const days = Math.floor(diff / (1000 * 60 * 60 * 24));
countdownEl.textContent = `${days} Tage noch!`;
}, 1000 * 60 * 60);

// === Newsletter-Formular ===
document.addEventListener("DOMContentLoaded", function () {
const newsletterForm = document.getElementById("newsletter-form");

newsletterForm?.addEventListener("submit", function (e) {
e.preventDefault();

const email = document.getElementById("newsletter-email").value.trim();
const vorname = document.getElementById("newsletter-vorname").value.trim();
const nachname = document.getElementById("newsletter-nachname").value.trim();
const honey = document.getElementById("newsletter-honey").value;

if (honey) return;

fetch("https://script.google.com/macros/s/AKfycbz3f_Yaj_lp-GJkrgK5Kit9JG5cccnhAkcSV-oxGrTHAUFyORTfY8MiqYdE_DJwfu7d/exec", {
method: "POST",
body: new URLSearchParams({
email: email,
vorname: vorname,
nachname: nachname,
_honey: honey
})
})
.then(response => response.json())
.then(data => {
if (data.result === "success") {
localStorage.setItem("newsletterVorname", vorname);
alert(`Danke für deine Anmeldung, ${vorname || "Freund/in"}!`);
newsletterForm.reset();
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

// === Galerie-Login & Navigation ===
document.addEventListener("DOMContentLoaded", () => {
const greetingName = localStorage.getItem("subscriberName");
if (greetingName) {
const headline = document.querySelector("h1");
if (headline) {
headline.textContent = `Willkommen zurück, ${greetingName}!`;
}
}

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const galerieSection = document.getElementById("galerie");

if (localStorage.getItem("loggedIn") === "true") {
galerieSection.style.display = "block";
} else {
galerieSection.style.display = "none";
}

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
email: email,
code: code
})
});

const data = await res.json();
if (data.result === "success") {
localStorage.setItem("loggedIn", "true");
loginMessage.textContent = "Erfolgreich eingeloggt.";
loginMessage.style.color = "green";
galerieSection.style.display = "block";
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

prevBtn?.addEventListener("click", () => {
currentIndex = (currentIndex - 1 + images.length) % images.length;
updateImage();
});

nextBtn?.addEventListener("click", () => {
currentIndex = (currentIndex + 1) % images.length;
updateImage();
});

galleryImage.onerror = () => {
console.error(`Bild nicht gefunden: ${galleryImage.src}`);
};
});
