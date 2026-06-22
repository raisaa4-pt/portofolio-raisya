/* ===================================================================
   Raisya Eka Putri — Portfolio
   Vanilla JavaScript — no frameworks, no build step required
   =================================================================== */

(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -----------------------------------------------------------
     Footer year
  ----------------------------------------------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -----------------------------------------------------------
     Mobile menu toggle
  ----------------------------------------------------------- */
  var menuBtn = document.getElementById("menu-btn");
  var mobileMenu = document.getElementById("mobile-menu");
  var iconMenu = document.getElementById("icon-menu");
  var iconClose = document.getElementById("icon-close");

  function closeMobileMenu() {
    mobileMenu.classList.add("hidden");
    iconMenu.classList.remove("hidden");
    iconClose.classList.add("hidden");
    menuBtn.setAttribute("aria-expanded", "false");
  }

  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      var isOpen = !mobileMenu.classList.contains("hidden");
      if (isOpen) {
        closeMobileMenu();
      } else {
        mobileMenu.classList.remove("hidden");
        iconMenu.classList.add("hidden");
        iconClose.classList.remove("hidden");
        menuBtn.setAttribute("aria-expanded", "true");
      }
    });
  }

  document.querySelectorAll("[data-nav]").forEach(function (link) {
    link.addEventListener("click", closeMobileMenu);
  });

  /* -----------------------------------------------------------
     Navbar background on scroll + back-to-top visibility
  ----------------------------------------------------------- */
  var navbar = document.getElementById("navbar");
  var backToTop = document.getElementById("back-to-top");

  function onScroll() {
    var scrolled = window.scrollY > 24;
    navbar.classList.toggle("scrolled", scrolled);

    if (window.scrollY > 480) {
      backToTop.classList.remove("opacity-0", "translate-y-3", "pointer-events-none");
    } else {
      backToTop.classList.add("opacity-0", "translate-y-3", "pointer-events-none");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });

  /* -----------------------------------------------------------
     Scroll-spy: highlight active nav link
  ----------------------------------------------------------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll("[data-nav]"));

  function setActiveLink(id) {
    navLinks.forEach(function (link) {
      var match = link.getAttribute("href") === "#" + id;
      link.classList.toggle("active", match);
    });
  }

  if ("IntersectionObserver" in window && sections.length) {
    var spyObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActiveLink(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    sections.forEach(function (sec) { spyObserver.observe(sec); });
  }

  /* -----------------------------------------------------------
     Scroll reveal animations
  ----------------------------------------------------------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));

  revealEls.forEach(function (el) {
    var delay = el.getAttribute("data-reveal-delay");
    if (delay) el.style.setProperty("--reveal-delay", delay + "ms");
  });

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* -----------------------------------------------------------
     Language proficiency bars — fill on view
  ----------------------------------------------------------- */
  var langBars = Array.prototype.slice.call(document.querySelectorAll(".lang-bar"));

  function fillBar(bar) {
    var pct = bar.getAttribute("data-percent") || "0";
    var fill = bar.querySelector(".bar-fill");
    if (fill) fill.style.width = pct + "%";
  }

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    langBars.forEach(fillBar);
  } else {
    var barObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            fillBar(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    langBars.forEach(function (bar) { barObserver.observe(bar); });
  }

  /* -----------------------------------------------------------
     Hero role typewriter
  ----------------------------------------------------------- */
  var roleEl = document.getElementById("role-typer");
  var roles = [
    "Cyber Security Enthusiast",
    "IT Support & Digital Forensics",
    "Full-Stack Developer",
    "Quality Assurance"
  ];

  function typeRoles() {
    var roleIndex = 0;
    var charIndex = 0;
    var deleting = false;

    function tick() {
      var current = roles[roleIndex];

      if (!deleting) {
        charIndex++;
        roleEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = false;
          setTimeout(function () { deleting = true; tick(); }, 1800);
          return;
        }
        setTimeout(tick, 55);
      } else {
        charIndex--;
        roleEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          setTimeout(tick, 400);
          return;
        }
        setTimeout(tick, 30);
      }
    }
    tick();
  }

  if (roleEl) {
    if (prefersReducedMotion) {
      roleEl.textContent = roles[0];
    } else {
      typeRoles();
    }
  }

  /* -----------------------------------------------------------
     Hero terminal — simulated CLI session
  ----------------------------------------------------------- */
  var terminalBody = document.getElementById("terminal-body");
  var terminalScript = [
    { type: "prompt", text: "whoami" },
    { type: "out", text: "Raisya Eka Putri — Informatics Student" },
    { type: "prompt", text: "cat fokus.txt" },
    { type: "out", text: "Cyber Security · Digital Forensics · Full-Stack Dev" },
    { type: "prompt", text: "ls top-skills/" },
    { type: "out", text: "Analytical Thinking   Communication   Teamwork" },
    { type: "prompt", text: "echo $STATUS" },
    { type: "out", text: "Open to internship opportunities", cursor: true }
  ];

  function renderTerminalStatic() {
    terminalScript.forEach(function (line) {
      var div = document.createElement("div");
      div.className = "line";
      div.style.opacity = "1";
      if (line.type === "prompt") {
        div.innerHTML = '<span class="prompt">raisya@portfolio:~$ </span>' + line.text;
      } else {
        div.innerHTML = '<span class="out">' + line.text + (line.cursor ? '<span class="type-cursor">_</span>' : "") + "</span>";
      }
      terminalBody.appendChild(div);
    });
  }

  function typeTerminal() {
    var i = 0;

    function nextLine() {
      if (i >= terminalScript.length) return;
      var line = terminalScript[i];
      var div = document.createElement("div");
      div.className = "line";
      div.style.opacity = "1";

      var textSpan = document.createElement("span");

      if (line.type === "prompt") {
        var promptSpan = document.createElement("span");
        promptSpan.className = "prompt";
        promptSpan.textContent = "raisya@portfolio:~$ ";
        div.appendChild(promptSpan);
        div.appendChild(textSpan);
      } else {
        var outSpan = document.createElement("span");
        outSpan.className = "out";
        outSpan.appendChild(textSpan);
        div.appendChild(outSpan);
      }

      terminalBody.appendChild(div);

      var charIndex = 0;
      var speed = line.type === "prompt" ? 38 : 14;

      function typeChar() {
        charIndex++;
        textSpan.textContent = line.text.slice(0, charIndex);
        if (charIndex < line.text.length) {
          setTimeout(typeChar, speed);
        } else {
          if (line.cursor) {
            var cursor = document.createElement("span");
            cursor.className = "type-cursor";
            cursor.textContent = "_";
            div.appendChild(cursor);
          }
          i++;
          setTimeout(nextLine, line.type === "prompt" ? 180 : 420);
        }
      }
      typeChar();
    }
    nextLine();
  }

  if (terminalBody) {
    if (prefersReducedMotion) {
      renderTerminalStatic();
    } else {
      typeTerminal();
    }
  }

  /* -----------------------------------------------------------
     Copy-to-clipboard for contact cards
  ----------------------------------------------------------- */
  var toast = document.getElementById("toast");
  var toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.remove("opacity-0", "translate-y-2", "pointer-events-none");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.add("opacity-0", "translate-y-2", "pointer-events-none");
    }, 2200);
  }

  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var value = btn.getAttribute("data-copy");
      var label = btn.getAttribute("data-copy-label") || "Teks";

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(function () {
          showToast(label + " disalin ke clipboard");
        }).catch(function () {
          showToast("Gagal menyalin, silakan salin manual: " + value);
        });
      } else {
        showToast(label + ": " + value);
      }
    });
  });

  const galleries = {

  puma: [
    "images/puma1.jpg",
    "images/puma2.jpg",
    "images/puma3.jpg"
  ],

  compsphere: [
    "images/compsphere1.jpg",
    "images/compsphere2.jpg",
    "images/compsphere3.jpg"
  ],

  sospro: [
    "images/sospro1.jpg",
    "images/sospro2.jpg"
  ],

   temualumni: [
    "images/temualumni1.jpg",
    "images/temualumni2.jpg"
  ],

  informaticsconnect: [
    "images/informaticsconnect1.jpg",
    "images/informaticsconnect2.jpg",
    "images/informaticsconnect3.jpg" ,  
    "images/informaticsconnect4.jpg"
  ],

  guestlecture: [
    "images/guestlecture1.jpg",
    "images/guestlecture2.jpg",
    "images/guestlecture3.jpg"
  ],

  unitics: [
    "images/unitics1.jpg",
    "images/unitics2.jpg"
  ],

  brainstormics: [
    "images/brainstormics1.jpg",
    "images/brainstormics2.jpg"
  ]
  



};
let currentGallery = [];
let currentIndex = 0;

const modal = document.getElementById("gallery-modal");
const image = document.getElementById("gallery-image");

const closeBtn = document.getElementById("close-gallery");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

function updateGalleryImage() {
  image.src = currentGallery[currentIndex];
}

document.querySelectorAll(".view-gallery-btn")
.forEach(btn => {

  btn.addEventListener("click", () => {

    const galleryName = btn.dataset.gallery;

    currentGallery = galleries[galleryName];

    currentIndex = 0;

    updateGalleryImage();

    modal.classList.remove("hidden");

  });

});

nextBtn.addEventListener("click", () => {

  currentIndex++;

  if(currentIndex >= currentGallery.length){
    currentIndex = 0;
  }

  updateGalleryImage();

});

prevBtn.addEventListener("click", () => {

  currentIndex--;

  if(currentIndex < 0){
    currentIndex = currentGallery.length - 1;
  }

  updateGalleryImage();

});

closeBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

document.addEventListener("keydown", (e) => {

  if(modal.classList.contains("hidden")) return;

  if(e.key === "ArrowRight"){
      nextBtn.click();
  }

  if(e.key === "ArrowLeft"){
      prevBtn.click();
  }

  if(e.key === "Escape"){
      closeBtn.click();
  }

});

document.querySelectorAll(".volunteer-thumbs img")
.forEach(img => {

    img.addEventListener("click", () => {

        image.src = img.src;

        modal.classList.remove("hidden");

    });

});


const certModal =
document.getElementById("certificate-modal");

const certImage =
document.getElementById("certificate-modal-image");

const certClose =
document.getElementById("close-certificate");

window.openCertificate = function(src){

    certImage.src = src;

    certModal.classList.remove("hidden");
}

certClose.addEventListener("click", () => {
    certModal.classList.add("hidden");
});

})();