document.addEventListener("DOMContentLoaded", () => {
  if (TTM.getUser()) {
    window.location.href = "/dashboard.html";
    return;
  }

  document.getElementById("loginForm").addEventListener("submit", handleLogin);
  document.getElementById("signupForm").addEventListener("submit", handleSignup);
});

async function handleLogin(event) {
  event.preventDefault();
  TTM.hideAlert("authAlert");

  const form = event.currentTarget;
  const button = form.querySelector("button[type='submit']");
  const reset = TTM.setButtonLoading(button, "Signing in...");

  const email = form.email.value.trim().toLowerCase();
  const password = form.password.value;

  try {
    const user = await TTM.request("/api/auth/login", {
      method: "POST",
      auth: false,
      body: { email, password }
    });
    TTM.saveLogin(user, password);
    window.location.href = "/dashboard.html";
  } catch (error) {
    TTM.showAlert("authAlert", error.message);
  } finally {
    reset();
  }
}

async function handleSignup(event) {
  event.preventDefault();
  TTM.hideAlert("authAlert");

  const form = event.currentTarget;
  const button = form.querySelector("button[type='submit']");
  const reset = TTM.setButtonLoading(button, "Creating...");

  const email = form.email.value.trim().toLowerCase();
  const password = form.password.value;
  const role = form.role.value;

  try {
    const user = await TTM.request("/api/auth/signup", {
      method: "POST",
      auth: false,
      body: {
        name: form.name.value.trim(),
        email,
        password,
        role
      }
    });
    TTM.saveLogin(user, password);
    window.location.href = "/dashboard.html";
  } catch (error) {
    TTM.showAlert("authAlert", error.message);
  } finally {
    reset();
  }
}
