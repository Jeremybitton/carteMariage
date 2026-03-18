// Toujours remettre en haut au chargement (empêche la restauration du scroll par le navigateur)
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
document.addEventListener('DOMContentLoaded', function() {
    window.scrollTo(0, 0);
});

// === ANIMATION D'OUVERTURE DE L'ENVELOPPE ===
const envelopeOverlay = document.getElementById('envelopeOverlay');
const envelope = document.getElementById('envelope');
const instruction = document.getElementById('instruction');
const mainSite = document.getElementById('mainSite');

if (envelopeOverlay && envelope) {
    let isOpening = false;

    // Le clic fonctionne sur tout l'écran
    envelopeOverlay.addEventListener('click', function () {
        if (isOpening) return;
        isOpening = true;

        // 1. Ouvre l'enveloppe
        envelope.classList.add('opened');
        if (instruction) instruction.style.opacity = '0';

        // 2. Sort la carte
        setTimeout(function() {
            envelope.classList.add('pull-out');
        }, 800);

        // 3. Zoom sur la carte
        setTimeout(function() {
            envelope.classList.add('zooming');
        }, 1500);

        // 4. Disparition de l'enveloppe et apparition du faire-part
        setTimeout(function() {
            window.scrollTo(0, 0);
            // display:none direct — aucune transition CSS sur l'overlay
            // pour éviter tout bug de recomposition iOS Safari
            envelopeOverlay.style.display = 'none';
            if (mainSite) mainSite.classList.add('revealed');
            document.body.style.overflow = 'auto';
            document.documentElement.style.overflow = 'auto';
        }, 2200);
    });
}

// === COUNTDOWN VERS LE 31 MAI 2026 À 16H30 ===
function updateCountdown() {
    var wedding = new Date('2026-05-31T16:30:00').getTime();
    var now = new Date().getTime();
    var diff = wedding - now;

    if (diff <= 0) {
        if(document.getElementById('cd-days')) document.getElementById('cd-days').textContent = '0';
        if(document.getElementById('cd-hours')) document.getElementById('cd-hours').textContent = '0';
        if(document.getElementById('cd-mins')) document.getElementById('cd-mins').textContent = '0';
        if(document.getElementById('cd-secs')) document.getElementById('cd-secs').textContent = '0';
        return;
    }

    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    var secs = Math.floor((diff % (1000 * 60)) / 1000);

    if(document.getElementById('cd-days')) document.getElementById('cd-days').textContent = days;
    if(document.getElementById('cd-hours')) document.getElementById('cd-hours').textContent = hours;
    if(document.getElementById('cd-mins')) document.getElementById('cd-mins').textContent = mins;
    if(document.getElementById('cd-secs')) document.getElementById('cd-secs').textContent = secs;
}

updateCountdown();
setInterval(updateCountdown, 1000);

// === ANIMATION AU SCROLL ===
document.addEventListener("DOMContentLoaded", function() {
    // Noms & esperluette
    const nameObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0 });

    document.querySelectorAll('.name-left, .name-right, .ampersand')
        .forEach(el => nameObserver.observe(el));

    // Cards – apparaissent dès qu'elles entrent dans le viewport
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('card-visible');
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0 });

    document.querySelectorAll('.card-elegant').forEach(card => cardObserver.observe(card));
});

// === GESTION DU FORMULAIRE RSVP ===
document.addEventListener("DOMContentLoaded", function() {
    const presentRadios = document.querySelectorAll('input[name="presence"]');
    const nbPersonnesContainer = document.getElementById('nb_personnes_container');
    const nbPersonnesInput = document.getElementById('nombre');

    if (nbPersonnesContainer) {
        nbPersonnesContainer.classList.remove('hidden');
    }

    presentRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'non') {
                if (nbPersonnesContainer) nbPersonnesContainer.classList.add('hidden');
                if (nbPersonnesInput) nbPersonnesInput.value = '0';
            } else {
                if (nbPersonnesContainer) nbPersonnesContainer.classList.remove('hidden');
                if (nbPersonnesInput && (nbPersonnesInput.value === '0' || nbPersonnesInput.value === '')) {
                    nbPersonnesInput.value = '1';
                }
            }
        });
    });

    const rsvpForm = document.getElementById('rsvp-form');

    function showToast(message, type = 'success') {
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            document.body.appendChild(container);
        }
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        const icon = type === 'success' ? '<i class="bi bi-check-circle-fill"></i>' : '<i class="bi bi-exclamation-triangle-fill"></i>';
        toast.innerHTML = `<span class="toast-icon">${icon}</span><span class="toast-message">${message}</span>`;
        container.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('show'));
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    }

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const scriptURL = 'https://script.google.com/macros/s/AKfycbxJEXijLNicmvGf-PDgMSdMtOgxAJEDArBTjEfJmu7C8I9tS_LxJz3jIdF98Sa0eV6NQw/exec';
            const btn = document.getElementById('submit-btn');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Envoi...';
            btn.disabled = true;

            const payload = {
                prenom: document.getElementById('prenom').value,
                nom: document.getElementById('nom').value,
                famille: document.querySelector('input[name="famille"]:checked')?.value || "",
                presence: document.querySelector('input[name="presence"]:checked')?.value,
                nombre: document.querySelector('input[name="presence"]:checked')?.value === 'oui' ? (parseInt(document.getElementById('nombre').value, 10) || 1) : 0,
                message: document.getElementById('message').value,
                date: new Date().toISOString()
            };

            try {
                await fetch(scriptURL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                btn.innerHTML = '<i class="bi bi-check-lg me-2"></i>Envoyé !';
                rsvpForm.reset();
                // Modale de confirmation centrée
                const modal = document.getElementById('successModal');
                if (modal) modal.classList.add('show');
                if (nbPersonnesContainer) nbPersonnesContainer.classList.remove('hidden');
                setTimeout(() => { btn.innerHTML = originalText; btn.disabled = false; }, 2000);
            } catch (error) {
                showToast("Impossible de se connecter au serveur.", "error");
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        });
    }

    const closeBtn = document.getElementById('successClose');
    if (closeBtn) closeBtn.addEventListener('click', () => document.getElementById('successModal').classList.remove('show'));
    const modalBackdrop = document.getElementById('successModalBackdrop');
    if (modalBackdrop) modalBackdrop.addEventListener('click', () => document.getElementById('successModal').classList.remove('show'));
});