/* ============================================================
   TANDALA VENUES — GLOBAL SCRIPT
   Handles: navigation, scroll reveal, counters, gallery lightbox,
   FAQ accordion, form validation, botanical decoration, misc UI.
   ============================================================ */
(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("DOMContentLoaded", function () {
    initYear();
    initHeader();
    initMobileNav();
    initActiveNav();
    initSmoothAnchors();
    initBotanicalDecoration();
    initRevealAnimations();
    initCounters();
    initFaqAccordion();
    initGallery();
    initContactForm();
    initNewsletterForm();
    initScrollTop();
    initFloatingDirections();
  });

  /* ---------- Footer year ---------- */
  function initYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ---------- Sticky header ---------- */
  function initHeader() {
    var header = document.getElementById("siteHeader");
    if (!header) return;
    var threshold = 40;

    function update() {
      if (window.scrollY > threshold) {
        header.classList.add("is-solid");
      } else {
        header.classList.remove("is-solid");
      }
    }
    update();
    window.addEventListener("scroll", throttle(update, 60), { passive: true });
  }

  /* ---------- Mobile navigation ---------- */
  function initMobileNav() {
    var toggle = document.getElementById("navToggle");
    var panel = document.getElementById("mobileNav");
    var menu = panel ? panel.querySelector(".mobile-nav-panel") : null;
    if (!toggle || !panel) return;
    var focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    var lastFocused = null;

    function getFocusableItems() {
      return Array.prototype.slice.call(panel.querySelectorAll(focusableSelector)).filter(function (item) {
        return item.offsetParent !== null;
      });
    }

    function close(restoreFocus) {
      toggle.classList.remove("is-open");
      panel.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
      panel.setAttribute("aria-hidden", "true");
      document.body.classList.remove("nav-locked");
      if (restoreFocus && lastFocused && typeof lastFocused.focus === "function") {
        lastFocused.focus();
      }
    }
    function open() {
      lastFocused = document.activeElement;
      toggle.classList.add("is-open");
      panel.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close menu");
      panel.setAttribute("aria-hidden", "false");
      document.body.classList.add("nav-locked");
      window.setTimeout(function () {
        var firstItem = getFocusableItems()[0];
        if (firstItem) firstItem.focus();
      }, prefersReducedMotion ? 0 : 120);
    }

    toggle.addEventListener("click", function () {
      var isOpen = panel.classList.contains("is-open");
      isOpen ? close(false) : open();
    });

    panel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { close(false); });
    });

    panel.addEventListener("click", function (e) {
      if (e.target === panel) close(false);
    });

    document.addEventListener("keydown", function (e) {
      if (!panel.classList.contains("is-open")) return;
      if (e.key === "Escape") {
        close(true);
        return;
      }
      if (e.key !== "Tab" || !menu) return;
      var items = getFocusableItems();
      if (!items.length) return;
      var first = items[0];
      var last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    window.addEventListener("resize", throttle(function () {
      if (window.innerWidth > 1024 && panel.classList.contains("is-open")) close(false);
    }, 120));
  }

  /* ---------- Active nav link highlighting ---------- */
  function initActiveNav() {
    var path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-menu a, .mobile-nav a").forEach(function (link) {
      var href = link.getAttribute("href");
      if (!href) return;
      var linkFile = href.split("/").pop();
      if (linkFile === path || (path === "" && linkFile === "index.html")) {
        link.setAttribute("aria-current", "page");
      }
    });
  }

  /* ---------- Smooth anchor scrolling (closes mobile nav) ---------- */
  function initSmoothAnchors() {
    document.querySelectorAll('a[href*="#"]').forEach(function (link) {
      link.addEventListener("click", function (e) {
        var url = new URL(link.href, window.location.href);
        var samePage = url.pathname === window.location.pathname || url.pathname.endsWith(window.location.pathname.split("/").pop());
        if (!url.hash || !samePage) return;
        var target = document.querySelector(url.hash);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      });
    });
  }

  /* ---------- Botanical decoration injection ---------- */
  var MOTIFS = [
    // thin line-art leaf
    '<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M60 10C85 30 100 55 90 90C70 100 40 100 25 80C10 60 20 30 60 10Z" stroke="currentColor" stroke-width="1.1"/><path d="M60 10C55 40 55 70 40 100" stroke="currentColor" stroke-width="1"/><path d="M60 32C50 40 45 50 40 58" stroke="currentColor" stroke-width="0.8"/><path d="M62 55C54 60 48 68 44 75" stroke="currentColor" stroke-width="0.8"/></svg>',
    // small blossom
    '<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="7" stroke="currentColor" stroke-width="1"/><path d="M50 43C46 28 40 20 30 14C36 26 38 34 43 45" stroke="currentColor" stroke-width="1"/><path d="M57 45C64 32 72 26 84 22C74 32 70 38 62 47" stroke="currentColor" stroke-width="1"/><path d="M45 55C32 60 24 66 18 78C30 70 38 66 47 60" stroke="currentColor" stroke-width="1"/><path d="M55 56C64 66 72 70 86 72C74 64 68 60 60 54" stroke="currentColor" stroke-width="1"/><path d="M50 57C50 70 48 80 44 92" stroke="currentColor" stroke-width="1"/></svg>',
    // vine curl
    '<svg viewBox="0 0 160 90" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 70C40 20 80 100 116 40C130 18 140 16 156 22" stroke="currentColor" stroke-width="1"/><path d="M30 50C34 42 42 40 48 44" stroke="currentColor" stroke-width="0.8"/><path d="M70 60C74 50 84 48 90 54" stroke="currentColor" stroke-width="0.8"/><path d="M108 34C114 26 124 26 130 32" stroke="currentColor" stroke-width="0.8"/></svg>',
    // fern sprig
    '<svg viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M50 10C48 50 48 90 50 130" stroke="currentColor" stroke-width="1"/><path d="M50 25L28 12M50 25L72 12M50 45L24 34M50 45L76 34M50 65L26 56M50 65L74 56M50 85L28 78M50 85L72 78M50 105L30 100M50 105L70 100" stroke="currentColor" stroke-width="0.8"/></svg>'
  ];

  function initBotanicalDecoration() {
    var hosts = document.querySelectorAll("[data-botanical]");
    hosts.forEach(function (host) {
      var count = parseInt(host.getAttribute("data-botanical"), 10) || 3;
      var layer = document.createElement("div");
      layer.className = "botanical-layer";
      layer.setAttribute("aria-hidden", "true");
      for (var i = 0; i < count; i++) {
        var wrap = document.createElement("span");
        var motif = MOTIFS[(i + host.dataset.seed ? parseInt(host.dataset.seed, 10) : 0 + i) % MOTIFS.length];
        motif = MOTIFS[Math.floor(pseudoRandom(host, i) * MOTIFS.length)];
        wrap.className = "botanical-decor drift";
        wrap.innerHTML = motif;
        var size = 90 + Math.floor(pseudoRandom(host, i + 10) * 140);
        var top = Math.floor(pseudoRandom(host, i + 20) * 88);
        var left = Math.floor(pseudoRandom(host, i + 30) * 92);
        var rot = Math.floor(pseudoRandom(host, i + 40) * 50) - 25;
        wrap.style.width = size + "px";
        wrap.style.top = top + "%";
        wrap.style.left = left + "%";
        wrap.style.setProperty("--rot", rot + "deg");
        wrap.style.transform = "rotate(" + rot + "deg)";
        wrap.style.animationDelay = (i * 1.4) + "s";
        layer.appendChild(wrap);
      }
      host.insertBefore(layer, host.firstChild);
    });
  }

  function pseudoRandom(el, seedExtra) {
    var str = (el.className || "") + (el.id || "") + seedExtra;
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return (Math.abs(Math.sin(hash)) % 1);
  }

  /* ---------- Scroll reveal (Intersection Observer, 35% threshold) ---------- */
  function initRevealAnimations() {
    var targets = document.querySelectorAll(".reveal, .img-reveal");
    if (!("IntersectionObserver" in window) || prefersReducedMotion) {
      targets.forEach(function (t) { t.classList.add("is-visible"); });
      return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35, rootMargin: "0px 0px -5% 0px" }
    );
    targets.forEach(function (t) { observer.observe(t); });
  }

  /* ---------- Animated statistic counters ---------- */
  function initCounters() {
    var counters = document.querySelectorAll("[data-count-to]");
    if (!counters.length) return;

    function animateCounter(el) {
      var target = parseFloat(el.getAttribute("data-count-to"));
      var duration = 1800;
      var startTime = null;

      if (prefersReducedMotion) {
        el.textContent = target;
        return;
      }

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var value = Math.floor(eased * target);
        el.textContent = value;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target;
        }
      }
      requestAnimationFrame(step);
    }

    var section = document.querySelector("[data-counter-section]");
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            counters.forEach(animateCounter);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.35 }
    );
    if (section) observer.observe(section);
    else counters.forEach(animateCounter);
  }

  /* ---------- FAQ accordion ---------- */
  function initFaqAccordion() {
    var items = document.querySelectorAll(".faq-item");
    items.forEach(function (item) {
      var question = item.querySelector(".faq-question");
      var answer = item.querySelector(".faq-answer");
      if (!question || !answer) return;

      question.addEventListener("click", function () {
        var isOpen = item.classList.contains("is-open");
        items.forEach(function (other) {
          other.classList.remove("is-open");
          other.querySelector(".faq-question").setAttribute("aria-expanded", "false");
          other.querySelector(".faq-answer").style.height = "0px";
        });
        if (!isOpen) {
          item.classList.add("is-open");
          question.setAttribute("aria-expanded", "true");
          answer.style.height = answer.scrollHeight + "px";
        }
      });
    });

    window.addEventListener("resize", throttle(function () {
      var open = document.querySelector(".faq-item.is-open .faq-answer");
      if (open) open.style.height = open.scrollHeight + "px";
    }, 150));
  }

  /* ---------- Gallery filter + lightbox ---------- */
  function initGallery() {
    var filterBtns = document.querySelectorAll(".filter-btn");
    var items = document.querySelectorAll(".gallery-item");
    if (filterBtns.length) {
      filterBtns.forEach(function (btn) {
        btn.addEventListener("click", function () {
          filterBtns.forEach(function (b) { b.classList.remove("is-active"); b.setAttribute("aria-pressed", "false"); });
          btn.classList.add("is-active");
          btn.setAttribute("aria-pressed", "true");
          var filter = btn.getAttribute("data-filter");
          items.forEach(function (item) {
            var cat = item.getAttribute("data-category");
            var show = filter === "all" || cat === filter;
            item.style.display = show ? "" : "none";
          });
        });
      });
    }

    if (!items.length) return;
    var lightbox = document.getElementById("lightbox");
    if (!lightbox) return;
    var lightboxArt = lightbox.querySelector(".lightbox-inner .art-panel");
    var lightboxCaption = lightbox.querySelector(".lightbox-caption");
    var closeBtn = lightbox.querySelector(".lightbox-close");
    var prevBtn = lightbox.querySelector(".lightbox-prev");
    var nextBtn = lightbox.querySelector(".lightbox-next");
    var currentIndex = 0;
    var itemList = Array.prototype.slice.call(items);

    function openLightbox(index) {
      currentIndex = index;
      renderLightbox();
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("nav-locked");
      closeBtn.focus();
    }
    function closeLightbox() {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.classList.remove("nav-locked");
    }
    function renderLightbox() {
      var item = itemList[currentIndex];
      var title = item.getAttribute("data-title") || "Tandala Venues";
      var tone = item.querySelector(".art-panel").className.match(/tone-\w+/);
      lightboxArt.className = "art-panel " + (tone ? tone[0] : "");
      lightboxCaption.textContent = title;
    }
    function next() { currentIndex = (currentIndex + 1) % itemList.length; renderLightbox(); }
    function prev() { currentIndex = (currentIndex - 1 + itemList.length) % itemList.length; renderLightbox(); }

    itemList.forEach(function (item, index) {
      item.setAttribute("tabindex", "0");
      item.setAttribute("role", "button");
      item.addEventListener("click", function () { openLightbox(index); });
      item.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLightbox(index); }
      });
    });

    closeBtn.addEventListener("click", closeLightbox);
    nextBtn.addEventListener("click", next);
    prevBtn.addEventListener("click", prev);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    });
  }

  /* ---------- Contact form validation ---------- */
  function initContactForm() {
    var form = document.getElementById("contactForm");
    if (!form) return;
    var successPanel = document.getElementById("formSuccess");

    var validators = {
      name: function (v) { return v.trim().length >= 2; },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); },
      phone: function (v) { return /^[0-9+()\s-]{7,}$/.test(v.trim()); },
      eventType: function (v) { return v.trim().length > 0; },
      preferredDate: function (v) { return v.trim().length > 0; },
      guestCount: function (v) { return v.trim().length > 0 && parseInt(v, 10) > 0; },
      message: function (v) { return v.trim().length >= 10; }
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;
      var data = {};

      Object.keys(validators).forEach(function (name) {
        var field = form.elements[name];
        if (!field) return;
        var group = field.closest(".form-group");
        data[name] = field.value;
        if (!validators[name](field.value)) {
          valid = false;
          if (group) group.classList.add("has-error");
        } else if (group) {
          group.classList.remove("has-error");
        }
      });

      if (!valid) {
        var firstError = form.querySelector(".has-error .form-control");
        if (firstError) firstError.focus();
        return;
      }

      var subject = "Enquiry: " + data.eventType + " — " + data.name;
      var body =
        "Name: " + data.name + "\n" +
        "Email: " + data.email + "\n" +
        "Phone: " + data.phone + "\n" +
        "Event Type: " + data.eventType + "\n" +
        "Preferred Date: " + data.preferredDate + "\n" +
        "Guest Count: " + data.guestCount + "\n\n" +
        "Message:\n" + data.message;

      var mailto = "mailto:tandalavenues@gmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);

      if (successPanel) {
        successPanel.classList.add("is-visible");
        successPanel.setAttribute("role", "status");
        successPanel.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "center" });
      }
      form.reset();
      window.setTimeout(function () { window.location.href = mailto; }, 900);
    });

    form.querySelectorAll(".form-control").forEach(function (field) {
      field.addEventListener("blur", function () {
        var validator = validators[field.name];
        var group = field.closest(".form-group");
        if (!validator || !group) return;
        if (validator(field.value)) group.classList.remove("has-error");
      });
    });
  }

  /* ---------- Newsletter form (footer) ---------- */
  function initNewsletterForm() {
    var form = document.getElementById("newsletterForm");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = form.querySelector("input[type='email']");
      var note = form.querySelector(".form-note");
      if (input && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
        if (note) note.textContent = "Thank you — you're on the list.";
        form.reset();
      } else if (note) {
        note.textContent = "Please enter a valid email address.";
      }
    });
  }

  /* ---------- Scroll to top ---------- */
  function initScrollTop() {
    var btn = document.getElementById("scrollTopBtn");
    if (!btn) return;
    function update() {
      if (window.scrollY > 700) btn.classList.add("is-visible");
      else btn.classList.remove("is-visible");
    }
    update();
    window.addEventListener("scroll", throttle(update, 100), { passive: true });
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }

  /* ---------- Floating "Get Directions" CTA (contact page) ---------- */
  function initFloatingDirections() {
    var btn = document.getElementById("floatingDirections");
    if (!btn) return;
    function update() {
      if (window.scrollY > 520) btn.classList.add("is-visible");
      else btn.classList.remove("is-visible");
    }
    update();
    window.addEventListener("scroll", throttle(update, 100), { passive: true });
  }

  /* ---------- Utility: throttle ---------- */
  function throttle(fn, wait) {
    var lastCall = 0;
    var timeout = null;
    return function () {
      var now = Date.now();
      var args = arguments;
      var context = this;
      if (now - lastCall >= wait) {
        lastCall = now;
        fn.apply(context, args);
      } else {
        clearTimeout(timeout);
        timeout = setTimeout(function () {
          lastCall = Date.now();
          fn.apply(context, args);
        }, wait - (now - lastCall));
      }
    };
  }
})();
