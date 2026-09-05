// King Essen WhatsApp Number
const WHATSAPP_NUMBER = "2250000000000"; // Remplacez par le numéro officiel King Essen

// Available Time Slots Data
const LUNCH_SLOTS = ["12:00", "12:30", "13:00", "13:30", "14:00", "14:30"];
const DINNER_SLOTS = ["19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"];

// State
let selectedService = 'lunch'; // 'lunch' or 'dinner'
let selectedTimeSlot = '13:00';

// DOM Elements
const resDateInput = document.getElementById('resDate');
const tabLunch = document.getElementById('tabLunch');
const tabDinner = document.getElementById('tabDinner');
const timeSlotsContainer = document.getElementById('timeSlotsContainer');
const zoneCards = document.querySelectorAll('.zone-card');

const btnSubmitReservation = document.getElementById('btnSubmitReservation');
const reservationModal = document.getElementById('reservationModal');
const btnCloseModal = document.getElementById('btnCloseModal');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initDatePicker();
    renderTimeSlots();
    setupEventListeners();
});

// Set minimum date to today (prevent past dates)
function initDatePicker() {
    const today = new Date().toISOString().split('T')[0];
    resDateInput.setAttribute('min', today);
    resDateInput.value = today;
}

// Render Time Slots based on active service
function renderTimeSlots() {
    const slots = selectedService === 'lunch' ? LUNCH_SLOTS : DINNER_SLOTS;
    
    timeSlotsContainer.innerHTML = slots.map(time => `
        <div class="time-slot ${time === selectedTimeSlot ? 'selected' : ''}" onclick="selectTime('${time}')">
            ${time}
        </div>
    `).join('');
}

// Global scope function for onclick binding
window.selectTime = function(time) {
    selectedTimeSlot = time;
    renderTimeSlots();
};

// Event Listeners Setup
function setupEventListeners() {
    // Service Tab Switcher
    tabLunch.addEventListener('click', () => {
        selectedService = 'lunch';
        tabLunch.classList.add('active');
        tabDinner.classList.remove('active');
        selectedTimeSlot = LUNCH_SLOTS[0];
        renderTimeSlots();
    });

    tabDinner.addEventListener('click', () => {
        selectedService = 'dinner';
        tabDinner.classList.add('active');
        tabLunch.classList.remove('active');
        selectedTimeSlot = DINNER_SLOTS[0];
        renderTimeSlots();
    });

    // Zone selection highlighting
    zoneCards.forEach(card => {
        card.addEventListener('click', () => {
            zoneCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            const radio = card.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
        });
    });

    // Submit Reservation
    btnSubmitReservation.addEventListener('click', processReservation);

    // Modal Close
    btnCloseModal.addEventListener('click', () => {
        reservationModal.classList.remove('active');
    });
}

// Format Date to Readable French
function formatDateToFR(dateString) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateObj = new Date(dateString);
    return dateObj.toLocaleDateString('fr-FR', options);
}

// Process and send reservation via WhatsApp
function processReservation() {
    const dateVal = resDateInput.value;
    const guestsVal = document.getElementById('resGuests').value;
    const clientName = document.getElementById('clientName').value.trim();
    const clientPhone = document.getElementById('clientPhone').value.trim();
    const eventType = document.getElementById('eventType').value;
    const specialNotes = document.getElementById('specialNotes').value.trim() || 'Aucune';

    // Get selected zone
    const selectedZoneRadio = document.querySelector('input[name="resZone"]:checked');
    const zoneVal = selectedZoneRadio ? selectedZoneRadio.value : '👑 Salle Principale';

    // Input Validation
    if (!dateVal) {
        alert("Veuillez choisir une date de réservation.");
        return;
    }

    if (!clientName || !clientPhone) {
        alert("Veuillez renseigner votre nom et votre numéro de téléphone.");
        return;
    }

    const formattedDate = formatDateToFR(dateVal);

    // Formatted WhatsApp Message Template
    const whatsappMessage = 
`--------------------------------------------------
🥂 *DEMANDE DE RÉSERVATION - KING ESSEN* 🥂
--------------------------------------------------
👤 *NOM :* ${clientName}
📞 *TEL :* ${clientPhone}

📅 *DATE :* ${formattedDate}
⏰ *HEURE :* ${selectedTimeSlot}
👥 *COUVERTS :* ${guestsVal} personne(s)
📍 *ZONE :* ${zoneVal}
🎉 *ÉVÉNEMENT :* ${eventType}

💬 *NOTE / SOUHAITS :* ${specialNotes}
--------------------------------------------------
Merci de me confirmer la disponibilité de cette table.
--------------------------------------------------`;

    // Trigger WhatsApp Redirect
    const encodedUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(encodedUrl, '_blank');

    // Display UX Confirmation Modal
    reservationModal.classList.add('active');
}