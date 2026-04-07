(function (global) {
  var PREFIX = "ictStore_";

  var KEYS = {
    users: PREFIX + "users",
    session: PREFIX + "session",
    courses: PREFIX + "courses",
    enrollments: PREFIX + "enrollments",
    adminAuthed: PREFIX + "adminSession",
  };

  function readJSON(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (raw == null) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function newId() {
    if (global.crypto && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    return "id_" + Date.now() + "_" + Math.random().toString(36).slice(2, 9);
  }

  /** Display prices in Sri Lankan Rupees (LKR). */
  function formatLKR(n) {
    var v = Number(n);
    if (isNaN(v)) v = 0;
    var opts =
      v % 1 === 0
        ? { maximumFractionDigits: 0 }
        : { minimumFractionDigits: 2, maximumFractionDigits: 2 };
    return "Rs. " + v.toLocaleString("en-LK", opts);
  }

  var DEMO_COURSES = [
    {
      id: "seed_1",
      title: "Grade 6–8 ICT — basics",
      description:
        "Simple video lessons for younger students: using a computer safely, typing, files, and drawing.",
      price: 1500,
      imageUrl:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
      videoUrlOrNotes:
        "https://www.youtube.com/results?search_query=grade+6+ICT+sinhala+english",
      createdAt: new Date().toISOString(),
    },
    {
      id: "seed_2",
      title: "Grade 9–10 ICT — revision pack",
      description:
        "Topic-wise videos to match school ICT: presentations, spreadsheets, and short questions.",
      price: 2200,
      imageUrl:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      videoUrlOrNotes:
        "https://www.youtube.com/results?search_query=OL+grade+9+10+ICT",
      createdAt: new Date().toISOString(),
    },
    {
      id: "seed_3",
      title: "Grade 11 ICT — school syllabus",
      description:
        "Full-term style lectures for Grade 11 ICT with past-paper style tips.",
      price: 2800,
      imageUrl:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
      videoUrlOrNotes:
        "https://www.youtube.com/results?search_query=grade+11+ICT+sri+lanka",
      createdAt: new Date().toISOString(),
    },
    {
      id: "seed_4",
      title: "A/L ICT — Part I (foundation)",
      description:
        "Systems analysis, programming basics, and communication — structured for A/L Part I.",
      price: 4500,
      imageUrl:
        "https://images.unsplash.com/photo-1544383835-bda086bc5805?w=800&q=80",
      videoUrlOrNotes:
        "https://www.youtube.com/results?search_query=A+level+ICT+part+1",
      createdAt: new Date().toISOString(),
    },
    {
      id: "seed_5",
      title: "A/L ICT — Part II & questions",
      description:
        "Database, web, multimedia, and quick revision sessions with model answers.",
      price: 5200,
      imageUrl:
        "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80",
      videoUrlOrNotes:
        "https://www.youtube.com/results?search_query=A+level+ICT+part+2",
      createdAt: new Date().toISOString(),
    },
  ];

  function ensureSeedCourses() {
    var list = readJSON(KEYS.courses, null);
    if (!list || !list.length) {
      writeJSON(KEYS.courses, DEMO_COURSES);
    }
  }

  function getUsers() {
    return readJSON(KEYS.users, []);
  }

  function saveUsers(users) {
    writeJSON(KEYS.users, users);
  }

  function getSession() {
    return readJSON(KEYS.session, null);
  }

  function setSession(userId) {
    writeJSON(KEYS.session, { userId: userId });
  }

  function clearSession() {
    localStorage.removeItem(KEYS.session);
  }

  function getCourses() {
    ensureSeedCourses();
    return readJSON(KEYS.courses, []);
  }

  function saveCourses(courses) {
    writeJSON(KEYS.courses, courses);
  }

  function getEnrollments() {
    return readJSON(KEYS.enrollments, []);
  }

  function saveEnrollments(rows) {
    writeJSON(KEYS.enrollments, rows);
  }

  function isEnrolled(userId, courseId) {
    return getEnrollments().some(function (r) {
      return r.userId === userId && r.courseId === courseId;
    });
  }

  function addEnrollment(userId, courseId) {
    if (isEnrolled(userId, courseId)) return { ok: false, reason: "already" };
    var rows = getEnrollments();
    rows.push({
      userId: userId,
      courseId: courseId,
      purchasedAt: new Date().toISOString(),
    });
    saveEnrollments(rows);
    return { ok: true };
  }

  function getAdminAuthed() {
    return readJSON(KEYS.adminAuthed, false);
  }

  function setAdminAuthed(flag) {
    writeJSON(KEYS.adminAuthed, !!flag);
  }

  var DEMO_ADMIN_PIN = "admin123";

  global.ICTStorage = {
    KEYS: KEYS,
    newId: newId,
    formatLKR: formatLKR,
    getUsers: getUsers,
    saveUsers: saveUsers,
    getSession: getSession,
    setSession: setSession,
    clearSession: clearSession,
    getCourses: getCourses,
    saveCourses: saveCourses,
    getEnrollments: getEnrollments,
    saveEnrollments: saveEnrollments,
    isEnrolled: isEnrolled,
    addEnrollment: addEnrollment,
    getAdminAuthed: getAdminAuthed,
    setAdminAuthed: setAdminAuthed,
    DEMO_ADMIN_PIN: DEMO_ADMIN_PIN,
  };
})(typeof window !== "undefined" ? window : this);
