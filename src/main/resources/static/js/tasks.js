let currentUser = null;
let allTasks = [];

document.addEventListener("DOMContentLoaded", () => {
  currentUser = TTM.requireLogin();
  if (!currentUser) {
    return;
  }

  TTM.setUserPill(currentUser);
  document.getElementById("logoutBtn").addEventListener("click", () => TTM.logout());
  document.getElementById("statusFilter").addEventListener("change", renderTasks);

  const taskForm = document.getElementById("taskForm");
  if (currentUser.role === "ADMIN") {
    taskForm.addEventListener("submit", createTask);
    loadProjectsForForm();
  } else {
    document.getElementById("taskCreatePanel").classList.add("d-none");
  }

  loadTasks();
});

async function loadProjectsForForm() {
  try {
    const projects = await TTM.request("/api/projects");
    const select = document.getElementById("projectId");
    select.innerHTML = `<option value="">Select project</option>` + projects.map((project) => (
      `<option value="${project.id}">${TTM.escapeHtml(project.name)}</option>`
    )).join("");
  } catch (error) {
    TTM.showAlert("taskAlert", error.message);
  }
}

async function loadTasks() {
  try {
    allTasks = await TTM.request("/api/tasks");
    renderTasks();
  } catch (error) {
    TTM.showAlert("taskAlert", error.message);
  }
}

function renderTasks() {
  const filter = document.getElementById("statusFilter").value;
  const rows = document.getElementById("taskRows");
  const empty = document.getElementById("emptyTasks");
  const tasks = filter === "ALL" ? allTasks : allTasks.filter((task) => task.status === filter);

  if (!tasks.length) {
    rows.innerHTML = "";
    empty.classList.remove("d-none");
    return;
  }

  empty.classList.add("d-none");
  rows.innerHTML = tasks.map((task) => `
    <tr class="${task.overdue ? "overdue-row" : ""}">
      <td>
        <div class="fw-semibold">${TTM.escapeHtml(task.title)}</div>
        <div class="text-muted-small">${TTM.escapeHtml(task.description || "No notes")}</div>
      </td>
      <td>${TTM.escapeHtml(task.projectName)}</td>
      <td>
        <span>${TTM.formatDate(task.dueDate)}</span>
        ${task.overdue ? `<div class="text-danger small">Overdue</div>` : ""}
      </td>
      <td><span class="badge ${TTM.priorityClass(task.priority)}">${task.priority}</span></td>
      <td><span class="badge ${TTM.statusClass(task.status)}">${TTM.readableStatus(task.status)}</span></td>
      <td>${TTM.escapeHtml(task.assignedToName)}</td>
      <td class="table-actions">
        <div class="d-flex flex-column gap-2">
          <div class="input-group input-group-sm">
            <select class="form-select" data-status-for="${task.id}">
              ${statusOptions(task.status)}
            </select>
            <button class="btn btn-outline-secondary" type="button" data-save-status="${task.id}">
              <i class="bi bi-check2"></i>
            </button>
          </div>
          ${currentUser.role === "ADMIN" ? assignControls(task.id) : ""}
        </div>
      </td>
    </tr>
  `).join("");

  rows.querySelectorAll("[data-save-status]").forEach((button) => {
    button.addEventListener("click", () => updateStatus(button.dataset.saveStatus));
  });

  rows.querySelectorAll("[data-assign-task]").forEach((button) => {
    button.addEventListener("click", () => assignTask(button.dataset.assignTask));
  });
}

function statusOptions(selected) {
  return ["TODO", "IN_PROGRESS", "COMPLETED"].map((status) => (
    `<option value="${status}" ${status === selected ? "selected" : ""}>${TTM.readableStatus(status)}</option>`
  )).join("");
}

function assignControls(taskId) {
  return `
    <div class="input-group input-group-sm">
      <input class="form-control compact-input" type="email" placeholder="member email" data-assign-email="${taskId}">
      <button class="btn btn-outline-primary" type="button" data-assign-task="${taskId}">
        <i class="bi bi-person-plus"></i>
      </button>
    </div>
  `;
}

async function createTask(event) {
  event.preventDefault();
  TTM.hideAlert("taskAlert");

  const form = event.currentTarget;
  const button = form.querySelector("button[type='submit']");
  const reset = TTM.setButtonLoading(button, "Adding...");

  try {
    await TTM.request("/api/tasks", {
      method: "POST",
      body: {
        projectId: Number(form.projectId.value),
        title: form.title.value.trim(),
        description: form.description.value.trim(),
        assignedToEmail: form.assignedToEmail.value.trim() || null,
        dueDate: form.dueDate.value || null,
        priority: form.priority.value
      }
    });
    form.reset();
    TTM.showAlert("taskAlert", "Task created", "success");
    loadTasks();
  } catch (error) {
    TTM.showAlert("taskAlert", error.message);
  } finally {
    reset();
  }
}

async function updateStatus(taskId) {
  TTM.hideAlert("taskAlert");
  const select = document.querySelector(`[data-status-for="${taskId}"]`);

  try {
    await TTM.request(`/api/tasks/${taskId}/status`, {
      method: "PATCH",
      body: { status: select.value }
    });
    TTM.showAlert("taskAlert", "Task status updated", "success");
    loadTasks();
  } catch (error) {
    TTM.showAlert("taskAlert", error.message);
  }
}

async function assignTask(taskId) {
  TTM.hideAlert("taskAlert");
  const input = document.querySelector(`[data-assign-email="${taskId}"]`);

  try {
    await TTM.request(`/api/tasks/${taskId}/assign`, {
      method: "PATCH",
      body: { assignedToEmail: input.value.trim() }
    });
    input.value = "";
    TTM.showAlert("taskAlert", "Task assigned", "success");
    loadTasks();
  } catch (error) {
    TTM.showAlert("taskAlert", error.message);
  }
}
