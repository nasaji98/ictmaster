(function () {
  function showToast(message) {
    var existing = document.querySelector(".toast");
    if (existing) existing.remove();
    var t = document.createElement("div");
    t.className = "toast";
    t.textContent = message;
    document.body.appendChild(t);
    setTimeout(function () {
      t.remove();
    }, 3200);
  }

  function currency(n) {
    return ICTStorage.formatLKR(n);
  }

  function render() {
    var grid = document.getElementById("course-grid");
    if (!grid) return;

    var courses = ICTStorage.getCourses();
    var user = ICTAuth.getCurrentUser();

    if (!courses.length) {
      grid.innerHTML =
        '<p class="empty-state">No courses yet. An admin can add some in the Admin panel.</p>';
      return;
    }

    grid.innerHTML = "";
    courses.forEach(function (c) {
      var enrolled = user && ICTStorage.isEnrolled(user.id, c.id);
      var card = document.createElement("article");
      card.className = "course-card";
      card.innerHTML =
        '<img class="course-card__image" src="' +
        escapeAttr(c.imageUrl) +
        '" alt="" loading="lazy" />' +
        '<div class="course-card__body">' +
        '<h3 class="course-card__title">' +
        escapeHtml(c.title) +
        "</h3>" +
        '<p class="course-card__desc">' +
        escapeHtml(c.description) +
        "</p>" +
        '<div class="course-card__footer">' +
        '<span class="price">' +
        currency(c.price) +
        "</span>" +
        '<span class="catalog-actions"></span>' +
        "</div></div>";

      var actions = card.querySelector(".catalog-actions");

      if (!user) {
        var buy = document.createElement("a");
        buy.href = "login.html?next=courses.html";
        buy.className = "btn btn-primary btn-sm";
        buy.textContent = "Sign in to buy";
        actions.appendChild(buy);
      } else if (enrolled) {
        var badge = document.createElement("span");
        badge.className = "badge";
        badge.textContent = "Enrolled";
        actions.appendChild(badge);
        var go = document.createElement("a");
        go.href = "dashboard.html";
        go.className = "btn btn-secondary btn-sm";
        go.textContent = "My courses";
        actions.appendChild(go);
      } else {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn btn-primary btn-sm";
        btn.textContent = "Buy";
        btn.dataset.courseId = c.id;
        btn.addEventListener("click", function () {
          var r = ICTStorage.addEnrollment(user.id, c.id);
          if (r.ok) {
            showToast("Enrollment successful! Access it from My courses.");
            render();
          } else if (r.reason === "already") {
            showToast("You already have this course.");
          }
        });
        actions.appendChild(btn);
      }

      grid.appendChild(card);
    });
  }

  function escapeHtml(s) {
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function escapeAttr(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;");
  }

  document.addEventListener("DOMContentLoaded", render);
})();
