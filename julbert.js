let currentModal = 'login';

function openAuthModal() {
  const modal = document.getElementById('authModal');
  if (modal) {
    modal.classList.add('active');
    showAuthForm('login');
  }
}

function closeAuthModal(event) {
  if (event && event.target !== event.currentTarget) return;
  
  const modal = document.getElementById('authModal');
  if (modal) {
    modal.classList.remove('active');
  }
}

function showAuthForm(type) {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  
  if (type === 'login') {
    if (loginForm) loginForm.style.display = 'block';
    if (signupForm) signupForm.style.display = 'none';
    currentModal = 'login';
  } else if (type === 'signup') {
    if (loginForm) loginForm.style.display = 'none';
    if (signupForm) signupForm.style.display = 'block';
    currentModal = 'signup';
  }
}

function switchToSignup(event) {
  event.preventDefault();
  showAuthForm('signup');
}

function switchToLogin(event) {
  event.preventDefault();
  showAuthForm('login');
}

async function handleLogin(event) {
  event.preventDefault();
  
  const form = event.target;
  const formData = new FormData(form);
  const data = {
    email: formData.get('email'),
    password: formData.get('password')
  };

  try {
    const response = await fetch('login.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include'
    });

    const result = await response.json();
    
    if (result.ok) {
      window.location.href = 'dashboard_julbert.html';
    } else {
      alert(result.error || 'Login failed. Please try again.');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('An error occurred during login. Please try again.');
  }
}

async function handleSignup(event) {
  event.preventDefault();
  
  const form = event.target;
  const formData = new FormData(form);
  
  const password = formData.get('password');
  const confirmPassword = formData.get('confirm_password');
  
  if (password !== confirmPassword) {
    alert('Passwords do not match.');
    return;
  }

  const data = {
    full_name: formData.get('full_name'),
    username: formData.get('username'),
    email: formData.get('email'),
    contact_number: formData.get('contact_number'),
    password: password,
    confirm_password: confirmPassword
  };

  try {
    const response = await fetch('register.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include'
    });

    const result = await response.json();
    
    if (result.ok) {
      alert(result.message || 'Account created successfully!');
      window.location.href = 'dashboard_julbert.html';
    } else {
      alert(result.error || 'Registration failed. Please try again.');
    }
  } catch (error) {
    console.error('Registration error:', error);
    alert('An error occurred during registration. Please try again.');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeAuthModal();
    }
  });
});
