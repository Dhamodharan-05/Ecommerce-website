document.addEventListener('DOMContentLoaded', () => {
    // Get product ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    if (!productId) {
        window.location.href = 'shop.html';
        return;
    }

    // Find product from products array (defined in products.js)
    const product = products.find(p => p.id === productId);

    if (!product) {
        window.location.href = 'shop.html';
        return;
    }

    // Update page title
    document.title = `${product.name} - Hygifec`;

    // Render product details
    const productDetailSection = document.getElementById('product-detail');
    productDetailSection.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Product Image -->
            <div class="bg-white rounded-lg overflow-hidden shadow-md">
                <img src="${product.image}" alt="${product.name}" class="w-full h-auto object-cover">
            </div>

            <!-- Product Info -->
            <div class="space-y-6">
                <h1 class="text-3xl font-bold">${product.name}</h1>
                <div class="text-2xl font-bold text-primary">$${product.price.toFixed(2)}</div>
                
                <div class="space-y-4">
                    <div>
                        <h2 class="text-xl font-semibold mb-2">Description</h2>
                        <p class="text-gray-600">${product.description}</p>
                    </div>

                    <div>
                        <h2 class="text-xl font-semibold mb-2">Usage Instructions</h2>
                        <p class="text-gray-600">${product.usage}</p>
                    </div>

                    <div>
                        <h2 class="text-xl font-semibold mb-2">Ingredients</h2>
                        <p class="text-gray-600">${product.ingredients}</p>
                    </div>

                    ${product.unitsSold ? `
                    <div class="text-sm text-gray-500">
                        <span class="font-semibold">${product.unitsSold}</span> units sold
                    </div>
                    ` : ''}
                </div>

                <!-- Add to Cart Section -->
                <div class="space-y-4">
                    <div class="flex items-center space-x-4">
                        <label for="quantity" class="font-semibold">Quantity:</label>
                        <div class="flex items-center border rounded-lg">
                            <button class="px-3 py-1 border-r hover:bg-gray-100" onclick="updateQuantity(-1)">-</button>
                            <input type="number" id="quantity" value="1" min="1" class="w-16 text-center py-1 focus:outline-none" readonly>
                            <button class="px-3 py-1 border-l hover:bg-gray-100" onclick="updateQuantity(1)">+</button>
                        </div>
                    </div>

                    <button onclick="addToCartWithQuantity(${product.id})" class="w-full bg-accent text-white py-3 rounded-lg hover:bg-opacity-90 transition duration-300">
                        Add to Cart
                    </button>

                    <button onclick="buyNow(${product.id})" class="w-full bg-primary text-white py-3 rounded-lg hover:bg-opacity-90 transition duration-300">
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    `;

    // Load related products
    loadRelatedProducts(product);
});

// Update quantity input
function updateQuantity(change) {
    const quantityInput = document.getElementById('quantity');
    const currentValue = parseInt(quantityInput.value);
    const newValue = currentValue + change;
    
    if (newValue >= 1) {
        quantityInput.value = newValue;
    }
}

// Add to cart with quantity
function addToCartWithQuantity(productId) {
    const quantity = parseInt(document.getElementById('quantity').value);
    const product = products.find(p => p.id === productId);

    if (product) {
        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) {
            cartItem.quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: quantity,
                image: product.image
            });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
        showNotification(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart`);
    }
}

// Buy now functionality
function buyNow(productId) {
    addToCartWithQuantity(productId);
    window.location.href = 'checkout.html';
}

// Load related products
function loadRelatedProducts(currentProduct) {
    const relatedProducts = products
        .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
        .slice(0, 4);

    const relatedProductsContainer = document.getElementById('related-products');
    relatedProductsContainer.innerHTML = relatedProducts
        .map(product => createProductCard(product))
        .join('');
}
