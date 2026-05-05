// TTM (Team Task Manager) - Shared utility functions for all pages
(function () {
  const userKey = "ttmUser";      // Where we store logged-in user info
  const authKey = "ttmAuth";      // Where we store authentication token

  // Get the logged-in user from browser storage
  function getUser() {
    const raw = localStorage.getItem(userKey);
    if (!raw) return null;  // No user logged in
    try {
      return JSON.parse(raw);  // Convert stored text to JavaScript object
    } catch (error) {
      return null;  // Data corrupted, treat as no user
    }
  }

  // Save user login information (called after successful login/signup)
  function saveLogin(user, password) {
    localStorage.setItem(userKey, JSON.stringify(user));  // Store user info
    // Create auth token: email:password encoded in base64
    localStorage.setItem(authKey, btoa(`${user.email}:${password}`));
  }

  // Clear login and send to home page
  function logout(redirect = true) {
    localStorage.removeItem(userKey);    // Delete user info
    localStorage.removeItem(authKey);    // Delete auth token
    if (redirect) {
      window.location.href = "/";        // Go to home page
    }
  }

  // Check if user is logged in, redirect to login page if not
  function requireLogin() {
    const user = getUser();
    const auth = localStorage.getItem(authKey);
    if (!user || !auth) {
      window.location.href = "/";        // Not logged in - go to home
      return null;
    }
    return user;  // Return logged-in user
  }

  // Make API request to backend (handles authentication automatically)
  async function request(path, options = {}) {
    const headers = {};
    const auth = localStorage.getItem(authKey);

    // Add authentication header if we have a token
    if (auth && options.auth !== false) {
      headers.Authorization = `Basic ${auth}`;
    }

    // Set content type if sending JSON data
    if (options.body !== undefined) {
      headers["Content-Type"] = "application/json";
    }

    // Make the API call
    const response = await fetch(path, {
      method: options.method || "GET",
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body)
    });

    // Parse response
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    // Check if request failed
    if (!response.ok) {
      if (response.status === 401 && options.auth !== false) {
        logout(false);  // Unauthorized - logout silently
      }
      throw new Error(data?.message || "Request failed");
    }

    return data;  // Return successful response
  }

  // Show error/success message to user
  function showAlert(id, message, type = "danger") {
    const alert = document.getElementById(id);
    if (!alert) return;
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    alert.classList.remove("d-none");  // Show the message
  }

  // Hide error/success message
  function hideAlert(id) {
    const alert = document.getElementById(id);
    if (alert) {
      alert.classList.add("d-none");  // Hide the message
    }
  }

  // Display user name in top-right corner
  function setUserPill(user) {
    const target = document.getElementById("userPill");
    if (target && user) {
      target.textContent = `${user.name} (${user.role})`;
    }
  }

  // Escape HTML special characters to prevent security issues
  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // Format YYYY-MM-DD date to readable format (Jan 5, 2026)
  function formatDate(value) {
    if (!value) return "No due date";
    return new Date(`${value}T00:00:00`).toLocaleDateString();
  }

  // Get CSS class for priority badge styling
  function priorityClass(priority) {
    if (priority === "HIGH") return "badge-priority-high";
    if (priority === "LOW") return "badge-priority-low";
    return "badge-priority-medium";
  }

  // Get CSS class for status badge styling
  function statusClass(status) {
    if (status === "COMPLETED") return "badge-status-completed";
    if (status === "IN_PROGRESS") return "badge-status-progress";
    return "badge-status-todo";
  }

  // Convert "IN_PROGRESS" to "IN PROGRESS" for display
  function readableStatus(status) {
    return String(status || "").replaceAll("_", " ");
  }

  // Show loading text on button and return function to restore it
  function setButtonLoading(button, loadingText) {
    if (!button) return () => {};
    const oldHtml = button.innerHTML;
    button.disabled = true;
    button.innerHTML = loadingText;
    return function reset() {
      button.disabled = false;
      button.innerHTML = oldHtml;
    };
  }

  window.TTM = {
    getUser,
    saveLogin,
    logout,
    requireLogin,
    request,
    showAlert,
    hideAlert,
    setUserPill,
    escapeHtml,
    formatDate,
    priorityClass,
    statusClass,
    readableStatus,
    setButtonLoading
  };
})();
