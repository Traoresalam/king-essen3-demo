// Gestion du Panier (Compteur)
let cartItemsCount = 0;
function addToCart() {
    cartItemsCount++;
    document.getElementById('cart-count').innerText = cartItemsCount;
}

// Filtres par Catégorie
const catTabs = document.querySelectorAll('.cat-tab');
const cards = document.querySelectorAll('.card-3d');

catTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        catTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const selectedCategory = tab.getAttribute('data-category');

        cards.forEach(card => {
            const cardCat = card.getAttribute('data-category');
            if (selectedCategory === 'all' || cardCat === selectedCategory) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// Recherche en Temps Réel
const searchInput = document.getElementById('search-input');
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    cards.forEach(card => {
        const name = card.getAttribute('data-name');
        const ingredients = card.getAttribute('data-ingredients');

        if (name.includes(query) || ingredients.includes(query)) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
});

// Modal 3D HD / Allergènes
const modalOverlay = document.getElementById('modal-overlay');

function openModal(title, imgSrc, desc, allergens, price) {
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-img').src = imgSrc;
    document.getElementById('modal-desc').innerText = desc;
    document.getElementById('modal-allergens').innerText = allergens;
    document.getElementById('modal-price').innerText = price;
    modalOverlay.classList.add('active');
}

function closeModal(event) {
    if (event.target === modalOverlay) {
        modalOverlay.classList.remove('active');
    }
}

function closeModalDirect() {
    modalOverlay.classList.remove('active');
}
// --- Gestion du Menu Burger Mobile ---
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-xmark');
            }
        });
    }
});