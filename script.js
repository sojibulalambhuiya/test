// Mobile Menu Toggle
const navToggle = document.getElementById('navToggle');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    document.body.classList.toggle('menu-open');
    const open = document.body.classList.contains('menu-open');
    navToggle.setAttribute('aria-expanded', open);
  });
  document.querySelectorAll('.mobile-panel a').forEach(a => {
    a.addEventListener('click', () => document.body.classList.remove('menu-open'));
  });
}

// Scroll Shadow
const nav = document.getElementById('siteNav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// Reveal on Scroll
const reveals = document.querySelectorAll('.reveal');
if (reveals.length) {
  const ro = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        ro.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(r => ro.observe(r));
}

// Contact Form Handler via Web3Forms
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const btn = document.getElementById('sendBtn');
    const note = document.getElementById('formNote');
    const originalLabel = 'Send message';

    btn.disabled = true;
    btn.textContent = 'Sending…';

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: '3f268e0b-4599-4acf-b3c9-e40d1102facc',
        name: name,
        email: email,
        message: message,
        from_name: name,
        subject: `New portfolio inquiry from ${name}`
      })
    })
    .then(async (response) => {
      const data = await response.json();
      if (response.status === 200) {
        btn.textContent = 'Message sent ✓';
        note.textContent = "Thanks — I'll get back to you soon.";
        note.style.color = '#10B981';
        contactForm.reset();
        setTimeout(() => {
          btn.disabled = false;
          btn.textContent = originalLabel;
        }, 4000);
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    })
    .catch((err) => {
      console.error('Submission error:', err);
      btn.disabled = false;
      btn.textContent = originalLabel;
      note.textContent = 'Could not send directly — opening your email app instead.';
      note.style.color = '#EF4444';

      const subject = encodeURIComponent('Portfolio message from ' + name);
      const body = encodeURIComponent(message + '\n\n— ' + name + ' (' + email + ')');
      window.location.href = 'mailto:hello@sojibulalambhuiya.com.bd?subject=' + subject + '&body=' + body;
    });
  });
}

// Auto-calculated durations
function monthsInclusive(start, end) {
  const [sy, sm] = start.split('-').map(Number);
  let ey, em;
  if (end) {
    [ey, em] = end.split('-').map(Number);
  } else {
    const now = new Date();
    ey = now.getFullYear();
    em = now.getMonth() + 1;
  }
  return (ey - sy) * 12 + (em - sm) + 1;
}

function formatDuration(total) {
  const y = Math.floor(total / 12);
  const m = total % 12;
  const parts = [];
  if (y) parts.push(y + ' ' + (y === 1 ? 'yr' : 'yrs'));
  if (m || !y) parts.push(m + ' ' + (m === 1 ? 'mo' : 'mos'));
  return parts.join(' ');
}

document.querySelectorAll('[data-start]').forEach(el => {
  el.textContent = formatDuration(monthsInclusive(el.dataset.start, el.dataset.end));
});
