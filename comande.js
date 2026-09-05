// King Essen Configuration
const WHATSAPP_NUMBER = "2250000000000"; // Remplacez par le vrai numéro WhatsApp de King Essen

// State
let cart = JSON.parse(localStorage.getItem('king_essen_cart')) || [];
let currentMode = 'delivery'; // 'delivery' or 'pickup'
let deliveryFee = 1500;

// DOM Elements
const emptyCartView = document.getElementById('emptyCartView');
const checkoutView = document.getElementById('checkoutView');
const cartItemsList = document.getElementById('cartItemsList');

const subtotalDisplay = document.getElementById('subtotalDisplay');
const deliveryFeeDisplay = document.getElementById('deliveryFeeDisplay');
const grandTotalDisplay = document.getElementById('grandTotalDisplay');

const btnClearCart = document.getElementById('btnClearCart');
const btnSubmitWhatsApp = document.getElementById('btnSubmitWhatsApp');

const modeDeliveryLabel = document.getElementById('modeDeliveryLabel');
const modePickupLabel = document.getElementById('modePickupLabel');
const deliveryFieldsGroup = document.getElementById('deliveryFieldsGroup');
const communeSelect = document.getElementById('communeSelect');

const successModal = document.getElementById('successModal');
const btnCloseModal = document.getElementById('btnCloseModal');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderCheckout();
    setupEventListeners();
});

// Render Cart & Totals
function renderCheckout() {
    if (cart.length === 0) {
        checkoutView.classList.add('hidden');
        emptyCartView.classList.remove('hidden');
        return;
    }

    checkoutView.classList.remove('hidden');
    emptyCartView.classList.add('hidden');

    // Render items list
    cartItemsList.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.title}" class="item-thumb">
            <div class="item-info">
                <div class="item-title">${item.title}</div>
                <div class="item-side">Accompagnement : ${item.selectedSide || 'Frites Maison'}</div>
                <div class="item-price">${(item.price * item.quantity).toLocaleString('fr-FR')} FCFA</div>
            </div>
            <div class="item-controls">
                <div class="qty-btn-group">
                    <button onclick="updateQty(${item.id}, -1)"><i class="fa-solid fa-minus"></i></button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQty(${item.id}, 1)"><i class="fa-solid fa-plus"></i></button>
                </div>
                <button class="btn-remove-item" onclick="removeItem(${item.id})" title="Supprimer">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        </div>
    `).join('');

    calculateTotals();
}

// Calculate Subtotal & Grand Total
function calculateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (currentMode === 'pickup') {
        deliveryFee = 0;
    } else {
        const selectedOption = communeSelect.options[communeSelect.selectedIndex];
        deliveryFee = parseInt(selectedOption.getAttribute('data-fee'), 10) || 1500;
    }

    const grandTotal = subtotal + deliveryFee;

    subtotalDisplay.textContent = `${subtotal.toLocaleString('fr-FR')} FCFA`;
    deliveryFeeDisplay.textContent = `${deliveryFee.toLocaleString('fr-FR')} FCFA`;
    grandTotalDisplay.textContent = `${grandTotal.toLocaleString('fr-FR')} FCFA`;
}

// Quantity Adjustments
function updateQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        removeItem(id);
        return;
    }

    saveAndReload();
}

function removeItem(id) {
    cart = cart.filter(i => i.id !== id);
    saveAndReload();
}

function clearCart() {
    if (confirm("Voulez-vous vraiment vider l'ensemble de votre panier ?")) {
        cart = [];
        saveAndReload();
    }
}

function saveAndReload() {
    localStorage.setItem('king_essen_cart', JSON.stringify(cart));
    renderCheckout();
}

// Event Listeners
function setupEventListeners() {
    // Mode switcher
    modeDeliveryLabel.addEventListener('click', () => {
        currentMode = 'delivery';
        modeDeliveryLabel.classList.add('active');
        modePickupLabel.classList.remove('active');
        deliveryFieldsGroup.classList.remove('hidden');
        calculateTotals();
    });

    modePickupLabel.addEventListener('click', () => {
        currentMode = 'pickup';
        modePickupLabel.classList.add('active');
        modeDeliveryLabel.classList.remove('active');
        deliveryFieldsGroup.classList.add('hidden');
        calculateTotals();
    });

    // Commune fee change
    communeSelect.addEventListener('change', calculateTotals);

    // Clear cart button
    btnClearCart.addEventListener('click', clearCart);

    // WhatsApp Submit
    btnSubmitWhatsApp.addEventListener('click', processOrderToWhatsApp);

    // Modal close
    btnCloseModal.addEventListener('click', () => {
        successModal.classList.remove('active');
        window.location.href = 'catalogue.html';
    });
}

// Generate WhatsApp Message & Redirect
function processOrderToWhatsApp() {
    const fullName = document.getElementById('fullName').value.trim();
    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    const deliveryTime = document.getElementById('deliveryTime').value;
    const notes = document.getElementById('orderNotes').value.trim() || 'Aucune';

    // Form Validation
    if (!fullName || !phoneNumber) {
        alert("Veuillez remplir votre nom et votre numéro de téléphone.");
        return;
    }

    let addressString = "Pick-up en restaurant";
    if (currentMode === 'delivery') {
        const commune = communeSelect.value;
        const details = document.getElementById('addressDetails').value.trim();
        if (!details) {
            alert("Veuillez préciser votre quartier et un point de repère précis pour le livreur.");
            return;
        }
        addressString = `${commune}, ${details}`;
    }

    const modeText = currentMode === 'delivery' ? 'Livraison à Domicile' : 'À emporter (Pick-up)';

    // Items details formatting
    const itemsFormatted = cart.map(item => {
        const sideText = item.selectedSide ? ` (Option: ${item.selectedSide})` : '';
        const itemTotal = (item.price * item.quantity).toLocaleString('fr-FR');
        return `• ${item.quantity}x ${item.title}${sideText} - ${itemTotal} FCFA`;
    }).join('\n');

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const grandTotal = subtotal + deliveryFee;

    // Structured WhatsApp Message Template
    const message = 
`--------------------------------------------------
👑 *NOUVELLE COMMANDE - KING ESSEN* 👑
--------------------------------------------------
👤 *CLIENT :* ${fullName}
📞 *TEL :* ${phoneNumber}
📍 *MODE :* ${modeText}
🏡 *ADRESSE :* ${addressString}
⏰ *HEURE :* ${deliveryTime}

📋 *DÉTAIL DE LA COMMANDE :*
${itemsFormatted}

--------------------------------------------------
💵 *TOTAL DÉTAILLÉ :*
- Sous-total plats : ${subtotal.toLocaleString('fr-FR')} FCFA
- Frais de livraison : ${deliveryFee.toLocaleString('fr-FR')} FCFA
💰 *TOTAL À PAYER :* ${grandTotal.toLocaleString('fr-FR')} FCFA
--------------------------------------------------
💬 *Note :* ${notes}
--------------------------------------------------`;

    // Clear cart state after successful trigger
    localStorage.removeItem('king_essen_cart');

    // Open WhatsApp
    const encodedUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(encodedUrl, '_blank');

    // Show Confirmation Modal
    successModal.classList.add('active');
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