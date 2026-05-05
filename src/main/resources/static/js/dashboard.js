let currentUser = null;

document.addEventListener("DOMContentLoaded", () => {
  currentUser = TTM.requireLogin();
  if (!currentUser) {
    return;
  }

  TTM.setUserPill(currentUser);
  document.getElementById("logoutBtn").addEventListener("click", () => TTM.logout());

  const projectForm = document.getElementById("projectForm");
  if (currentUser.role === "ADMIN") {
    projectForm.addEventListener("submit", createProject);
  } else {
    document.getElementById("projectPanel").classList.add("d-none");
  }

  loadDashboard();
  loadProjects();
});

async function loadDashboard() {
  try {
    const data = await TTM.request("/api/dashboard");
    document.getElementById("totalTasks").textContent = data.totalTasks;
    document.getElementById("completedTasks").textContent = data.completedTasks;
    document.getElementById("pendingTasks").textContent = data.pendingTasks;
    document.getElementById("overdueTasks").textContent = data.overdueTasks;
  } catch (error) {
    TTM.showAlert("dashboardAlert", error.message);
  }
}

async function loadProjects() {
  try {
    const projects = await TTM.request("/api/projects");
    renderProjects(projects);
  } catch (error) {
    TTM.showAlert("dashboardAlert", error.message);
  }
}

function renderProjects(projects) {
  const table = document.getElementById("projectRows");
  const empty = document.getElementById("emptyProjects");

  if (!projects.length) {
    table.innerHTML = "";
    empty.classList.remove("d-none");
    return;
  }

  empty.classList.add("d-none");
  table.innerHTML = projects.map((project) => `
    <tr>
      <td>${TTM.escapeHtml(project.name)}</td>
      <td>${TTM.escapeHtml(project.description || "No description")}</td>
      <td>${TTM.escapeHtml(project.createdBy)}</td>
      <td>${project.taskCount}</td>
    </tr>
  `).join("");
}

async function createProject(event) {
  event.preventDefault();
  TTM.hideAlert("dashboardAlert");

  const form = event.currentTarget;
  const button = form.querySelector("button[type='submit']");
  const reset = TTM.setButtonLoading(button, "Saving...");

  try {
    await TTM.request("/api/projects", {
      method: "POST",
      body: {
        name: form.name.value.trim(),
        description: form.description.value.trim()
      }
    });
    form.reset();
    TTM.showAlert("dashboardAlert", "Project created", "success");
    loadProjects();
  } catch (error) {
    TTM.showAlert("dashboardAlert", error.message);
  } finally {
    reset();
  }
}
