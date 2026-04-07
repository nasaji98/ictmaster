(function () {
  var pinInput = document.getElementById("admin-pin");
  var pinForm = document.getElementById("admin-pin-form");
  var gate = document.getElementById("admin-gate");
  var panel = document.getElementById("admin-panel");
  var pinError = document.getElementById("pin-error");

  var form = document.getElementById("course-form");
  var formTitle = document.getElementById("form-title");
  var editId = document.getElementById("edit-course-id");
  var fTitle = document.getElementById("f-title");
  var fDesc = document.getElementById("f-description");
  var fPrice = document.getElementById("f-price");
  var fImage = document.getElementById("f-image-url");
  var fVideo = document.getElementById("f-video-url");
  var formError = document.getElementById("form-error");
  var btnReset = document.getElementById("btn-reset-form");
  var tableBody = document.querySelector("#course-table tbody");

  function showGate() {
    if (!gate || !panel) return;
    var ok = ICTStorage.getAdminAuthed();
    gate.hidden = ok;
    panel.hidden = !ok;
    if (!ok && pinError) pinError.textContent = "";
  }

  function submitPin(e) {
    e.preventDefault();
    var pin = (pinInput && pinInput.value) || "";
    if (pin === ICTStorage.DEMO_ADMIN_PIN) {
      ICTStorage.setAdminAuthed(true);
      if (pinError) pinError.textContent = "";
      showGate();
      renderTable();
    } else {
      if (pinError) pinError.textContent = "Incorrect PIN. Demo PIN: admin123";
    }
  }

  function logoutAdmin() {
    ICTStorage.setAdminAuthed(false);
    showGate();
  }

  function currency(n) {
    return ICTStorage.formatLKR(n);
  }

  function renderTable() {
    if (!tableBody) return;
    var courses = ICTStorage.getCourses();
    tableBody.innerHTML = "";
    if (!courses.length) {
      var tr = document.createElement("tr");
      tr.innerHTML =
        '<td colspan="5" class="empty-state" style="border:none">No courses. Add one with the form.</td>';
      tableBody.appendChild(tr);
      return;
    }
    courses
      .slice()
      .sort(function (a, b) {
        return a.title.localeCompare(b.title);
      })
      .forEach(function (c) {
        var tr = document.createElement("tr");
        tr.innerHTML =
          "<td>" +
          escapeHtml(c.title) +
          "</td>" +
          "<td>" +
          currency(c.price) +
          "</td>" +
          "<td>" +
          truncate(c.description, 40) +
          "</td>" +
          "<td>" +
          '<button type="button" class="btn btn-secondary btn-sm" data-edit="' +
          escapeAttr(c.id) +
          '">Edit</button>' +
          "</td>" +
          "<td>" +
          '<button type="button" class="btn btn-danger btn-sm" data-del="' +
          escapeAttr(c.id) +
          '">Delete</button>' +
          "</td>";
        tableBody.appendChild(tr);
      });

    tableBody.querySelectorAll("[data-edit]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-edit");
        var c = ICTCourses.getCourseById(id);
        if (!c) return;
        if (formTitle) formTitle.textContent = "Edit course";
        if (editId) editId.value = c.id;
        fTitle.value = c.title;
        fDesc.value = c.description;
        fPrice.value = c.price;
        fImage.value = c.imageUrl;
        fVideo.value = c.videoUrlOrNotes;
        if (formError) formError.textContent = "";
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });

    tableBody.querySelectorAll("[data-del]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-del");
        var c = ICTCourses.getCourseById(id);
        if (!c) return;
        if (!confirm('Delete "' + c.title + '"? Enrollments for it will be removed.'))
          return;
        ICTCourses.deleteCourse(id);
        renderTable();
        resetForm();
      });
    });
  }

  function resetForm() {
    if (formTitle) formTitle.textContent = "Add course";
    if (editId) editId.value = "";
    fTitle.value = "";
    fDesc.value = "";
    fPrice.value = "";
    fImage.value = "";
    fVideo.value = "";
    if (formError) formError.textContent = "";
  }

  function submitCourse(e) {
    e.preventDefault();
    if (formError) formError.textContent = "";
    var payload = {
      title: fTitle.value,
      description: fDesc.value,
      price: fPrice.value,
      imageUrl: fImage.value,
      videoUrlOrNotes: fVideo.value,
    };
    var id = (editId && editId.value) || "";
    var result = id
      ? ICTCourses.updateCourse(id, payload)
      : ICTCourses.createCourse(payload);
    if (!result.ok) {
      if (formError) formError.textContent = result.error || "Save failed.";
      return;
    }
    resetForm();
    renderTable();
  }

  function escapeHtml(s) {
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function escapeAttr(s) {
    return String(s).replace(/"/g, "&quot;");
  }

  function truncate(s, n) {
    s = String(s || "");
    if (s.length <= n) return escapeHtml(s);
    return escapeHtml(s.slice(0, n)) + "…";
  }

  document.addEventListener("DOMContentLoaded", function () {
    showGate();
    if (pinForm) pinForm.addEventListener("submit", submitPin);
    var btnAdminOut = document.getElementById("btn-admin-logout");
    if (btnAdminOut) btnAdminOut.addEventListener("click", logoutAdmin);
    if (form) form.addEventListener("submit", submitCourse);
    if (btnReset) btnReset.addEventListener("click", resetForm);
    if (ICTStorage.getAdminAuthed()) renderTable();
  });
})();
