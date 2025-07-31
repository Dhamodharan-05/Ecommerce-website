document.addEventListener('DOMContentLoaded', () => {
    loadOrderSummary();
    setupFormValidation();
});

// Load order summary
function loadOrderSummary() {
    const orderItemsContainer = document.getElementById('order-items');
    const orderSummaryContainer = document.getElementById('order-summary');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }

    // Display order items
    orderItemsContainer.innerHTML = cart.map(item => `
        <div class="flex justify-between items-center">
            <div class="flex items-center space-x-4">
                <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded">
                <div>
                    <h3 class="font-semibold">${item.name}</h3>
                    <p class="text-gray-600">Quantity: ${item.quantity}</p>
                </div>
            </div>
            <span class="font-semibold">$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + shipping + tax;

    // Display order summary
    orderSummaryContainer.innerHTML = `
        <div class="flex justify-between">
            <span class="text-gray-600">Subtotal</span>
            <span>$${subtotal.toFixed(2)}</span>
        </div>
        <div class="flex justify-between">
            <span class="text-gray-600">Shipping</span>
            <span>${shipping === 0 ? 'Free' : '$' + shipping.toFixed(2)}</span>
        </div>
        <div class="flex justify-between">
            <span class="text-gray-600">Tax (10%)</span>
            <span>$${tax.toFixed(2)}</span>
        </div>
        <div class="flex justify-between text-lg font-bold mt-4">
            <span>Total</span>
            <span>$${total.toFixed(2)}</span>
        </div>
    `;
}

// Setup form validation
function setupFormValidation() {
    const form = document.getElementById('checkout-form');
    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach(field => {
        field.addEventListener('blur', () => {
            validateField(field);
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm(form)) {
            processOrder();
        }
    });
}

// Validate individual field
function validateField(field) {
    const errorDiv = field.parentElement.querySelector('.error-message') ||
        createErrorElement(field);

    // Clear previous error
    errorDiv.textContent = '';
    field.classList.remove('border-red-500');

    // Check if empty
    if (!field.value.trim()) {
        showError(field, errorDiv, 'This field is required');
        return false;
    }

    // Specific validation rules
    switch (field.type) {
        case 'email':
            if (!validateEmail(field.value)) {
                showError(field, errorDiv, 'Please enter a valid email address');
                return false;
            }
            break;

        case 'tel':
            if (!validatePhone(field.value)) {
                showError(field, errorDiv, 'Please enter a valid phone number');
                return false;
            }
            break;

        case 'text':
            if (field.id === 'postal_code' && !validatePostalCode(field.value)) {
                showError(field, errorDiv, 'Please enter a valid postal code');
                return false;
            }
            break;
    }

    return true;
}

// Validate entire form
function validateForm(form) {
    const fields = form.querySelectorAll('[required]');
    let isValid = true;

    fields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    return isValid;
}

// Validation helper functions
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
    return /^\+?[1-9]\d{1,14}$/.test(phone.replace(/[\s()-]/g, ''));
}

function validatePostalCode(code) {
    // Basic postal code validation (can be customized based on country)
    return /^[\w\d\s-]{3,10}$/.test(code);
}

function showError(field, errorDiv, message) {
    errorDiv.textContent = message;
    field.classList.add('border-red-500');
}

function createErrorElement(field) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message text-red-500 text-sm mt-1';
    field.parentElement.appendChild(errorDiv);
    return errorDiv;
}

// Process order
function processOrder() {
    const formData = new FormData(document.getElementById('checkout-form'));
    const orderData = {
        customer: {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone')
        },
        shipping: {
            address: formData.get('address'),
            city: formData.get('city'),
            postalCode: formData.get('postal_code'),
            country: formData.get('country')
        },
        payment: {
            method: formData.get('payment_method')
        },
        items: JSON.parse(localStorage.getItem('cart')) || [],
        orderDate: new Date().toISOString()
    };

    // Simulate order processing
    showProcessingOverlay();
    setTimeout(() => {
        // Clear cart
        localStorage.removeItem('cart');
        
        // Store order in localStorage for demo purposes
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(orderData);
        localStorage.setItem('orders', JSON.stringify(orders));

        // Redirect to success page
        window.location.href = 'order-success.html';
    }, 2000);
}

// Show processing overlay
function showProcessingOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    overlay.innerHTML = `
        <div class="bg-white p-8 rounded-lg text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
            <p class="text-lg">Processing your order...</p>
        </div>
    `;
    document.body.appendChild(overlay);
}
