document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const switchToRegisterLink = document.getElementById('switch-to-register');
    const switchToLoginLink = document.getElementById('switch-to-login');
  
    // Function to show login form
    function showLoginForm() {
      loginForm.style.display = 'block';
      registerForm.style.display = 'none';
      switchToRegisterLink.style.display = 'block';
      switchToLoginLink.style.display = 'none';
      localStorage.setItem('isRegister', 'false');
    }
  
    // Function to show register form
    function showRegisterForm() {
      loginForm.style.display = 'none';
      registerForm.style.display = 'block';
      switchToRegisterLink.style.display = 'none';
      switchToLoginLink.style.display = 'block';
      localStorage.setItem('isRegister', 'true');
    }
  
    // Check localStorage to show the correct form on page load
    if (localStorage.getItem('isRegister') === 'true') {
      showRegisterForm();
    } else {
      showLoginForm();
    }
  
    // Event listeners for switching between forms
    switchToRegisterLink.addEventListener('click', function (e) {
      e.preventDefault();
      showRegisterForm();
    });
  
    switchToLoginLink.addEventListener('click', function (e) {
      e.preventDefault();
      showLoginForm();
    });
  
    // Handle login form submission
    loginForm.addEventListener('submit', async function (e) {
      e.preventDefault();
  
      const email = document.querySelector('#login-form input[name="email"]').value;
      const password = document.querySelector('#login-form input[name="password"]').value;
  
      try {
        const response = await axios.post('http://localhost:3000/auth/login', { email, password });
        const { success } = response.data;
        // Redirect to /tasks after successful login
        if(success) window.location.href = '/tasks';
      } catch (error) {
        console.error('Login error:', error.response?.data || error.message);
        alert('Login failed! Please check your credentials.');
      }
    });
  
    // Handle register form submission
    registerForm.addEventListener('submit', async function (e) {
      e.preventDefault();
  
      const name = document.querySelector('#register-form input[name="name"]').value;
      const email = document.querySelector('#register-form input[name="email"]').value;
      const password = document.querySelector('#register-form input[name="password"]').value;
      const confirmPassword = document.querySelector('#register-form input[name="confirmPassword"]').value;
  
      if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
  
      try {
        const response = await axios.post('http://localhost:3000/auth/register',{ name, email, password });
        const { success } = response.data;
        if(success) showLoginForm();
      } catch (error) {
        console.error('Registration error:', error.response?.data || error.message);
        alert('Registration failed! Please try again.');
      }
    });
  });
  