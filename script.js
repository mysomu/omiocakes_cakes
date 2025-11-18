// SPA Navigation
document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation
    initNavigation();
    initPriceCalculators();
    initMobileMenu();
    initBirthdayCheckbox();
    initCarousel(); // Add this line
});

// Navigation Functions
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Show target section
            sections.forEach(s => s.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');
            
            // Close mobile menu if open
            const navMenu = document.getElementById('navMenu');
            navMenu.classList.remove('active');
        });
    });

    // Show home section by default
    document.getElementById('home').classList.add('active');
}

function scrollToSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Update active nav link
    navLinks.forEach(l => l.classList.remove('active'));
    document.querySelector(`a[href="#${sectionId}"]`).classList.add('active');
    
    // Show target section
    sections.forEach(s => s.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Mobile Menu
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });
}

// Price Calculator
function initPriceCalculators() {
    const qtySelects = document.querySelectorAll('.qty-select');
    
    qtySelects.forEach(select => {
        select.addEventListener('change', function() {
            const card = this.closest('.product-card');
            const pricePerPound = parseFloat(card.getAttribute('data-price'));
            const quantity = parseFloat(this.value);
            const priceValue = card.querySelector('.price-value');
            
            if (priceValue) {
                const totalPrice = pricePerPound * quantity;
                priceValue.textContent = totalPrice;
            }
        });
    });
}

// Order Modal
let currentProduct = null;

function openOrderModal(button) {
    const card = button.closest('.product-card');
    const productName = card.querySelector('h4').textContent;
    const priceValue = card.querySelector('.price-value');
    const qtySelect = card.querySelector('.qty-select');
    
    // Get current price and quantity
    let price = 0;
    let quantity = '1';
    
    if (priceValue) {
        price = parseFloat(priceValue.textContent);
    } else {
        // For items without quantity selector (tea time, cupcakes, ice cream)
        const priceText = card.querySelector('.price-display').textContent;
        price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
    }
    
    if (qtySelect) {
        quantity = qtySelect.value;
    }
    
    // Store current product info
    currentProduct = {
        name: productName,
        price: price,
        quantity: quantity,
        hasQuantity: qtySelect !== null
    };
    
    // Populate modal
    document.getElementById('modalProductName').value = productName;
    document.getElementById('totalPrice').textContent = price;
    
    // Show/hide quantity selector
    const quantityGroup = document.getElementById('quantityGroup');
    if (currentProduct.hasQuantity) {
        quantityGroup.style.display = 'block';
        const quantitySelect = document.getElementById('quantity');
        quantitySelect.value = quantity;
        quantitySelect.addEventListener('change', updateModalPrice);
    } else {
        quantityGroup.style.display = 'none';
    }
    
    // Set minimum date to today for delivery date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('deliveryDate').setAttribute('min', today);
    
    // Show modal
    document.getElementById('orderModal').style.display = 'block';
    
    // Reset form
    document.getElementById('orderForm').reset();
    document.getElementById('isBirthday').checked = false;
    document.getElementById('birthdayNameGroup').style.display = 'none';
    document.getElementById('modalProductName').value = productName;
    document.getElementById('totalPrice').textContent = price;
    document.getElementById('deliveryDate').setAttribute('min', today);
}

function updateModalPrice() {
    if (!currentProduct || !currentProduct.hasQuantity) return;
    
    const quantitySelect = document.getElementById('quantity');
    const quantity = parseFloat(quantitySelect.value);
    const pricePerPound = currentProduct.price / parseFloat(currentProduct.quantity);
    const totalPrice = pricePerPound * quantity;
    
    document.getElementById('totalPrice').textContent = totalPrice;
    currentProduct.price = totalPrice;
    currentProduct.quantity = quantity.toString();
}

function closeOrderModal() {
    document.getElementById('orderModal').style.display = 'none';
    currentProduct = null;
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('orderModal');
    if (event.target == modal) {
        closeOrderModal();
    }
}

// Birthday Checkbox
function initBirthdayCheckbox() {
    const birthdayCheckbox = document.getElementById('isBirthday');
    const birthdayNameGroup = document.getElementById('birthdayNameGroup');
    
    birthdayCheckbox.addEventListener('change', function() {
        if (this.checked) {
            birthdayNameGroup.style.display = 'block';
        } else {
            birthdayNameGroup.style.display = 'none';
        }
    });
}

// Form Submission
document.getElementById('orderForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const customerName = document.getElementById('customerName').value.trim();
    const contactNumber = document.getElementById('contactNumber').value.trim();
    const isBirthday = document.getElementById('isBirthday').checked;
    const birthdayName = document.getElementById('birthdayName').value.trim();
    const quantity = currentProduct.hasQuantity ? document.getElementById('quantity').value : '1';
    const price = document.getElementById('totalPrice').textContent;
    const deliveryDate = document.getElementById('deliveryDate').value;
    const deliveryTime = document.getElementById('deliveryTime').value;
    const otherComments = document.getElementById('otherComments').value.trim();
    
    // Validation
    if (!customerName || !contactNumber) {
        alert('Please fill in all required fields.');
        return;
    }
    
    if (!deliveryDate || !deliveryTime) {
        alert('Please select delivery date and time.');
        return;
    }
    
    if (isBirthday && !birthdayName) {
        alert('Please enter the name to be written on the cake.');
        return;
    }
    
    // Format delivery date for display
    const dateObj = new Date(deliveryDate);
    const formattedDate = dateObj.toLocaleDateString('en-IN', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    // Format delivery time for display (12-hour format with AM/PM)
    const [hours, minutes] = deliveryTime.split(':');
    let hour12 = parseInt(hours);
    const ampm = hour12 >= 12 ? 'PM' : 'AM';
    hour12 = hour12 % 12;
    hour12 = hour12 ? hour12 : 12; // the hour '0' should be '12'
    const formattedTime = `${hour12}:${minutes} ${ampm}`;
    
    // Build WhatsApp message
    let message = `Hello Omio Cakes,\nNew order:\n\nName: ${customerName}\nContact: ${contactNumber}\nCake: ${currentProduct.name}\nQuantity: ${quantity} pound${quantity !== '1' ? 's' : ''}\nPrice: ₹${price}\nDelivery Date: ${formattedDate}\nDelivery Time: ${formattedTime}`;
    
    if (isBirthday && birthdayName) {
        message += `\nBirthday Name on Cake: ${birthdayName}`;
    }
    
    if (otherComments) {
        message += `\nOther Comments: ${otherComments}`;
    }
    
    // Encode message for URL
    //Rahul 9932519188
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919932519188?text=${encodedMessage}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Close modal
    closeOrderModal();
    
    // Show success message
    alert('Opening WhatsApp to send your order!');
});

// WhatsApp Button (Contact Section)
function openWhatsApp() {
    const message = encodeURIComponent('Hello Omio Cakes, I would like to place an order.');
    const whatsappUrl = `https://wa.me/919932519188?text=${message}`;
    window.open(whatsappUrl, '_blank');
}

// Sticky Navbar
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        scrollToSection(targetId);
    });
});

// Image Carousel
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.dot');

function showSlide(index) {
    // Hide all slides
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Show current slide
    if (index >= slides.length) {
        currentSlideIndex = 0;
    } else if (index < 0) {
        currentSlideIndex = slides.length - 1;
    } else {
        currentSlideIndex = index;
    }
    
    slides[currentSlideIndex].classList.add('active');
    dots[currentSlideIndex].classList.add('active');
}

function currentSlide(index) {
    showSlide(index - 1);
}

function nextSlide() {
    showSlide(currentSlideIndex + 1);
}

// Auto-advance slides every 4 seconds
function initCarousel() {
    if (slides.length > 0) {
        setInterval(nextSlide, 4000);
    }
}

// Initialize carousel when page loads
document.addEventListener('DOMContentLoaded', function() {
    initCarousel();
});

