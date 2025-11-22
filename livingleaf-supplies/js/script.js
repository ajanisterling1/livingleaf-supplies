// js/script.js - Complete Cart Functionality

// Products Data (shared across all pages)
const allProducts = [
    // Plants
    { id: 1, name: "Snake Plant", price: 2500, category: "plants", image: "./images/snake-plant.jpg", description: "Low maintenance air purifier" },
    { id: 2, name: "Monstera Deliciosa", price: 3500, category: "plants", image: "./images/monstera.jpg", description: "Beautiful split leaves" },
    { id: 3, name: "Peace Lily", price: 1800, category: "plants", image: "./images/peace-lily.jpg", description: "Elegant white flowers" },
    { id: 4, name: "Pothos Golden", price: 1200, category: "plants", image: "./images/pothos.jpg", description: "Easy to grow trailing plant" },
    { id: 5, name: "Fiddle Leaf Fig", price: 4500, category: "plants", image: "./images/fiddle-leaf.jpg", description: "Statement tree for your space" },
    { id: 6, name: "ZZ Plant", price: 2200, category: "plants", image: "./images/zz-plant.jpg", description: "Thrives in low light" },
    
    // Supplies
    { id: 101, name: "Ceramic Pot", price: 800, category: "supplies", image: "./images/ceramic-pot.jpg", description: "Beautiful ceramic plant pot" },
    { id: 102, name: "Plant Food", price: 600, category: "supplies", image: "./images/plant-food.jpg", description: "Nutrient-rich plant food" },
    { id: 103, name: "Watering Can", price: 1200, category: "supplies", image: "./images/watering-can.jpg", description: "1L metal watering can" },
    { id: 104, name: "Pruning Shears", price: 950, category: "supplies", image: "./images/pruning-shears.jpg", description: "Sharp pruning shears" },
    { id: 105, name: "Potting Mix", price: 750, category: "supplies", image: "./images/potting-mix.jpg", description: "Organic potting soil" },
    { id: 106, name: "Plant Mister", price: 550, category: "supplies", image: "./images/plant-mister.jpg", description: "Spray bottle for humidity" }
];

// Utility Functions
function formatPrice(price) {
    return `JMD $${price.toLocaleString('en-JM')}`;
}

// Cart Management
function getCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log('Current cart:', cart);
    return cart;
}

function saveCart(cart) {
    console.log('Saving cart:', cart);
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(productId) {
    const cart = getCart();
    const product = allProducts.find(p => p.id === productId);
    
    if (product) {
        // Check if product already exists in cart
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                category: product.category,
                quantity: 1
            });
        }
        saveCart(cart);
        updateCartCount();
        alert(`✅ ${product.name} added to cart!`);
    }
}

function updateCartCount() {
    const cartCountElements = document.querySelectorAll('#cart-count');
    if (cartCountElements.length > 0) {
        const cart = getCart();
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
        });
        console.log('Cart count updated:', totalItems);
    }
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    updateCartCount();
    if (window.location.pathname.includes('cart.html')) {
        loadCartPage();
    }
}

function updateQuantity(productId, change) {
    let cart = getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity = (item.quantity || 1) + change;
        if (item.quantity < 1) {
            removeFromCart(productId);
            return;
        }
        saveCart(cart);
        updateCartCount();
        if (window.location.pathname.includes('cart.html')) {
            loadCartPage();
        }
    }
}

function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        localStorage.removeItem('cart');
        updateCartCount();
        if (window.location.pathname.includes('cart.html')) {
            loadCartPage();
        }
    }
}

// Cart Page Functionality
function loadCartPage() {
    const cartTable = document.getElementById('cart-table');
    if (!cartTable) return;

    const cart = getCart();
    const tbody = cartTable.querySelector('tbody');
    
    if (cart.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px;">Your cart is empty</td></tr>';
        document.getElementById('cart-subtotal').textContent = '$0.00';
        document.getElementById('cart-tax').textContent = '$0.00';
        document.getElementById('cart-total').textContent = '$0.00';
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) checkoutBtn.disabled = true;
        return;
    }

    let subtotal = 0;
    let html = '';

    cart.forEach(item => {
        const itemTotal = item.price * (item.quantity || 1);
        subtotal += itemTotal;
        
        html += `
            <tr>
                <td>${item.name}</td>
                <td>${formatPrice(item.price)}</td>
                <td>
                    <button onclick="updateQuantity(${item.id}, -1)" style="padding: 5px 10px; margin: 0 5px;">-</button>
                    ${item.quantity || 1}
                    <button onclick="updateQuantity(${item.id}, 1)" style="padding: 5px 10px; margin: 0 5px;">+</button>
                </td>
                <td>${formatPrice(itemTotal)}</td>
                <td>
                    <button onclick="removeFromCart(${item.id})" class="btn-remove" style="background: #ff4444; color: white; border: none; padding: 5px 10px; border-radius: 3px;">Remove</button>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
    
    const tax = subtotal * 0.10; // 10% tax
    const total = subtotal + tax;
    
    document.getElementById('cart-subtotal').textContent = formatPrice(subtotal);
    document.getElementById('cart-tax').textContent = formatPrice(tax);
    document.getElementById('cart-total').textContent = formatPrice(total);
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) checkoutBtn.disabled = false;
}

// Checkout Page Functionality
function loadCheckoutPage() {
    const checkoutItems = document.getElementById('checkout-items');
    if (!checkoutItems) return;

    const cart = getCart();
    let subtotal = 0;
    let html = '';

    if (cart.length === 0) {
        html = '<div class="checkout-item" style="text-align: center; padding: 20px;">Your cart is empty</div>';
        checkoutItems.innerHTML = html;
        return;
    }

    cart.forEach(item => {
        const itemTotal = item.price * (item.quantity || 1);
        subtotal += itemTotal;
        
        html += `
            <div class="checkout-item" style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
                <span>${item.name} × ${item.quantity || 1}</span>
                <span>${formatPrice(itemTotal)}</span>
            </div>
        `;
    });

    checkoutItems.innerHTML = html;
    
    const shipping = 599; // $5.99 in cents
    const tax = subtotal * 0.10;
    const total = subtotal + tax + shipping;
    
    document.getElementById('summary-subtotal').textContent = formatPrice(subtotal);
    document.getElementById('summary-shipping').textContent = formatPrice(shipping);
    document.getElementById('summary-tax').textContent = formatPrice(tax);
    document.getElementById('summary-total').textContent = formatPrice(total);

    // Setup checkout form submission
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            processOrder();
        });
    }
}

function processOrder() {
    const cart = getCart();
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    // Save order details for invoice
    const order = {
        items: [...cart], // copy cart items
        date: new Date().toLocaleString(),
        shipping: document.getElementById('checkout-name').value,
        address: document.getElementById('checkout-address').value,
        total: document.getElementById('summary-total').textContent
    };
    localStorage.setItem('currentOrder', JSON.stringify(order));
    
    // Clear cart and redirect to invoice
    localStorage.removeItem('cart');
    updateCartCount();
    window.location.href = './invoice.html';
}

// Invoice Page Functionality
function loadInvoicePage() {
    const invoiceDetails = document.getElementById('invoice-details');
    if (!invoiceDetails) return;

    const order = JSON.parse(localStorage.getItem('currentOrder'));
    
    if (!order) {
        invoiceDetails.innerHTML = '<div class="invoice-container" style="text-align: center; padding: 40px;"><h2>No order found</h2><p>Please complete a purchase first.</p></div>';
        return;
    }

    let itemsHtml = '';
    let subtotal = 0;

    order.items.forEach(item => {
        const itemTotal = item.price * (item.quantity || 1);
        subtotal += itemTotal;
        itemsHtml += `
            <div class="invoice-item" style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
                <span>${item.name} × ${item.quantity || 1}</span>
                <span>${formatPrice(itemTotal)}</span>
            </div>
        `;
    });

    const shipping = 599;
    const tax = subtotal * 0.10;
    const total = subtotal + tax + shipping;

    invoiceDetails.innerHTML = `
        <div class="invoice-container" style="max-width: 600px; margin: 0 auto; padding: 30px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div class="invoice-header" style="text-align: center; margin-bottom: 30px;">
                <h2>🌿 LivingLeaf Supplies</h2>
                <h3>Order Confirmation</h3>
                <p>Thank you for your purchase!</p>
            </div>
            
            <div class="invoice-details" style="margin-bottom: 20px;">
                <p><strong>Order Date:</strong> ${order.date}</p>
                <p><strong>Shipping To:</strong> ${order.shipping}</p>
                <p><strong>Address:</strong> ${order.address}</p>
            </div>
            
            <div class="invoice-items" style="margin-bottom: 20px;">
                <h4>Order Items:</h4>
                ${itemsHtml}
            </div>
            
            <div class="invoice-totals" style="border-top: 2px solid #2e8b57; padding-top: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span>Subtotal:</span>
                    <span>${formatPrice(subtotal)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span>Shipping:</span>
                    <span>${formatPrice(shipping)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span>Tax (10%):</span>
                    <span>${formatPrice(tax)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 1.2em; font-weight: bold; color: #2e8b57;">
                    <span>Total:</span>
                    <span>${formatPrice(total)}</span>
                </div>
            </div>
            
            <div class="invoice-footer" style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                <p>Your plants will be shipped within 2-3 business days.</p>
                <button onclick="window.location.href='./shop.html'" class="btn-primary" style="background: #2e8b57; color: white; border: none; padding: 12px 24px; border-radius: 5px; cursor: pointer; margin-top: 15px;">
                    Continue Shopping
                </button>
            </div>
        </div>
    `;
}

// Initialize pages based on current page
document.addEventListener('DOMContentLoaded', function() {
    console.log("Page loaded!");
    
    // Always update cart count on every page
    updateCartCount();
    
    // Initialize specific page functionality
    if (window.location.pathname.includes('cart.html')) {
        loadCartPage();
    } else if (window.location.pathname.includes('checkout.html')) {
        loadCheckoutPage();
    } else if (window.location.pathname.includes('invoice.html')) {
        loadInvoicePage();
    }
    
    // Add event listeners for filter tabs
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
    console.log(`Filtering products by: ${category}`);
    // This function can be implemented for product filtering
}