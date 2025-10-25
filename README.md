# 🎟️ TicketApp — Twig Version
A responsive, modern **Ticket Management Web App** built using **Twig templating** and **Vanilla JavaScript**, as part of the **Multi-Framework Ticket Web App** challenge.

This is the **Twig implementation** — part of a 3-framework submission (React, Vue, Twig).

---

## 🚀 Features Overview

### 🏠 Landing Page
- Clean hero section with **wavy SVG background** and decorative **circles**.
- Clear **Call-to-Action** buttons for *Login* and *Get Started*.
- Fully **responsive** layout with a centered 1440px max-width container.

### 🔐 Authentication (LocalStorage Simulation)
- **Signup** and **Login** forms with inline validation.
- Real-time **toast notifications** for errors and success.
- **Session simulation** using `localStorage` with key:  
  `ticketapp_session`
- Unauthorized access redirects to `/auth/login`.

### 📊 Dashboard
- Displays real-time ticket stats:
  - **Open Tickets**
  - **In Progress**
  - **Closed**
- Shows **recent tickets** dynamically.
- Protected route (requires valid session).
- Includes **Logout** button that clears session and redirects to login.

### 🎫 Ticket Management (CRUD)
- **Create** new tickets with validation.
- **Read** all tickets as card-style boxes.
- **Update** existing tickets with prompts.
- **Delete** tickets with confirmation.
- Stored locally in:
