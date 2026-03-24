// =============================================
//  SCROLL LOCK ROBUSTE POUR iOS SAFARI
//  Technique position:fixed — empêche le scroll
//  sur iOS sans les bugs de overflow:hidden
// =============================================
var _scrollY = 0;

function lockScroll() {
    _scrollY = window.pageYOffset;
    document.body.style.top = '-' + _scrollY + 'px';
    document.body.classList.add('scroll-locked');
}

function unlockScroll() {
    document.body.classList.remove('scroll-locked');
    document.body.style.top = '';
    window.scrollTo(0, _scrollY);
}

// Toujours remettre en haut au chargement
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

document.addEventListener('DOMContentLoaded', function () {
    window.scrollTo(0, 0);
    // Verrouille le scroll pendant l'enveloppe
    lockScroll();
});

// =============================================
//  ANIMATION D'OUVERTURE DE L'ENVELOPPE
// =============================================
var envelopeOverlay = document.getElementById('envelopeOverlay');
var envelope = document.getElementById('envelope');
var instruction = document.getElementById('instruction');
var mainSite = document.getElementById('mainSite');

if (envelopeOverlay && envelope) {
    var isOpening = false;

    envelopeOverlay.addEventListener('click', function () {
        if (isOpening) return;
        isOpening = true;

        // 1. Ouvre l'enveloppe
        envelope.classList.add('opened');
        if (instruction) instruction.style.opacity = '0';

        // 2. Sort la carte
        setTimeout(function () {
            envelope.classList.add('pull-out');
        }, 800);

        // 3. Zoom sur la carte
        setTimeout(function () {
            envelope.classList.add('zooming');
        }, 1500);

        // 4. Disparition de l'enveloppe + apparition du faire-part
        setTimeout(function () {
            // Masque l'overlay
            envelopeOverlay.style.display = 'none';
            // Déverrouille le scroll (technique iOS)
            unlockScroll();
            // S'assure qu'on est bien en haut
            window.scrollTo(0, 0);
            // Révèle le site
            if (mainSite) mainSite.classList.add('revealed');
        }, 2200);
    });
}

// =============================================
//  CHOIX ITINÉRAIRE (Maps natif ou Waze)
// =============================================
function getOS() {
    var ua = navigator.userAgent;
    if (/iPad|iPhone|iPod/.test(ua)) return 'ios';
    if (/android/i.test(ua)) return 'android';
    return 'other';
}

var DEST_APPLE  = 'https://maps.apple.com/?q=Ch%C3%A2teau+Barth%C3%A9l%C3%A9my&address=Route+Nationale+191%2C+78660+Paray-Douaville&dirflg=d';
var DEST_GOOGLE = 'https://www.google.com/maps/dir/?api=1&destination=Chateau+Barthelemy+Route+Nationale+191+78660+Paray-Douaville';
var DEST_WAZE   = 'https://waze.com/ul?q=Chateau+Barthelemy+Paray-Douaville&navigate=yes';

function openMapsChoice() {
    var os = getOS();
    var nativeBtn = document.getElementById('btn-maps-native');
    var label = document.getElementById('btn-maps-label');

    if (os === 'ios') {
        label.textContent = 'Apple Maps';
        nativeBtn.onclick = function () { window.open(DEST_APPLE, '_blank'); closeMapsModal(); };
    } else {
        label.textContent = 'Google Maps';
        nativeBtn.onclick = function () { window.open(DEST_GOOGLE, '_blank'); closeMapsModal(); };
    }

    document.getElementById('mapsModal').classList.add('show');
}

function closeMapsModal() {
    document.getElementById('mapsModal').classList.remove('show');
}

document.addEventListener('DOMContentLoaded', function () {
    var wazeBtn = document.getElementById('btn-maps-waze');
    if (wazeBtn) {
        wazeBtn.onclick = function () { window.open(DEST_WAZE, '_blank'); closeMapsModal(); };
    }
    var closeBtn = document.getElementById('mapsModalClose');
    if (closeBtn) closeBtn.addEventListener('click', closeMapsModal);
    var backdrop = document.getElementById('mapsModalBackdrop');
    if (backdrop) backdrop.addEventListener('click', closeMapsModal);
});

// =============================================
//  COUNTDOWN VERS LE 31 MAI 2026 À 16H30
// =============================================
function updateCountdown() {
    var wedding = new Date('2026-05-31T16:30:00').getTime();
    var now = new Date().getTime();
    var diff = wedding - now;

    var dEl = document.getElementById('cd-days');
    var hEl = document.getElementById('cd-hours');
    var mEl = document.getElementById('cd-mins');
    var sEl = document.getElementById('cd-secs');

    if (diff <= 0) {
        if (dEl) dEl.textContent = '0';
        if (hEl) hEl.textContent = '0';
        if (mEl) mEl.textContent = '0';
        if (sEl) sEl.textContent = '0';
        return;
    }

    if (dEl) dEl.textContent = Math.floor(diff / 86400000);
    if (hEl) hEl.textContent = Math.floor((diff % 86400000) / 3600000);
    if (mEl) mEl.textContent = Math.floor((diff % 3600000) / 60000);
    if (sEl) sEl.textContent = Math.floor((diff % 60000) / 1000);
}

updateCountdown();
setInterval(updateCountdown, 1000);

// =============================================
//  ANIMATIONS AU SCROLL (IntersectionObserver)
// =============================================
document.addEventListener('DOMContentLoaded', function () {

    // Noms & esperluette
    var nameObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0 });

    document.querySelectorAll('.name-left, .name-right, .ampersand')
        .forEach(function (el) { nameObserver.observe(el); });

    // Cards — apparaissent au scroll
    var cardObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('card-visible');
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0 });

    document.querySelectorAll('.card-elegant')
        .forEach(function (card) { cardObserver.observe(card); });
});

// =============================================
//  GESTION DU FORMULAIRE RSVP
// =============================================
document.addEventListener('DOMContentLoaded', function () {

    var presentRadios = document.querySelectorAll('input[name="presence"]');
    var nbPersonnesContainer = document.getElementById('nb_personnes_container');
    var nbPersonnesInput = document.getElementById('nombre');

    if (nbPersonnesContainer) {
        nbPersonnesContainer.classList.remove('hidden');
    }

    presentRadios.forEach(function (radio) {
        radio.addEventListener('change', function () {
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

    // Toast notification
    function showToast(message, type) {
        type = type || 'success';
        var container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            document.body.appendChild(container);
        }
        var toast = document.createElement('div');
        toast.className = 'toast ' + type;
        var icon = type === 'success'
            ? '<i class="bi bi-check-circle-fill"></i>'
            : '<i class="bi bi-exclamation-triangle-fill"></i>';
        toast.innerHTML = '<span class="toast-icon">' + icon + '</span><span class="toast-message">' + message + '</span>';
        container.appendChild(toast);
        requestAnimationFrame(function () { toast.classList.add('show'); });
        setTimeout(function () {
            toast.classList.remove('show');
            setTimeout(function () { toast.remove(); }, 400);
        }, 4000);
    }

    // Soumission RSVP
    var rsvpForm = document.getElementById('rsvp-form');

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var scriptURL = 'https://script.google.com/macros/s/AKfycbxJEXijLNicmvGf-PDgMSdMtOgxAJEDArBTjEfJmu7C8I9tS_LxJz3jIdF98Sa0eV6NQw/exec';
            var btn = document.getElementById('submit-btn');
            var originalText = btn.innerHTML;
            btn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Envoi...';
            btn.disabled = true;

            var presenceChecked = document.querySelector('input[name="presence"]:checked');
            var payload = {
                prenom: document.getElementById('prenom').value,
                nom: document.getElementById('nom').value,
                famille: (document.querySelector('input[name="famille"]:checked') || {}).value || '',
                presence: presenceChecked ? presenceChecked.value : '',
                nombre: (presenceChecked && presenceChecked.value === 'oui')
                    ? (parseInt(document.getElementById('nombre').value, 10) || 1)
                    : 0,
                message: document.getElementById('message').value,
                date: new Date().toISOString()
            };

            fetch(scriptURL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }).then(function () {
                btn.innerHTML = '<i class="bi bi-check-lg me-2"></i>Envoyé !';
                rsvpForm.reset();
                var modal = document.getElementById('successModal');
                if (modal) modal.classList.add('show');
                if (nbPersonnesContainer) nbPersonnesContainer.classList.remove('hidden');
                setTimeout(function () { btn.innerHTML = originalText; btn.disabled = false; }, 2000);
            }).catch(function () {
                showToast('Impossible de se connecter au serveur.', 'error');
                btn.innerHTML = originalText;
                btn.disabled = false;
            });
        });
    }

    // Fermeture modale succès
    var closeBtn = document.getElementById('successClose');
    var modalBackdrop = document.getElementById('successModalBackdrop');

    if (closeBtn) {
        closeBtn.addEventListener('click', function () {
            document.getElementById('successModal').classList.remove('show');
        });
    }
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', function () {
            document.getElementById('successModal').classList.remove('show');
        });
    }
});
