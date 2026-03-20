
function showPage(pageId, scrollTo) {
document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
const target = document.getElementById(pageId);
if (target) target.classList.add('active');

window.scrollTo({ top: 0, behavior: 'smooth' });

document.querySelectorAll('.nav-links a[data-page]').forEach(a => {
a.classList.remove('current');
if (a.getAttribute('data-page') === pageId) a.classList.add('current');
});

if (scrollTo) {
setTimeout(() => {
const el = document.getElementById(scrollTo);
if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}, 120);
}

setTimeout(initObserver, 160);
}

function toggleMobile() {
document.getElementById('mobileMenu').classList.toggle('open');
}

document.addEventListener('click', (e) => {
const menu = document.getElementById('mobileMenu');
const hamburger = document.getElementById('hamburger');

if (menu && menu.classList.contains('open') &&
!menu.contains(e.target) && !hamburger.contains(e.target)) {
menu.classList.remove('open');
}
});

function initObserver() {
const obs = new IntersectionObserver((entries) => {
entries.forEach(e => {
if (e.isIntersecting) {
const delay = parseInt(e.target.dataset.delay || 0);
setTimeout(() => e.target.classList.add('visible'), delay);
obs.unobserve(e.target);
}
});
}, { threshold: 0.1 });

document.querySelectorAll('.page.active .fade-up:not(.visible)').forEach((el, i) => {
el.dataset.delay = (i % 6) * 80;
obs.observe(el);
});
}

document.addEventListener('DOMContentLoaded', initObserver);

async function handleFormSubmit(e) {
e.preventDefault();

const form    = document.getElementById('contactForm');
const btn     = document.getElementById('submitBtn');
const success = document.getElementById('formSuccess');
const inner   = document.getElementById('contactFormInner');

btn.textContent = 'Sending...';
btn.disabled = true;

try {
const data = new FormData(form);
const res  = await fetch(form.action, {
method: 'POST',
body: data,
headers: { 'Accept': 'application/json' }
});

```
if (res.ok) {
  inner.style.display = 'none';
  success.style.display = 'block';
  form.reset();
} else {
  alert('⚠️ Something went wrong.');
  btn.textContent = 'Send Message →';
  btn.disabled = false;
}
```

} catch (err) {
alert('⚠️ Network error.');
btn.textContent = 'Send Message →';
btn.disabled = false;
}
}


function openRegModal() {
document.getElementById('regModal').classList.add('open');
document.body.style.overflow = 'hidden';
}

function closeRegModal(e) {
if (e.target === document.getElementById('regModal')) closeRegModalDirect();
}

function closeRegModalDirect() {
document.getElementById('regModal').classList.remove('open');
document.body.style.overflow = '';
document.getElementById('regFormWrap').style.display = 'block';
document.getElementById('regSuccess').style.display  = 'none';
document.getElementById('regForm').reset();

const btn = document.getElementById('regSubmitBtn');
if (btn) {
btn.textContent = 'Proceed to Payment →';
btn.disabled = false;
}
}

document.addEventListener('keydown', (e) => {
if (e.key === 'Escape') closeRegModalDirect();
});


async function handleRegistration(e) {
e.preventDefault();

const btn = document.getElementById('regSubmitBtn');
btn.textContent = 'Processing...';
btn.disabled = true;

const name  = document.getElementById('reg_name').value.trim();
const email = document.getElementById('reg_email').value.trim();
const phone = document.getElementById('reg_phone').value.trim();
const org   = document.getElementById('reg_org').value.trim();

document.getElementById('reg_success_name').textContent = name;
document.getElementById('regFormWrap').style.display = 'none';
document.getElementById('regSuccess').style.display  = 'block';

setTimeout(() => launchRazorpay({ name, email, phone, org }), 1200);
}


function launchRazorpay({ name, email, phone, org }) {

const options = {
key: 'rzp_live_STPFAP2x6YsqM2',
amount: 499900,
currency: 'INR',
name: 'StepAhead Excellence',
description: 'DevOps Mastery — Batch 3',

prefill: {
  name: name,
  email: email,
  contact: phone.replace(/\s+/g, '')
},

notes: {
  organisation: org
},

theme: { color: '#0f4c91' },


handler: async function(response) {

  try {
    const fd = new FormData();
    fd.append('_subject', 'CONFIRMED ENROLLMENT — DevOps Batch 3');
    fd.append('name', name);
    fd.append('email', email);
    fd.append('phone', phone);
    fd.append('organisation', org);
    fd.append('payment_id', response.razorpay_payment_id);

    await fetch('https://formspree.io/f/xreyggek', {
      method: 'POST',
      body: fd,
      headers: { 'Accept': 'application/json' }
    });

  } catch (err) {
    console.warn('Email failed:', err);
  }

  closeRegModalDirect();
  showPaymentSuccess(name, response.razorpay_payment_id);
},

modal: {
  ondismiss: function() {
    document.getElementById('regModal').classList.add('open');
    document.getElementById('regFormWrap').style.display = 'block';
    document.getElementById('regSuccess').style.display  = 'none';

    const btn = document.getElementById('regSubmitBtn');
    btn.textContent = 'Proceed to Payment →';
    btn.disabled = false;
  }
}

};

if (typeof Razorpay === 'undefined') {
alert('Payment gateway not available');
closeRegModalDirect();
return;
}

new Razorpay(options).open();
}


function showPaymentSuccess(name, paymentId) {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(10,22,40,0.88);backdrop-filter:blur(12px);display:flex;align-items:center;justify-content:center;padding:24px;';
  overlay.innerHTML = `
    <div style="background:#fff;border-radius:24px;padding:52px 44px;max-width:480px;width:100%;text-align:center;box-shadow:0 32px 80px rgba(0,0,0,0.4);">
      <div style="font-size:3.5rem;margin-bottom:18px;">🎉</div>
      <h2 style="font-family:'Syne',sans-serif;font-size:1.6rem;font-weight:800;color:#0f4c91;margin-bottom:12px;">You're In, ${name}!</h2>
      <p style="font-size:0.95rem;color:#374151;line-height:1.75;margin-bottom:8px;">
        Your enrollment for <strong>DevOps Mastery Batch 3</strong> is confirmed.<br>
        Payment ID: <code style="background:#f0f4ff;padding:3px 8px;border-radius:6px;font-size:0.82rem;">${paymentId || 'Confirmed'}</code>
      </p>
      <p style="font-size:0.88rem;color:#6b7280;margin-bottom:28px;line-height:1.7;">
        Our team will reach out within 24 hours with onboarding details.<br>
        Questions? Call <strong>+91 7899151988</strong>
      </p>
      <button id="successCloseBtn" style="background:linear-gradient(135deg,#0f4c91,#1a6fd4);color:#fff;border:none;padding:14px 36px;border-radius:10px;font-size:0.95rem;font-weight:700;cursor:pointer;">
        Got it, Thanks! 🚀
      </button>
    </div>
  `;
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
  overlay.querySelector('#successCloseBtn').addEventListener('click', () => {
    overlay.remove();
    document.body.style.overflow = '';
  });
}
