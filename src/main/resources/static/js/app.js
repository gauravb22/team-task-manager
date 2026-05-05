(function () {
  const userKey = "ttmUser";
  const authKey = "ttmAuth";

  function getUser() {
    const raw = localStorage.getItem(userKey);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw);
    } catch (error) {
      return null;
    }
  }

  function saveLogin(user, password) {
    localStorage.setItem(userKey, JSON.stringify(user));
    localStorage.setItem(authKey, btoa(`${user.email}:${password}`));
  }

  function logout(redirect = true) {
    localStorage.removeItem(userKey);
    localStorage.removeItem(authKey);
    if (redirect) {
      window.location.href = "/";
    }
  }

  function requireLogin() {
    const user = getUser();
    const auth = localStorage.getItem(authKey);
    if (!user || !auth) {
      window.location.href = "/";
      return null;
    }
    return user;
  }

  async function request(path, options = {}) {
    const headers = {};
    const auth = localStorage.getItem(authKey);

    if (options.body !== undefined) {
      headers["Content-Type"] = "application/json";
    }
    if (auth && options.auth !== false) {
      headers.Authorization = `Basic ${auth}`;
    }

    const response = await fetch(path, {
      method: options.method || "GET",
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body)
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      if (response.status === 401 && options.auth !== false) {
        logout(false);
      }
      throw new Error(data?.message || "Request failed");
    }

    return data;
  }

  function showAlert(id, message, type = "danger") {
    const alert = document.getElementById(id);
    if (!alert) {
      return;
    }
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    alert.classList.remove("d-none");
  }

  function hideAlert(id) {
    const alert = document.getElementById(id);
    if (alert) {
      alert.classList.add("d-none");
    }
  }

  function setUserPill(user) {
    const target = document.getElementById("userPill");
    if (target && user) {
      target.textContent = `${user.name} (${user.role})`;
    }
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function formatDate(value) {
    if (!value) {
      return "No due date";
    }
    return new Date(`${value}T00:00:00`).toLocaleDateString();
  }

  function priorityClass(priority) {
    if (priority === "HIGH") {
      return "badge-priority-high";
    }
    if (priority === "LOW") {
      return "badge-priority-low";
    }
    return "badge-priority-medium";
  }

  function statusClass(status) {
    if (status === "COMPLETED") {
      return "badge-status-completed";
    }
    if (status === "IN_PROGRESS") {
      return "badge-status-progress";
    }
    return "badge-status-todo";
  }

  function readableStatus(status) {
    return String(status || "").replaceAll("_", " ");
  }

  function setButtonLoading(button, loadingText) {
    if (!button) {
      return () => {};
    }
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
