// Dashboard page - show task stats and projects

let currentUser = null;

// Run when page loads
document.addEventListener("DOMContentLoaded", () => {
  currentUser = TTM.requireLogin();  // Check if logged in, redirect if not
  if (!currentUser) {
    return;
  }

  TTM.setUserPill(currentUser);  // Show user name in top-right
  document.getElementById("logoutBtn").addEventListener("click", () => TTM.logout());

  const projectForm = document.getElementById("projectForm");
  
  // Only admins can create projects
  if (currentUser.role === "ADMIN") {
    projectForm.addEventListener("submit", createProject);
  } else {
    document.getElementById("projectPanel").classList.add("d-none");  // Hide create project form
  }

  loadDashboard();  // Load task stats
  loadProjects();   // Load projects list
});

// Load and display task statistics
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

// Load and display projects list
async function loadProjects() {
  try {
    const projects = await TTM.request("/api/projects");
    renderProjects(projects);  // Display on page
  } catch (error) {
    TTM.showAlert("dashboardAlert", error.message);
  }
}

// Display projects in table
function renderProjects(projects) {
  const table = document.getElementById("projectRows");
  const empty = document.getElementById("emptyProjects");

  if (!projects.length) {
    // No projects yet
    table.innerHTML = "";
    empty.classList.remove("d-none");
    return;
  }

  // Hide "no projects" message
  empty.classList.add("d-none");
  
  // Create table rows for each project
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
