// Emergency Fix - Simple Product Loader
console.log("Script loaded!");

const products = [
    { id: 1, name: "Snake Plant", price: 2500, category: "plants", image: "images/snake-plant.jpg", description: "Low maintenance air purifier" },
    { id: 2, name: "Monstera Deliciosa", price: 3500, category: "plants", image: "images/monstera.jpg", description: "Beautiful split leaves" },
    { id: 3, name: "Peace Lily", price: 1800, category: "plants", image: "images/peace-lily.jpg", description: "Elegant white flowers" },
    { id: 4, name: "Pothos Golden", price: 1200, category: "plants", image: "images/pothos.jpg", description: "Easy to grow trailing plant" },
    { id: 5, name: "Fiddle Leaf Fig", price: 4500, category: "plants", image: "images/fiddle-leaf.jpg", description: "Statement tree for your space" },
    { id: 6, name: "ZZ Plant", price: 2200, category: "plants", image: "images/zz-plant.jpg", description: "Thrives in low light" }
];

function formatPrice(price) {
    return `JMD $${price.toLocaleString('en-JM')}`;
}

// Load products when page loads
window.onload = function() {
    console.log("Page loaded!");
    
    // Load featured products
    const featuredContainer = document.getElementById('featured-products');
    if (featuredContainer) {
        console.log("Loading featured products");
        const featuredProducts = products.slice(0, 6);
        const html = featuredProducts.map(product => `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <h3>${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <p class="product-price">${formatPrice(product.price)}</p>
                <button class="add-to-cart-btn">Add to Cart</button>
            </div>
        `).join('');
        featuredContainer.innerHTML = html;
    }
    
    // Load shop products
    const shopContainer = document.getElementById('shop-products');
    if (shopContainer) {
        console.log("Loading shop products");
        const html = products.map(product => `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <h3>${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <p class="product-price">${formatPrice(product.price)}</p>
                <button class="add-to-cart-btn">Add to Cart</button>
            </div>
        `).join('');
        shopContainer.innerHTML = html;
    }
// Add this to your script.js file
document.addEventListener('DOMContentLoaded', function() {
    const plantsTab = document.getElementById('plants-tab');
    const suppliesTab = document.getElementById('supplies-tab');
    
    if (plantsTab) {
        plantsTab.addEventListener('click', function(e) {
            e.preventDefault();
            filterProducts('plants');
        });
    }
    
    if (suppliesTab) {
        suppliesTab.addEventListener('click', function(e) {
            e.preventDefault();
            filterProducts('supplies');
        });
    }
});

function filterProducts(category) {
    alert(`Showing ${category} - you need to implement the filtering logic!`);
    // You'll need to add supplies products and implement actual filtering
}
};