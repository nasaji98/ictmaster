(function (global) {
  var S = global.ICTStorage;

  function getCourseById(id) {
    return S.getCourses().find(function (c) {
      return c.id === id;
    });
  }

  function createCourse(payload) {
    var courses = S.getCourses();
    var defaultImg =
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80";
    var course = {
      id: S.newId(),
      title: String(payload.title || "").trim(),
      description: String(payload.description || "").trim(),
      price: parseFloat(payload.price) || 0,
      imageUrl: String(payload.imageUrl || "").trim() || defaultImg,
      videoUrlOrNotes: String(payload.videoUrlOrNotes || "").trim(),
      createdAt: new Date().toISOString(),
    };
    if (!course.title) return { ok: false, error: "Title is required." };
    courses.push(course);
    S.saveCourses(courses);
    return { ok: true, course: course };
  }

  function updateCourse(id, payload) {
    var courses = S.getCourses();
    var idx = courses.findIndex(function (c) {
      return c.id === id;
    });
    if (idx === -1) return { ok: false, error: "Course not found." };
    var c = courses[idx];
    c.title = String(payload.title != null ? payload.title : c.title).trim();
    c.description = String(
      payload.description != null ? payload.description : c.description
    ).trim();
    c.price =
      payload.price != null ? parseFloat(payload.price) || 0 : c.price;
    c.imageUrl = String(
      payload.imageUrl != null ? payload.imageUrl : c.imageUrl
    ).trim();
    if (!c.imageUrl)
      c.imageUrl =
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80";
    c.videoUrlOrNotes = String(
      payload.videoUrlOrNotes != null
        ? payload.videoUrlOrNotes
        : c.videoUrlOrNotes
    ).trim();
    if (!c.title) return { ok: false, error: "Title is required." };
    courses[idx] = c;
    S.saveCourses(courses);
    return { ok: true, course: c };
  }

  function deleteCourse(id) {
    var courses = S.getCourses().filter(function (c) {
      return c.id !== id;
    });
    if (courses.length === S.getCourses().length)
      return { ok: false, error: "Course not found." };
    S.saveCourses(courses);
    var enr = S.getEnrollments().filter(function (r) {
      return r.courseId !== id;
    });
    S.saveEnrollments(enr);
    return { ok: true };
  }

  global.ICTCourses = {
    getCourseById: getCourseById,
    createCourse: createCourse,
    updateCourse: updateCourse,
    deleteCourse: deleteCourse,
  };
})(typeof window !== "undefined" ? window : this);
