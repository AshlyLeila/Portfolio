const track = document.querySelector('.track');
const viewport = document.querySelector('.viewport');
const tabs = document.querySelectorAll('.tab');
const dots = document.querySelectorAll('.dot'); // optionnel : marche aussi sans points
const pill = document.querySelector('.pill');
const total = tabs.length;
let index = 0;

function goTo(i) {
    index = Math.max(0, Math.min(total - 1, i));
    track.style.transform = `translateX(${-index * 100}%)`;
    pill.style.transform = `translateX(${index * 100}%)`;
    tabs.forEach((t, k) => t.setAttribute('aria-selected', k === index));
    dots.forEach((d, k) => d.classList.toggle('active', k === index));
}

// 1) Clic sur un onglet
tabs.forEach((tab, i) => tab.addEventListener('click', () => goTo(i)));

// 2) Swipe (doigt ou souris)
let startX = 0;
let dx = 0;
let pressed = false;
let dragging = false;

viewport.addEventListener('pointerdown', e => {
    pressed = true;
    dragging = false;
    startX = e.clientX;
    dx = 0;
});

viewport.addEventListener('pointermove', e => {
    if (!pressed) return;
    dx = e.clientX - startX;

    // On ne commence à glisser qu'après 6px, pour ne pas bloquer les clics sur les boutons
    if (!dragging && Math.abs(dx) > 6) {
        dragging = true;
        track.classList.add('dragging');
        viewport.setPointerCapture(e.pointerId);
    }
    if (dragging) {
        const percent = (dx / viewport.offsetWidth) * 100;
        track.style.transform = `translateX(${-index * 100 + percent}%)`;
    }
});

function endDrag() {
    if (!pressed) return;
    pressed = false;
    if (!dragging) return;
    dragging = false;
    track.classList.remove('dragging');
    const threshold = viewport.offsetWidth * 0.2; // 20 % de la largeur
    if (dx < -threshold) goTo(index + 1);
    else if (dx > threshold) goTo(index - 1);
    else goTo(index);
}
viewport.addEventListener('pointerup', endDrag);
viewport.addEventListener('pointercancel', endDrag);

// Empêche le glisser-déposer natif des images
viewport.addEventListener('dragstart', e => e.preventDefault());

// 3) Flèches du clavier
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') goTo(index + 1);
    if (e.key === 'ArrowLeft') goTo(index - 1);
});