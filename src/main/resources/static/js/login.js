// Login page - handle signup and login forms

// Run when page loads
document.addEventListener("DOMContentLoaded", () => {
  // If user is already logged in, go to dashboard
  if (TTM.getUser()) {
    window.location.href = "/dashboard.html";
    return;
  }

  // Attach form submission handlers
  document.getElementById("loginForm").addEventListener("submit", handleLogin);
  document.getElementById("signupForm").addEventListener("submit", handleSignup);
});

// Handle login form submission
async function handleLogin(event) {
  event.preventDefault();  // Don't refresh page
  TTM.hideAlert("authAlert");

  const form = event.currentTarget;
  const button = form.querySelector("button[type='submit']");
  const reset = TTM.setButtonLoading(button, "Signing in...");

  const email = form.email.value.trim().toLowerCase();
  const password = form.password.value;

  try {
    // Send login request to backend
    const user = await TTM.request("/api/auth/login", {
      method: "POST",
      auth: false,  // Don't send auth header (not logged in yet)
      body: { email, password }
    });
    TTM.saveLogin(user, password);  // Save login info
    window.location.href = "/dashboard.html";  // Go to dashboard
  } catch (error) {
    TTM.showAlert("authAlert", error.message);  // Show error
  } finally {
    reset();  // Restore button
  }
}

// Handle signup form submission
async function handleSignup(event) {
  event.preventDefault();  // Don't refresh page
  TTM.hideAlert("authAlert");

  const form = event.currentTarget;
  const button = form.querySelector("button[type='submit']");
  const reset = TTM.setButtonLoading(button, "Creating...");

  const email = form.email.value.trim().toLowerCase();
  const password = form.password.value;
  const role = form.role.value;

  try {
    // Send signup request to backend
    const user = await TTM.request("/api/auth/signup", {
      method: "POST",
      auth: false,  // Don't send auth header (not logged in yet)
      body: {
        name: form.name.value.trim(),
        email,
        password,
        role
      }
    });
    TTM.saveLogin(user, password);  // Save login info
    window.location.href = "/dashboard.html";
  } catch (error) {
    TTM.showAlert("authAlert", error.message);
  } finally {
    reset();
  }
}
