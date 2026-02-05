import './style.css'

document.querySelector('#app').innerHTML = `
<!-- Main Content Area -->
`

// Mobile Menu Logic
const hamburger = document.querySelector('.hamburger-menu');
const drawer = document.querySelector('.mobile-nav-drawer');
const overlay = document.querySelector('.mobile-nav-overlay');

function toggleMenu() {
    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
        drawer.classList.remove('open');
        overlay.classList.remove('open');
    } else {
        drawer.classList.add('open');
        overlay.classList.add('open');
    }
}

if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);
}
