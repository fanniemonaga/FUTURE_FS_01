/* ── SCROLL PROGRESS & NAV ── */
window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    document.getElementById('scrollProgress').style.width = (window.scrollY / h * 100) + '%';
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
});

/* ── MOBILE NAV TOGGLE ── */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

/* ── SCROLL REVEAL ── */
const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) setTimeout(() => entry.target.classList.add('visible'), i * 80);
    });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ── EMAILJS INIT ── */
(function () {
    try { emailjs.init("L-CdBwscS4yN0oxz5"); } catch (e) {}
})();

/* ── CONTACT FORM ── */
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formResponse = document.getElementById('formResponse');
const nameInput = form.querySelector('[name="user_name"]');
const emailInput = form.querySelector('[name="user_email"]');
const phoneInput = form.querySelector('[name="user_phone"]');
const msgInput = form.querySelector('[name="message"]');

function validateEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function validatePhone(v) { return /^[0-9]{10,15}$/.test(v.replace(/\s/g, '')); }

function setValidity(input, errId, valid) {
    input.classList.toggle('is-valid', valid);
    input.classList.toggle('is-invalid', !valid);
    const el = document.getElementById(errId);
    if (el) el.classList.toggle('show', !valid);
}

nameInput.addEventListener('input', () => setValidity(nameInput, 'nameErr', nameInput.value.trim().length >= 2));
emailInput.addEventListener('input', () => setValidity(emailInput, 'emailErr', validateEmail(emailInput.value)));
phoneInput.addEventListener('input', () => setValidity(phoneInput, 'phoneErr', validatePhone(phoneInput.value)));
msgInput.addEventListener('input', () => setValidity(msgInput, 'msgErr', msgInput.value.trim().length >= 10));

form.addEventListener('submit', e => {
    e.preventDefault();
    const nameOk  = nameInput.value.trim().length >= 2;
    const emailOk = validateEmail(emailInput.value);
    const phoneOk = validatePhone(phoneInput.value);
    const msgOk   = msgInput.value.trim().length >= 10;

    setValidity(nameInput,  'nameErr',  nameOk);
    setValidity(emailInput, 'emailErr', emailOk);
    setValidity(phoneInput, 'phoneErr', phoneOk);
    setValidity(msgInput,   'msgErr',   msgOk);

    if (!nameOk || !emailOk || !phoneOk || !msgOk) return;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Sending...</span>';
    formResponse.style.color = 'rgba(255,255,255,0.5)';
    formResponse.textContent = 'Sending your message…';

    emailjs.send("service_j2j9co9", "template_hl18ota", {
        user_name:  nameInput.value,
        user_email: emailInput.value,
        user_phone: phoneInput.value,
        message:    msgInput.value
    }).then(() => {
        formResponse.style.color = '#4ade80';
        formResponse.textContent = "✓ Message sent! I'll get back to you soon.";
        form.reset();
        [nameInput, emailInput, phoneInput, msgInput].forEach(i => i.classList.remove('is-valid', 'is-invalid'));
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
        setTimeout(() => formResponse.textContent = '', 5000);
    }, () => {
        formResponse.style.color = '#ff6b6b';
        formResponse.textContent = '✗ Failed to send. Please try WhatsApp instead.';
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
    });
});

/* ── DEVTOOLS PROTECTION ── */
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
    if (
        e.key === 'F12' ||
        (e.ctrlKey && e.key === 'u') ||
        (e.ctrlKey && e.key === 's') ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C')
    ) {
        e.preventDefault();
        return false;
    }
});
document.addEventListener('selectstart', e => e.preventDefault());
document.addEventListener('dragstart',   e => e.preventDefault());

const devToolsCheck = () => {
    const threshold = 160;
    if (
        window.outerWidth  - window.innerWidth  > threshold ||
        window.outerHeight - window.innerHeight > threshold
    ) {
        document.body.innerHTML =
            '<div style="display:flex;align-items:center;justify-content:center;min-height:100vh;width:100%;background:#0a0f1e;color:#f97316;font-family:sans-serif;font-size:clamp(1rem,4vw,1.5rem);text-align:center;padding:20px;box-sizing:border-box;">🚫 Access Denied — Developer Tools Not Allowed</div>';
    }
};
window.addEventListener('resize', devToolsCheck);
