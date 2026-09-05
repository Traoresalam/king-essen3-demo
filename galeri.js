// Global State
let activeCards = [];
let currentIndex = 0;

// DOM Elements
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryCards = Array.from(document.querySelectorAll('.gallery-card'));

const lightboxModal = document.getElementById('lightboxModal');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxDesc = document.getElementById('lightboxDesc');
const lightboxActionContainer = document.getElementById('lightboxActionContainer');

const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateActiveCards();
    setupFilters();
    setupLightbox();
    setupTouchSwipe();
});

// Update list of currently visible cards based on active filter
function updateActiveCards() {
    activeCards = galleryCards.filter(card => !card.classList.contains('hidden'));
}

// Dynamic Filtering Engine
function setupFilters() {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            galleryCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });

            updateActiveCards();
        });
    });
}

// Lightbox Core Functionality
function setupLightbox() {
    galleryCards.forEach(card => {
        card.addEventListener('click', () => {
            currentIndex = activeCards.indexOf(card);
            if (currentIndex !== -1) {
                openLightbox();
            }
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', showPrevImage);
    lightboxNext.addEventListener('click', showNextImage);

    // Close on overlay click
    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightboxModal.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
    });
}

function openLightbox() {
    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    lightboxModal.focus();
    updateLightboxContent();
}

function closeLightbox() {
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
}

function showPrevImage() {
    currentIndex = (currentIndex - 1 + activeCards.length) % activeCards.length;
    updateLightboxContent();
}

function showNextImage() {
    currentIndex = (currentIndex + 1) % activeCards.length;
    updateLightboxContent();
}

// Render dynamic image content and call-to-action button
function updateLightboxContent() {
    const currentCard = activeCards[currentIndex];
    if (!currentCard) return;

    const imgElement = currentCard.querySelector('img');
    const titleElement = currentCard.querySelector('.card-title');
    const descElement = currentCard.querySelector('.card-desc');

    const actionType = currentCard.getAttribute('data-action-type');
    const actionTarget = currentCard.getAttribute('data-action-target');

    lightboxImg.src = imgElement.src;
    lightboxImg.alt = imgElement.alt;
    lightboxTitle.textContent = titleElement.textContent;
    lightboxDesc.textContent = descElement.textContent;

    // Generate Contextual Action Button
    lightboxActionContainer.innerHTML = '';
    if (actionType === 'reserve') {
        lightboxActionContainer.innerHTML = `
            <a href="reservation.html" class="btn-cta-gold" style="padding: 10px 20px; font-size: 0.85rem;">
                <i class="fa-solid fa-chair"></i> Réserver pour la zone ${actionTarget}
            </a>
        `;
    } else if (actionType === 'order') {
        lightboxActionContainer.innerHTML = `
            <a href="commande.html" class="btn-cta-whatsapp" style="padding: 10px 20px; font-size: 0.85rem;">
                <i class="fa-brands fa-whatsapp"></i> Commander ${actionTarget}
            </a>
        `;
    }
}

// Touch Swipe Navigation for Mobile Lightbox
function setupTouchSwipe() {
    let touchStartX = 0;
    let touchEndX = 0;

    lightboxModal.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightboxModal.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeDistance = touchEndX - touchStartX;
        if (Math.abs(swipeDistance) > 50) {
            if (swipeDistance < 0) {
                showNextImage(); // Swipe left
            } else {
                showPrevImage(); // Swipe right
            }
        }
    }
}