document.addEventListener("DOMContentLoaded", () => {
  /* =========================
     NAVIGATION TOGGLE
  ========================= */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav-links");

  toggle?.addEventListener("click", () => {
    nav.classList.toggle("open");
  });

  /* =========================
     AUTH LOGIC
  ========================= */
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  // ---- Helper Functions ----
  const getUsers = () =>
    JSON.parse(localStorage.getItem("ticketapp_users")) || [];
  const saveUsers = (users) =>
    localStorage.setItem("ticketapp_users", JSON.stringify(users));
  const setSession = (email) =>
    localStorage.setItem("ticketapp_session", JSON.stringify({ user: email }));
  const getSession = () =>
    JSON.parse(localStorage.getItem("ticketapp_session"));
  const clearSession = () => localStorage.removeItem("ticketapp_session");

  // ---- Signup ----
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

  // ---- Login ----
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
      setTimeout(() => (window.location.href = "/dashboard"), 1000);
    });
  }

  // ---- Session Protection ----
  const protectedPages = [
    "/dashboard",
    "/tickets",
    "/tickets/create",
    "/tickets/edit",
  ];
  const currentPath = window.location.pathname;

  if (protectedPages.includes(currentPath)) {
    const session = getSession();
    if (!session) {
      showToast("Your session has expired — please log in again.", "error");
      setTimeout(() => (window.location.href = "/auth/login"), 1200);
    }
  }

  // ---- Logout ----
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      clearSession();
      showToast("Logged out successfully.", "info");
      setTimeout(() => (window.location.href = "/"), 1000);
    });
  }
});

/* =========================
   TOAST UTILITY
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
document.addEventListener("DOMContentLoaded", () => {
  const ticketForm = document.getElementById("ticketForm");
  const ticketContainer = document.getElementById("ticketContainer");

  // Modals
  const editModal = document.getElementById("editModal");
  const editForm = document.getElementById("editTicketForm");
  const cancelEdit = document.getElementById("cancelEdit");

  // ===== Helper Functions =====
  const getTickets = () =>
    JSON.parse(localStorage.getItem("ticketapp_tickets")) || [];

  const saveTickets = (tickets) =>
    localStorage.setItem("ticketapp_tickets", JSON.stringify(tickets));

  const renderTickets = () => {
    const tickets = getTickets();
    ticketContainer.innerHTML = "";

    if (!tickets.length) {
      ticketContainer.innerHTML = "<p class='no-tickets'>No tickets yet.</p>";
      return;
    }

    tickets.forEach((ticket) => {
      const card = document.createElement("div");
      card.classList.add("ticket-card", ticket.status);

      card.innerHTML = `
        <div class="ticket-info">
          <h3>${ticket.title}</h3>
          <p>${ticket.description || "No description provided."}</p>
        </div>
        <div class="ticket-footer">
          <span class="status ${ticket.status}">
            ${ticket.status.replace("_", " ")}
          </span>
          <div class="ticket-actions">
            <button class="edit-btn" data-id="${ticket.id}">Edit</button>
            <button class="delete-btn" data-id="${ticket.id}">Delete</button>
          </div>
        </div>
      `;

      ticketContainer.appendChild(card);
    });
  };

  // ===== CREATE =====
  ticketForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = e.target.title.value.trim();
    const description = e.target.description.value.trim();
    const status = e.target.status.value;

    if (!title || !status) {
      showToast("Title and status are required.", "error");
      return;
    }

    const tickets = getTickets();
    const newTicket = {
      id: Date.now(),
      title,
      description,
      status,
    };

    tickets.push(newTicket);
    saveTickets(tickets);
    renderTickets();
    showToast("Ticket added successfully!", "success");
    e.target.reset();
  });

  // ===== EDIT =====
  ticketContainer?.addEventListener("click", (e) => {
    const target = e.target;
    const tickets = getTickets();

    // --- Delete ---
    if (target.classList.contains("delete-btn")) {
      const id = +target.dataset.id;
      if (confirm("Are you sure you want to delete this ticket?")) {
        const updated = tickets.filter((t) => t.id !== id);
        saveTickets(updated);
        renderTickets();
        showToast("Ticket deleted successfully.", "info");
      }
      return;
    }

    // --- Edit ---
    if (target.classList.contains("edit-btn")) {
      const id = +target.dataset.id;
      const ticket = tickets.find((t) => t.id === id);
      if (!ticket) return;

      // Prefill modal form
      document.getElementById("editTicketId").value = ticket.id;
      document.getElementById("editTitle").value = ticket.title;
      document.getElementById("editDescription").value = ticket.description;
      document.getElementById("editStatus").value = ticket.status;

      editModal.classList.remove("hidden");
    }
  });

  // ===== SAVE EDIT =====
  editForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    const id = Number(document.getElementById("editTicketId").value);
    const title = document.getElementById("editTitle").value.trim();
    const description = document.getElementById("editDescription").value.trim();
    const status = document.getElementById("editStatus").value;

    if (!title || !["open", "in_progress", "closed"].includes(status)) {
      showToast("Invalid input or status.", "error");
      return;
    }

    const tickets = getTickets();
    const index = tickets.findIndex((t) => t.id === id);
    if (index !== -1) {
      tickets[index] = { ...tickets[index], title, description, status };
      saveTickets(tickets);
      renderTickets();
      showToast("Ticket updated successfully!", "success");
    }

    editModal.classList.add("hidden");
  });

  // ===== CANCEL EDIT =====
  cancelEdit?.addEventListener("click", () => {
    editModal.classList.add("hidden");
  });

  // ===== INITIAL LOAD =====
  renderTickets();
});
document.addEventListener("DOMContentLoaded", () => {
  const openCount = document.getElementById("openCount");
  const progressCount = document.getElementById("progressCount");
  const closedCount = document.getElementById("closedCount");
  const recentTicketsContainer = document.getElementById(
    "recentTicketsContainer"
  );

  // === Load tickets from localStorage ===
  let tickets = [];
  try {
    tickets = JSON.parse(localStorage.getItem("ticketapp_tickets")) || [];
  } catch (e) {
    console.error("Error parsing tickets:", e);
    tickets = [];
  }

  console.log("Loaded tickets:", tickets);

  // === Count tickets by status ===
  const openTickets = tickets.filter((t) => t.status === "open").length;
  const progressTickets = tickets.filter(
    (t) => t.status === "in_progress"
  ).length;
  const closedTickets = tickets.filter((t) => t.status === "closed").length;

  openCount.textContent = openTickets;
  progressCount.textContent = progressTickets;
  closedCount.textContent = closedTickets;

  // === Render recent tickets ===
  if (tickets.length === 0) {
    recentTicketsContainer.innerHTML =
      '<p class="placeholder">No tickets found. Create one to get started!</p>';
    return;
  }

  recentTicketsContainer.innerHTML = "";
  tickets
    .slice(-5)
    .reverse()
    .forEach((ticket) => {
      const div = document.createElement("div");
      div.classList.add("ticket-item", ticket.status);
      div.innerHTML = `
      <h4>${ticket.title}</h4>
      <p>${ticket.description || "No description provided."}</p>
      <span class="status ${ticket.status}">${ticket.status.replace(
        "_",
        " "
      )}</span>
    `;
      recentTicketsContainer.appendChild(div);
    });
});
