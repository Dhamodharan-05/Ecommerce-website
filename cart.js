document.addEventListener('DOMContentLoaded', () => {
    loadCart();
});

// Load cart items and summary
function loadCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const orderSummaryContainer = document.getElementById('order-summary');
    const checkoutButton = document.getElementById('checkout-button');

    // Get cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        // Show empty cart message
        cartItemsContainer.innerHTML = `
            <div class="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h2 class="text-xl font-semibold mb-2">Your cart is empty</h2>
                <p class="text-gray-600 mb-4">Add some products to your cart and they will appear here</p>
                <a href="shop.html" class="text-primary hover:underline">Continue Shopping</a>
            </div>
        `;
        orderSummaryContainer.innerHTML = `
            <p class="text-gray-600">No items in cart</p>
        `;
        checkoutButton.disabled = true;
        checkoutButton.classList.add('opacity-50', 'cursor-not-allowed');
        return;
    }

    // Display cart items
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="flex items-center justify-between border-b py-4 last:border-b-0" data-item-id="${item.id}">
            <div class="flex items-center space-x-4">
                <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded">
                <div>
                    <h3 class="font-semibold">${item.name}</h3>
                    <p class="text-gray-600">$${item.price.toFixed(2)}</p>
                </div>
            </div>
            <div class="flex items-center space-x-4">
                <div class="flex items-center border rounded">
                    <button onclick="updateCartItemQuantity(${item.id}, -1)" class="px-3 py-1 border-r hover:bg-gray-100">-</button>
                    <span class="px-4 py-1">${item.quantity}</span>
                    <button onclick="updateCartItemQuantity(${item.id}, 1)" class="px-3 py-1 border-l hover:bg-gray-100">+</button>
                </div>
                <button onclick="removeFromCart(${item.id})" class="text-red-500 hover:text-red-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        </div>
    `).join('');

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + shipping + tax;

    // Display order summary
    orderSummaryContainer.innerHTML = `
        <div class="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>$${subtotal.toFixed(2)}</span>
        </div>
        <div class="flex justify-between mb-2">
            <span>Shipping</span>
            <span>${shipping === 0 ? 'Free' : '$' + shipping.toFixed(2)}</span>
        </div>
        <div class="flex justify-between mb-2">
            <span>Tax (10%)</span>
            <span>$${tax.toFixed(2)}</span>
        </div>
        <div class="border-t pt-2 mt-2">
            <div class="flex justify-between font-bold">
                <span>Total</span>
                <span>$${total.toFixed(2)}</span>
            </div>
        </div>
        ${shipping > 0 ? `
        <div class="text-sm text-gray-600 mt-2">
            Add $${(50 - subtotal).toFixed(2)} more to get free shipping
        </div>
        ` : ''}
    `;

    // Enable checkout button
    checkoutButton.disabled = false;
    checkoutButton.classList.remove('opacity-50', 'cursor-not-allowed');
}

// Update cart item quantity
function updateCartItemQuantity(itemId, change) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => item.id === itemId);

    if (itemIndex !== -1) {
        const newQuantity = cart[itemIndex].quantity + change;
        if (newQuantity > 0) {
            cart[itemIndex].quantity = newQuantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            loadCart();
            updateCartUI();
        } else if (newQuantity === 0) {
            removeFromCart(itemId);
        }
    }
}

// Remove item from cart
function removeFromCart(itemId) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const updatedCart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    loadCart();
    updateCartUI();
    showNotification('Item removed from cart');
}

// Clear cart
function clearCart() {
    localStorage.removeItem('cart');
    loadCart();
    updateCartUI();
    showNotification('Cart cleared');
}
