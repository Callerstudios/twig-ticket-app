// ==============================
// TicketApp Frontend Logic
// ==============================

const SESSION_KEY = "ticketapp_session";
const TICKETS_KEY = "ticketapp_tickets";

// ==============================
// AUTH LOGIC
// ==============================

// Simulated user signup
function handleSignup() {
  const form = document.querySelector('form[action="/auth/signup"]');
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value.trim();

    if (!name || !email || !password) {
      alert("All fields are required.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("ticketapp_users") || "[]");
    if (users.find((u) => u.email === email)) {
      alert("User already exists. Please login instead.");
      return;
    }

    users.push({ name, email, password });
    localStorage.setItem("ticketapp_users", JSON.stringify(users));
    alert("Signup successful! Please log in.");
    window.location.href = "/auth/login";
  });
}

// Simulated login
function handleLogin() {
  const form = document.querySelector('form[action="/auth/login"]');
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    const password = form.password.value.trim();

    const users = JSON.parse(localStorage.getItem("ticketapp_users") || "[]");
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      alert("Invalid email or password.");
      return;
    }

    const session = {
      email,
      token: Math.random().toString(36).substring(2),
      loginTime: Date.now(),
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    window.location.href = "/dashboard";
  });
}

// Protect pages that require login
function protectRoutes() {
  const path = window.location.pathname;
  const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");

  const protectedRoutes = [
    "/dashboard",
    "/tickets",
    "/tickets/create",
    "/tickets/edit",
  ];
  const isProtected = protectedRoutes.some((route) => path.startsWith(route));

  if (isProtected && !session) {
    alert("Your session has expired — please log in again.");
    window.location.href = "/auth/login";
  }
}

// Logout
function handleLogout() {
  const logoutForm = document.querySelector('form[action="/logout"]');
  if (!logoutForm) return;

  logoutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    localStorage.removeItem(SESSION_KEY);
    alert("You have been logged out.");
    window.location.href = "/";
  });
}

// ==============================
// TICKET MANAGEMENT LOGIC
// ==============================

// Load and render tickets on list page
function renderTickets() {
  const ticketsContainer = document.querySelector(".ticket-grid");
  if (!ticketsContainer) return;

  const tickets = JSON.parse(localStorage.getItem(TICKETS_KEY) || "[]");

  if (tickets.length === 0) {
    ticketsContainer.innerHTML = "<p>No tickets found.</p>";
    return;
  }

  ticketsContainer.innerHTML = tickets
    .map(
      (t) => `
      <div class="card ticket">
        <h4>${t.title}</h4>
        <p>${t.description || "No description"}</p>
        <span class="status ${t.status}">${t.status.replace("_", " ")}</span>
        <div class="actions">
          <a href="/tickets/edit?id=${t.id}" class="btn-sm">Edit</a>
          <button class="btn-sm btn-outline delete-btn" data-id="${
            t.id
          }">Delete</button>
        </div>
      </div>
    `
    )
    .join("");

  // handle delete
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const id = btn.dataset.id;
      if (confirm("Are you sure you want to delete this ticket?")) {
        const updated = tickets.filter((t) => t.id !== id);
        localStorage.setItem(TICKETS_KEY, JSON.stringify(updated));
        alert("Ticket deleted successfully.");
        location.reload();
      }
    });
  });
}

// Handle ticket creation or editing
function handleTicketForm() {
  const form = document.querySelector(".ticket-form form");
  if (!form) return;

  const params = new URLSearchParams(window.location.search);
  const editId = params.get("id");

  let tickets = JSON.parse(localStorage.getItem(TICKETS_KEY) || "[]");
  let ticket = editId ? tickets.find((t) => t.id === editId) : null;

  if (ticket) {
    form.title.value = ticket.title;
    form.description.value = ticket.description;
    form.status.value = ticket.status;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = form.title.value.trim();
    const description = form.description.value.trim();
    const status = form.status.value;

    if (!title || !status) {
      alert("Title and status are required.");
      return;
    }

    if (editId) {
      // Update ticket
      tickets = tickets.map((t) =>
        t.id === editId ? { ...t, title, description, status } : t
      );
      alert("Ticket updated successfully.");
    } else {
      // Create ticket
      const newTicket = {
        id: Math.random().toString(36).substring(2),
        title,
        description,
        status,
        createdAt: new Date().toISOString(),
      };
      tickets.push(newTicket);
      alert("Ticket created successfully.");
    }

    localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
    window.location.href = "/tickets";
  });
}

// Dashboard stats
function updateDashboard() {
  const statsGrid = document.querySelector(".stats-grid");
  if (!statsGrid) return;

  const tickets = JSON.parse(localStorage.getItem(TICKETS_KEY) || "[]");

  const stats = {
    open: tickets.filter((t) => t.status === "open").length,
    in_progress: tickets.filter((t) => t.status === "in_progress").length,
    closed: tickets.filter((t) => t.status === "closed").length,
  };

  statsGrid.querySelector(".open p").textContent = stats.open;
  statsGrid.querySelector(".in-progress p").textContent = stats.in_progress;
  statsGrid.querySelector(".closed p").textContent = stats.closed;
}

// ==============================
// INIT
// ==============================

document.addEventListener("DOMContentLoaded", () => {
  protectRoutes();
  handleSignup();
  handleLogin();
  handleLogout();
  renderTickets();
  handleTicketForm();
  updateDashboard();
});
