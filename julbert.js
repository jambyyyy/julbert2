function openAuthModal() {
  document.getElementById('authModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeAuthModal(event) {
  if (event && event.target !== event.currentTarget) return;
  document.getElementById('authModal').classList.remove('active');
  document.body.style.overflow = 'auto';
}

function switchToSignup(event) {
  if (event) event.preventDefault();
  const login = document.getElementById('loginForm');
  const signup = document.getElementById('signupForm');
  if (login) login.style.display = 'none';
  if (signup) signup.style.display = 'block';
}

function switchToLogin(event) {
  if (event) event.preventDefault();
  const login = document.getElementById('loginForm');
  const signup = document.getElementById('signupForm');
  if (signup) signup.style.display = 'none';
  if (login) login.style.display = 'block';
}

function getInputValue(parent, selector) {
  const el = parent.querySelector(selector);
  return el ? el.value.trim() : '';
}
function showToast(msg) {
  alert(msg);
}
function setUserUI({ full_name, email }) {
  console.log('Logged in as:', full_name, email);
}

async function handleLogin(event) {
  event.preventDefault();
  const form = event.target.closest('.auth-form');
  const email = getInputValue(form, 'input[name="email"]') || getInputValue(form, 'input[type="email"]');
  const password = getInputValue(form, 'input[name="password"]') || getInputValue(form, 'input[type="password"]');

  try {
    const res = await fetch('login.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',         
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (!data.ok) {
      alert(data.error || 'Login failed.');
      return;
    }
    window.location.assign('dashboard_julbert.html');
  } catch (err) {
    console.error(err);
    alert('Network error. Please try again.');
  }
}

async function handleSignup(event) {
  event.preventDefault();
  const form = event.target.closest('.auth-form');

  const full_name       = getInputValue(form, 'input[name="full_name"]');
  const username        = getInputValue(form, 'input[name="username"]');
  const email           = getInputValue(form, 'input[name="email"]');
  const contact_number  = getInputValue(form, 'input[name="contact_number"]');
  const password        = form.querySelectorAll('input[type="password"]')[0]?.value || '';
  const confirm_password= form.querySelectorAll('input[type="password"]')[1]?.value || '';

  try {
    const res = await fetch('register.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',         
      body: JSON.stringify({ full_name, email, username, contact_number, password, confirm_password })
    });
    const data = await res.json();

    if (!data.ok) {
      alert(data.error || 'Sign up failed.');
      return;
    }

    window.location.assign('dashboard_julbert.html');
  } catch (err) {
    console.error(err);
    alert('Network error. Please try again.');
  }
}
