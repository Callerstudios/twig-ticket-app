document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav-links");

  toggle?.addEventListener("click", () => {
    nav.classList.toggle("open");
  });
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  // ===== Helper Functions =====
  const getUsers = () =>
    JSON.parse(localStorage.getItem("ticketapp_users")) || [];
  const saveUsers = (users) =>
    localStorage.setItem("ticketapp_users", JSON.stringify(users));
  const setSession = (email) =>
    localStorage.setItem("ticketapp_session", JSON.stringify({ user: email }));
  const getSession = () =>
    JSON.parse(localStorage.getItem("ticketapp_session"));
  const clearSession = () => localStorage.removeItem("ticketapp_session");

  // ===== Signup Logic =====
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = e.target.email.value.trim();
      const password = e.target.password.value.trim();

      if (!email || !password) {
        showToast("All fields are required.", "error");
        return;
      }

      const users = getUsers();
      if (users.find((u) => u.email === email)) {
        showToast("Email already exists. Please log in.", "error");
        return;
      }

      users.push({ email, password });
      saveUsers(users);
      showToast("Signup successful! Please log in.", "success");
      setTimeout(() => (window.location.href = "/auth/login"), 1200);
    });
  }

  // ===== Login Logic =====
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = e.target.email.value.trim();
      const password = e.target.password.value.trim();

      const users = getUsers();
      const foundUser = users.find(
        (u) => u.email === email && u.password === password
      );

      if (!foundUser) {
        showToast("Invalid credentials. Try again.", "error");
        return;
      }

      setSession(email);
      showToast("Login successful!", "success");
      setTimeout(() => (window.location.href = "/dashboard.html"), 1000);
    });
  }

  // ===== Session Check =====
  const protectedPages = ["/dashboartd.html", "/tickets.html"];
  if (protectedPages.some((p) => window.location.pathname.endsWith(p))) {
    const session = getSession();
    console.log("Session is ", session);
    
    if (!session) {
      showToast("Your session has expired — please log in again.", "error");
      window.location.href = "/auth/login.html";
    }
  }

  // ===== Logout Handling =====
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      clearSession();
      showToast("Logged out successfully.", "info");
      setTimeout(() => (window.location.href = "/index.html"), 1000);
    });
  }
});


/* =========================
   Toast Notification Utility
========================= */
function showToast(message, type = "info") {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.style.opacity = "1";

  setTimeout(() => {
    toast.style.opacity = "0";
  }, 2500);
}


