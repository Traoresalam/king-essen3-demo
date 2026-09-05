// Database Simulation: Dishes Catalog with 3D Image Assets
const products = [
    {
        id: 1,
        title: "Burger Signature King Essen",
        category: "signature",
        price: 8500,
        badges: ["chef", "popular"],
        description: "Double steak haché pur bœuf, fromage cheddar affiné, oignons caramélisés et sauce secrète King Essen dans un pain brioché artisanal.",
        ingredients: "Bœuf, Cheddar, Pain Brioché, Oignons, Sauce Spéciale",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        title: "Capitaine Braisé Royal",
        category: "fish",
        price: 12000,
        badges: ["chef"],
        description: "Poisson Capitaine entier braisé au feu de bois, mariné aux épices de la maison et servi avec des piments frais assaisonnés.",
        ingredients: "Poisson Capitaine, Épices Maison, Oignons, Piment, Citron",
        image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        title: "Brochettes de Filet de Bœuf",
        category: "grill",
        price: 9500,
        badges: ["popular"],
        description: "Tendre filet de bœuf mariné aux herbes fines et grillé à la perfection, accompagné de poivrons croquants.",
        ingredients: "Filet de Bœuf, Poivrons, Oignons Rouge, Marinade Épicée",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 4,
        title: "Choukouya de Mouton Épicé",
        category: "grill",
        price: 10000,
        badges: ["spicy"],
        description: "Viande de mouton assaisonnée au kankan d'exception, cuite à l'étouffée puis grillée à feu vif.",
        ingredients: "Mouton, Poudre de Kankan, Oignons, Piment En Poudre",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 5,
        title: "Gambas Géantes Grillées",
        category: "fish",
        price: 15000,
        badges: ["chef"],
        description: "Gambas royales saisies au beurre d'ail et persil frais, flambées au vin blanc.",
        ingredients: "Gambas, Beurre d'Ail, Persil, Citron Vert",
        image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 6,
        title: "Poulet Braisé l'Ivoirien",
        category: "grill",
        price: 7000,
        badges: ["popular"],
        description: "Demi-poulet fermier mariné 24h dans notre mélange d'épices locales et grillé lentement au charbon.",
        ingredients: "Poulet Fermier, Ail, Gingembre, Épices Africaines",
        image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 7,
        title: "Alloco Gourmet Extra",
        category: "sides",
        price: 2500,
        badges: [],
        description: "Bananes plantains mûres dorées à l'huile végétale, croustillantes à l'extérieur et fondantes à l'intérieur.",
        ingredients: "Banane Plantain, Pincée de Sel, Huile Végétale",
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 8,
        title: "Fondant au Chocolat & Glace Vanille",
        category: "desserts",
        price: 4500,
        badges: ["chef"],
        description: "Gâteau au chocolat intense avec cœur coulant, accompagné d'une boule de glace à la vanille de Madagascar.",
        ingredients: "Chocolat Noir, Vanille, Beurre, Œufs, Sucre",
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80"
    }
];

// State Management
let currentCart = JSON.parse(localStorage.getItem('king_essen_cart')) || [];
let activeCategory = 'all';
let maxPrice = 25000;
let searchQuery = '';
let currentSort = 'popular';
let quantities = {};

// DOM Elements
const catalogGrid = document.getElementById('catalogGrid');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const priceRange = document.getElementById('priceRange');
const priceDisplay = document.getElementById('priceDisplay');
const resultsCount = document.getElementById('resultsCount');
const categoryBtns = document.querySelectorAll('.category-btn');

const modal = document.getElementById('productModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalPrice = document.getElementById('modalPrice');
const modalDesc = document.getElementById('modalDesc');
const modalIngredients = document.getElementById('modalIngredients');
const modalAddBtn = document.getElementById('modalAddBtn');

const stickyCart = document.getElementById('stickyCart');
const cartBadge = document.getElementById('cartBadge');
const cartTotal = document.getElementById('cartTotal');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initQuantities();
    renderCatalog();
    updateCartUI();
    setupEventListeners();
});

// Initialize Quantities for each item
function initQuantities() {
    products.forEach(p => {
        quantities[p.id] = 1;
    });
}

// Render Products Grid
function renderCatalog() {
    let filtered = products.filter(item => {
        const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              item.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPrice = item.price <= maxPrice;
        return matchesCategory && matchesSearch && matchesPrice;
    });

    // Sort Products
    if (currentSort === 'asc') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'desc') {
        filtered.sort((a, b) => b.price - a.price);
    }

    resultsCount.textContent = `Affichage de ${filtered.length} plat(s)`;

    if (filtered.length === 0) {
        catalogGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
                <i class="fa-solid fa-utensils" style="font-size: 3rem; margin-bottom: 15px; color: var(--gold-primary);"></i>
                <p style="font-size: 1.1rem;">Aucun plat ne correspond à vos critères de recherche.</p>
            </div>
        `;
        return;
    }

    catalogGrid.innerHTML = filtered.map(item => `
        <div class="product-card">
            <div class="card-image-wrapper" onclick="openModal(${item.id})">
                <div class="badge-container">
                    ${item.badges.includes('chef') ? '<span class="badge chef"><i class="fa-solid fa-crown"></i> Chef</span>' : ''}
                    ${item.badges.includes('popular') ? '<span class="badge popular"><i class="fa-solid fa-fire"></i> Populaire</span>' : ''}
                    ${item.badges.includes('spicy') ? '<span class="badge spicy"><i class="fa-solid fa-pepper-hot"></i> Épicé</span>' : ''}
                </div>
                <img src="${item.image}" alt="${item.title}" loading="lazy">
            </div>
            
            <div class="card-body">
                <h3 class="product-title">${item.title}</h3>
                <p class="product-desc">${item.description}</p>
                <div class="product-price">${item.price.toLocaleString('fr-FR')} FCFA</div>
                
                <div class="card-actions">
                    <div class="quantity-control">
                        <button onclick="changeQty(${item.id}, -1)"><i class="fa-solid fa-minus"></i></button>
                        <span id="qty-${item.id}">${quantities[item.id] || 1}</span>
                        <button onclick="changeQty(${item.id}, 1)"><i class="fa-solid fa-plus"></i></button>
                    </div>
                    <button class="btn-add-cart" onclick="addToCart(${item.id})">
                        <i class="fa-solid fa-bag-shopping"></i> Ajouter
                    </button>
                    <button class="btn-whatsapp-icon" onclick="orderDirectWhatsApp(${item.id})" title="Commander directement sur WhatsApp">
                        <i class="fa-brands fa-whatsapp"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Adjust Item Quantity
function changeQty(id, delta) {
    if (!quantities[id]) quantities[id] = 1;
    quantities[id] += delta;
    if (quantities[id] < 1) quantities[id] = 1;
    const qtyElem = document.getElementById(`qty-${id}`);
    if (qtyElem) qtyElem.textContent = quantities[id];
}

// Cart Functionality
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const qty = quantities[id] || 1;

    const existingIndex = currentCart.findIndex(item => item.id === id);
    if (existingIndex > -1) {
        currentCart[existingIndex].quantity += qty;
    } else {
        currentCart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: qty
        });
    }

    saveCart();
    updateCartUI();
}

function updateCartUI() {
    const totalItems = currentCart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = currentCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    cartBadge.textContent = totalItems;
    cartTotal.textContent = `${totalPrice.toLocaleString('fr-FR')} FCFA`;

    if (totalItems > 0) {
        stickyCart.style.display = 'flex';
    }
}

function saveCart() {
    localStorage.setItem('king_essen_cart', JSON.stringify(currentCart));
}

// Direct WhatsApp Ordering
function orderDirectWhatsApp(id) {
    const product = products.find(p => p.id === id);
    const qty = quantities[id] || 1;
    const total = product.price * qty;

    const message = `Bonjour *King Essen*, je souhaite commander directement :\n\n` +
                    `• *Plat* : ${product.title}\n` +
                    `• *Quantité* : ${qty}\n` +
                    `• *Total* : ${total.toLocaleString('fr-FR')} FCFA\n\n` +
                    `Merci de me confirmer la disponibilité et le délai de livraison.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/2250000000000?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
}

// Product Details Modal
let activeModalProductId = null;

function openModal(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    activeModalProductId = id;
    modalImg.src = product.image;
    modalTitle.textContent = product.title;
    modalPrice.textContent = `${product.price.toLocaleString('fr-FR')} FCFA`;
    modalDesc.textContent = product.description;
    modalIngredients.textContent = product.ingredients;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Event Listeners Setup
function setupEventListeners() {
    // Search input
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderCatalog();
    });

    // Sort select
    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderCatalog();
    });

    // Price range slider
    priceRange.addEventListener('input', (e) => {
        maxPrice = parseInt(e.target.value, 10);
        priceDisplay.textContent = `${maxPrice.toLocaleString('fr-FR')} FCFA`;
        renderCatalog();
    });

    // Category buttons
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeCategory = btn.dataset.category;
            renderCatalog();
        });
    });

    // Modal controls
    modalCloseBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    modalAddBtn.addEventListener('click', () => {
        if (activeModalProductId) {
            addToCart(activeModalProductId);
            closeModal();
        }
    });

    // Side selection options in modal
    const sideOptions = document.querySelectorAll('.option-item');
    sideOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            sideOptions.forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
        });
    });
}