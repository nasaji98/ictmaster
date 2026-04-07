(function (global) {
  var S = global.ICTStorage;

  function normalizeEmail(email) {
    return String(email || "").trim().toLowerCase();
  }

  function register(email, password) {
    var em = normalizeEmail(email);
    var pw = String(password || "");
    if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      return { ok: false, error: "Enter a valid email address." };
    }
    if (pw.length < 6) {
      return { ok: false, error: "Password must be at least 6 characters." };
    }
    var users = S.getUsers();
    if (users.some(function (u) { return u.email === em; })) {
      return { ok: false, error: "An account with this email already exists." };
    }
    var user = {
      id: S.newId(),
      email: em,
      passwordPlain: pw,
    };
    users.push(user);
    S.saveUsers(users);
    S.setSession(user.id);
    return { ok: true, user: user };
  }

  function login(email, password) {
    var em = normalizeEmail(email);
    var pw = String(password || "");
    if (!em || !pw) {
      return { ok: false, error: "Email and password are required." };
    }
    var user = S.getUsers().find(function (u) {
      return u.email === em && u.passwordPlain === pw;
    });
    if (!user) {
      return { ok: false, error: "Invalid email or password." };
    }
    S.setSession(user.id);
    return { ok: true, user: user };
  }

  function logout() {
    S.clearSession();
  }

  function getCurrentUser() {
    var sess = S.getSession();
    if (!sess || !sess.userId) return null;
    return S.getUsers().find(function (u) {
      return u.id === sess.userId;
    }) || null;
  }

  global.ICTAuth = {
    register: register,
    login: login,
    logout: logout,
    getCurrentUser: getCurrentUser,
    normalizeEmail: normalizeEmail,
  };
})(typeof window !== "undefined" ? window : this);
