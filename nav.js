(function () {
  function setActiveLink() {
    var path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a[data-nav]").forEach(function (a) {
      var href = (a.getAttribute("href") || "").split("?")[0].split("/").pop();
      if (href === path) a.classList.add("is-active");
      else a.classList.remove("is-active");
    });
  }

  function updateSessionUI() {
    var user =
      typeof ICTAuth !== "undefined" ? ICTAuth.getCurrentUser() : null;
    var loginLinks = document.querySelectorAll("[data-show-guest]");
    var userLinks = document.querySelectorAll("[data-show-user]");
    var emailEl = document.querySelector("[data-session-email]");

    loginLinks.forEach(function (el) {
      el.hidden = !!user;
    });
    userLinks.forEach(function (el) {
      el.hidden = !user;
    });
    if (emailEl) {
      var em = user ? user.email : "";
      emailEl.textContent = em;
      if (em) emailEl.setAttribute("title", em);
      else emailEl.removeAttribute("title");
      emailEl.hidden = !user;
    }
  }

  function wireLogout() {
    document.querySelectorAll("[data-action-logout]").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        if (typeof ICTAuth !== "undefined") {
          ICTAuth.logout();
        }
        window.location.href = "index.html";
      });
    });
  }

  function wireMobileNav() {
    var toggle = document.querySelector(".nav-toggle");
    var panel = document.getElementById("header-collapsible");
    if (!toggle || !panel) return;

    function setOpen(open) {
      panel.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }

    toggle.addEventListener("click", function () {
      setOpen(!panel.classList.contains("is-open"));
    });

    panel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 47.99rem)").matches) {
          setOpen(false);
        }
      });
    });

    window.addEventListener(
      "resize",
      function () {
        if (window.matchMedia("(min-width: 48rem)").matches) {
          setOpen(false);
        }
      },
      { passive: true }
    );
  }

  document.addEventListener("DOMContentLoaded", function () {
    setActiveLink();
    updateSessionUI();
    wireLogout();
    wireMobileNav();
  });
})();
