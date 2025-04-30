function validateForm(event) {
  event.preventDefault(); // Prevent form submission

  const username = document.getElementById("username");
  const password = document.getElementById("password");
  const usernameError = document.getElementById("username-error");
  const passwordError = document.getElementById("password-error");

  let isValid = true;

  // Username check
  if (username.value.trim() === "") {
    usernameError.style.display = "block";
    isValid = false;
  } else {
    usernameError.style.display = "none";
  }

  // Password check
  if (password.value.trim() === "") {
    passwordError.style.display = "block";
    isValid = false;
  } else {
    passwordError.style.display = "none";
  }

  if (isValid) {
    // You can redirect or show a success message here
    alert("Login successful!");
  }
}
