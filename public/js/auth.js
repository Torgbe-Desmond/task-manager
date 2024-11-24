const BASE_URL = 'https://task-manager-lj45.onrender.com';
// const BASE_URL = 'http://localhost:3000';


document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const switchToRegisterLink = document.getElementById('switch-to-register');
  const switchToLoginLink = document.getElementById('switch-to-login');
  const submit_btn  =  document.querySelector('.submit-btn');
  const register_btn  =  document.querySelector('.register-btn');


  let loading = false;


  function showLoginForm() {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    switchToRegisterLink.style.display = 'block';
    switchToLoginLink.style.display = 'none';
    document.querySelector('#register-form input[name="name"]').value = ''
    document.querySelector('#register-form input[name="email"]').value = ''
    document.querySelector('#register-form input[name="password"]').value = ''
    document.querySelector('#register-form input[name="confirmPassword"]').value = ''
    localStorage.setItem('isRegister', 'false');
  }

  function showRegisterForm() {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    switchToRegisterLink.style.display = 'none';
    switchToLoginLink.style.display = 'block';
    document.querySelector('#login-form input[name="email"]').value = '';
    document.querySelector('#login-form input[name="password"]').value = '';
    localStorage.setItem('isRegister', 'true');
  }

  if (localStorage.getItem('isRegister') === 'true') {
    showRegisterForm();
  } else {
    showLoginForm();
  }

  switchToRegisterLink.addEventListener('click', function (e) {
    e.preventDefault();
    showRegisterForm();
  });

  switchToLoginLink.addEventListener('click', function (e) {
    e.preventDefault();
    showLoginForm();
  });



  loginForm.addEventListener('submit', async function (e) {
    loading = true;
    submit_btn.innerText = 'Login...'
    submit_btn.setAttribute('disabled',loading)
    submit_btn.style.backgroundColor = '#8e949e'
    e.preventDefault();

    const email = document.querySelector('#login-form input[name="email"]');
    const password = document.querySelector('#login-form input[name="password"]');

    email.setAttribute('disabled',loading)
    password.setAttribute('disabled',loading)
    

    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, { email:email.value, password:password.value });
      const { success } = response.data;
      if ( success ) window.location.href = `${BASE_URL}/tasks`;
      loading = false;
      submit_btn.innerText = 'Login'
      email.removeAttribute('disabled')
      password.removeAttribute('disabled')
      submit_btn.removeAttribute('disabled')
      submit_btn.style.backgroundColor = '#645cff'

    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      submit_btn.innerText = 'Login'
      loading = false;
      email.removeAttribute('disabled')
      password.removeAttribute('disabled')
      submit_btn.removeAttribute('disabled')
      submit_btn.style.backgroundColor = '#645cff'
      alert('Login failed! Please check your credentials.');
    }
  });

  registerForm.addEventListener('submit', async function (e) {
    loading = true;
    register_btn.setAttribute('disabled',loading)
    register_btn.innerText = 'Registering...'
    e.preventDefault();

    const name = document.querySelector('#register-form input[name="name"]');
    const email = document.querySelector('#register-form input[name="email"]');
    const password = document.querySelector('#register-form input[name="password"]');
    const confirmPassword = document.querySelector('#register-form input[name="confirmPassword"]');


    name.setAttribute('disabled',loading)
    email.setAttribute('disabled',loading)
    password.setAttribute('disabled',loading)
    confirmPassword.setAttribute('disabled',loading)

    if(password.value.length < 8){
      alert('Password must be greater than 8 characters.');
      return ;
   }

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/auth/register`, { name:name.value, email:email.value, password:password.value });
      const { success } = response.data;
      loading = false;

      register_btn.removeAttribute('disabled')
      name.removeAttribute('disabled')
      email.removeAttribute('disabled')
      password.removeAttribute('disabled')
      confirmPassword.removeAttribute('disabled')
      
      if (success) showLoginForm();
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      loading = false;
      
      register_btn.removeAttribute('disabled')
      name.removeAttribute('disabled')
      email.removeAttribute('disabled')
      password.removeAttribute('disabled')
      confirmPassword.removeAttribute('disabled')

      alert('Registration failed! Please try again.');
    }
  });
});
