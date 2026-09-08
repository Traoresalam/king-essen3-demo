document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const btnWhatsappSubmit = document.getElementById('btnWhatsappSubmit');
    const formFeedback = document.getElementById('formFeedback');

    // Input elements
    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');

    // Real-time error cleanup
    [fullName, email, phone, subject, message].forEach(input => {
        input.addEventListener('input', () => {
            input.parentElement.classList.remove('invalid');
        });
    });

    // Validation Logic
    function validateForm() {
        let isValid = true;

        if (!fullName.value.trim()) {
            fullName.parentElement.classList.add('invalid');
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value.trim())) {
            email.parentElement.classList.add('invalid');
            isValid = false;
        }

        if (!phone.value.trim()) {
            phone.parentElement.classList.add('invalid');
            isValid = false;
        }

        if (!subject.value) {
            subject.parentElement.classList.add('invalid');
            isValid = false;
        }

        if (!message.value.trim()) {
            message.parentElement.classList.add('invalid');
            isValid = false;
        }

        return isValid;
    }

    // Standard Form Submission Process
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (validateForm()) {
            formFeedback.className = 'form-feedback success';
            formFeedback.textContent = "Merci ! L'équipe King Essen vous répondra sous peu.";
            contactForm.reset();

            setTimeout(() => {
                formFeedback.style.display = 'none';
            }, 6000);
        }
    });

    // Direct WhatsApp Message Generation
    btnWhatsappSubmit.addEventListener('click', () => {
        if (validateForm()) {
            const restaurantPhone = "2250595912505";
            const encodedText = encodeURIComponent(
                `*Nouveau Message - King Essen*\n\n` +
                `*Nom:* ${fullName.value.trim()}\n` +
                `*Email:* ${email.value.trim()}\n` +
                `*Téléphone:* ${phone.value.trim()}\n` +
                `*Objet:* ${subject.options[subject.selectedIndex].text}\n\n` +
                `*Message:* ${message.value.trim()}`
            );

            window.open(`https://wa.me/${restaurantPhone}?text=${encodedText}`, '_blank');
        }
    });
});
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