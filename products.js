// Product data
const products = [
    {
        id: 1,
        name: 'Premium Floor Cleaner',
        category: 'floor-cleaner',
        price: 19.99,
        image: 'https://via.placeholder.com/300x300',
        description: 'Advanced formula floor cleaner that leaves your floors spotless and fresh.',
        usage: 'Mix 30ml in 1L of water. Mop the floor with the solution.',
        ingredients: 'Natural surfactants, Essential oils, Plant-based cleaning agents',
        unitsSold: 1200
    },
    {
        id: 2,
        name: 'Natural Dishwash Gel',
        category: 'dishwash',
        price: 14.99,
        image: 'https://via.placeholder.com/300x300',
        description: 'Gentle on hands but tough on grease. Natural formula that keeps your dishes sparkling clean.',
        usage: 'Apply small amount on sponge or directly on dishes.',
        ingredients: 'Plant-derived cleansers, Aloe vera, Lemon extract',
        unitsSold: 1500
    },
    {
        id: 3,
        name: 'Fresh Phenyl',
        category: 'phenyl',
        price: 24.99,
        image: 'https://via.placeholder.com/300x300',
        description: 'Long-lasting freshness with powerful cleaning action.',
        usage: 'Mix 20ml in 1L of water for general cleaning.',
        ingredients: 'Pine oil, Natural disinfectants, Essential oils',
        unitsSold: 800
    },
    {
        id: 4,
        name: 'Phenyl Concentrate',
        category: 'phenyl-concentrate',
        price: 34.99,
        image: 'https://via.placeholder.com/300x300',
        description: 'Concentrated formula for industrial and heavy-duty cleaning needs.',
        usage: 'Mix 10ml in 1L of water. Adjust concentration as needed.',
        ingredients: 'Concentrated pine oil, Industrial-grade disinfectants',
        unitsSold: 500
    },
    {
        id: 5,
        name: 'Lemon Floor Cleaner',
        category: 'floor-cleaner',
        price: 17.99,
        image: 'https://via.placeholder.com/300x300',
        description: 'Citrus-fresh floor cleaner that removes tough stains.',
        usage: 'Mix 25ml in 1L of water. Mop as usual.',
        ingredients: 'Lemon extract, Natural cleaners, Essential oils',
        unitsSold: 900
    },
    {
        id: 6,
        name: 'Antibacterial Dishwash',
        category: 'dishwash',
        price: 16.99,
        image: 'https://via.placeholder.com/300x300',
        description: 'Kills 99.9% of germs while keeping dishes clean and shiny.',
        usage: 'Use as regular dishwash liquid.',
        ingredients: 'Natural antibacterial agents, Gentle surfactants',
        unitsSold: 1100
    },
    {
        id: 7,
        name: 'Lavender Phenyl',
        category: 'phenyl',
        price: 22.99,
        image: 'https://via.placeholder.com/300x300',
        description: 'Lavender-scented phenyl for a refreshing clean.',
        usage: 'Mix 20ml in 1L of water for general cleaning.',
        ingredients: 'Lavender oil, Natural disinfectants',
        unitsSold: 750
    },
    {
        id: 8,
        name: 'Industrial Phenyl Concentrate',
        category: 'phenyl-concentrate',
        price: 39.99,
        image: 'https://via.placeholder.com/300x300',
        description: 'Extra strong concentrate for commercial use.',
        usage: 'Mix 5-10ml in 1L of water depending on cleaning needs.',
        ingredients: 'High-concentration pine oil, Professional-grade cleaners',
        unitsSold: 300
    }
];

// Function to create product card HTML
function createProductCard(product) {
    return `
        <div class="bg-white rounded-lg shadow-md overflow-hidden" data-category="${product.category}" data-price="${product.price}">
            <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
            <div class="p-6">
                <h3 class="text-xl font-semibold mb-2">${product.name}</h3>
                <p class="text-gray-600 mb-4">${product.description.substring(0, 100)}...</p>
                <div class="flex justify-between items-center">
                    <span class="text-primary font-bold">$${product.price.toFixed(2)}</span>
                    <button onclick="addToCart(${product.id})" class="bg-accent text-white px-4 py-2 rounded hover:bg-opacity-90">Add to Cart</button>
                </div>
            </div>
        </div>
    `;
}

// Function to filter and display products
function filterProducts() {
    const categoryFilter = document.getElementById('category-filter').value;
    const priceFilter = document.getElementById('price-filter').value;
    const sortFilter = document.getElementById('sort-filter').value;

    let filteredProducts = [...products];

    // Apply category filter
    if (categoryFilter !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category === categoryFilter);
    }

    // Apply price filter
    if (priceFilter !== 'all') {
        const [min, max] = priceFilter.split('-').map(val => val === '+' ? Infinity : Number(val));
        filteredProducts = filteredProducts.filter(product => product.price >= min && product.price < max);
    }

    // Apply sorting
    switch (sortFilter) {
        case 'price-low-high':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high-low':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name-a-z':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        // 'featured' remains in default order
    }

    // Display filtered products
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
}

// Initialize products display
document.addEventListener('DOMContentLoaded', () => {
    // Display all products initially
    filterProducts();

    // Add event listeners to filters
    document.getElementById('category-filter').addEventListener('change', filterProducts);
    document.getElementById('price-filter').addEventListener('change', filterProducts);
    document.getElementById('sort-filter').addEventListener('change', filterProducts);
});

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                image: product.image
            });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
    }
}

function updateCartUI() {
    // This function will be implemented in main.js to update cart count
    const event = new CustomEvent('cartUpdated', { detail: cart });
    document.dispatchEvent(event);
}
