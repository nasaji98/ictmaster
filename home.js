(function () {
  function currency(n) {
    return ICTStorage.formatLKR(n);
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

  document.addEventListener("DOMContentLoaded", function () {
    var grid = document.getElementById("featured-grid");
    if (!grid) return;
    var courses = ICTStorage.getCourses().slice(0, 3);
    if (!courses.length) {
      grid.innerHTML =
        '<p class="empty-state">Courses will appear here once added.</p>';
      return;
    }
    grid.innerHTML = "";
    courses.forEach(function (c) {
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
        '</span><a class="btn btn-primary btn-sm" href="courses.html">All courses</a>' +
        "</div></div>";
      grid.appendChild(card);
    });
  });
})();
