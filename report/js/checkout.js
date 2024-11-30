// Dynamic Product Images
function getProductImages() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    return Array.from(thumbnails).map(thumb => thumb.src);
}

function changeImage(index) {
    const productImages = getProductImages();

    // Check if the index is within the range of productImages array
    if (index >= 0 && index < productImages.length) {
        document.getElementById('mainImage').src = productImages[index];
        document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
    } else {
        console.error('Index out of range for productImages array');
    }
}

// Quantity Input
function updateQuantity(change) {
    const input = document.getElementById('quantity');
    let newValue = parseInt(input.value) + change;
    if (newValue >= 1 && newValue <= 99) {
        input.value = newValue;
    }
}

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(productId, productName, productPrice, productImage, quantityInputId) {
    const quantityInput = document.getElementById(quantityInputId);
    const quantity = parseInt(quantityInput ? quantityInput.value : 1);

    const product = {
        id: productId,
        name: productName || document.querySelector('h1').textContent.trim(),
        price: productPrice || parseFloat(document.querySelector('.text-danger.me-2').textContent.replace('$', '')),
        image: productImage || document.getElementById('mainImage').src,
        quantity: quantity
    };

    const existingItemIndex = cart.findIndex(item => item.name === product.name);

    if (existingItemIndex !== -1) {
        const newQuantity = cart[existingItemIndex].quantity + quantity;
        if (newQuantity <= 99) {
            cart[existingItemIndex].quantity = newQuantity;
        }
    } else {
        cart.push(product);
    }

    saveCartToLocalStorage();
    updateCart();

    // Show offcanvas if it exists
    const cartOffcanvas = document.getElementById('cartOffcanvas');
    if (cartOffcanvas && bootstrap && bootstrap.Offcanvas) {
        const offcanvas = new bootstrap.Offcanvas(cartOffcanvas);
        offcanvas.show();
    }
}

function updateCartItemQuantity(index, change) {
    const newQuantity = cart[index].quantity + change;
    if (newQuantity >= 1 && newQuantity <= 99) {
        cart[index].quantity = newQuantity;
        saveCartToLocalStorage();
        updateCart();
    }
}

function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartCount = document.getElementById('cartCount');

    if (!cartItems || !cartTotal || !cartCount) return;

    cartItems.innerHTML = '';
    let total = 0;
    let itemCount = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        itemCount += item.quantity;

        cartItems.innerHTML += `
            <div class="card mb-2">
                <div class="card-body">
                    <div class="d-flex">
                        <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover;">
                        <div class="ms-3 flex-grow-1">
                            <h6 class="mb-0">${item.name}</h6>
                            <p class="mb-0">$${item.price.toFixed(2)} × ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}</p>
                            <div class="d-flex align-items-center mt-2">
                                <div class="input-group input-group-sm me-2" style="width: 100px;margin-bottom: 0px;">
                                    <button class="btn btn-outline-secondary" type="button" 
                                            onclick="updateCartItemQuantity(${index}, -1)">-</button>
                                    <input type="number" class="form-control text-center" 
                                           value="${item.quantity}" readonly>
                                    <button class="btn btn-outline-secondary" type="button" 
                                            onclick="updateCartItemQuantity(${index}, 1)">+</button>
                                </div>
                                <button class="btn btn-sm btn-danger" onclick="removeFromCart(${index})">Remove</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    cartTotal.textContent = `$${total.toFixed(2)}`;
    cartCount.textContent = itemCount;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCartToLocalStorage();
    updateCart();
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    window.location.href = 'checkout.html';

}

// Initialize cart display on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCart();
});

/* Load checkout items */
function loadOrderSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const orderItems = document.getElementById('orderItems');
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');

    let subtotal = 0;
    orderItems.innerHTML = '';

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        orderItems.innerHTML += `
            <div class="d-flex gap-3 mb-3">
                <img src="${item.image}" alt="${item.name}" class="product-image">
                <div class="flex-grow-1">
                    <h6 class="mb-1">${item.name}</h6>
                    <p class="mb-0">Quantity: ${item.quantity}</p>
                    <p class="mb-0">$${item.price.toFixed(2)} × ${item.quantity}</p>
                </div>
                <div class="text-end">
                    <strong>$${itemTotal.toFixed(2)}</strong>
                </div>
            </div>
        `;
    });

    const shipping = 5.00;
    const total = subtotal + shipping;

    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    totalEl.textContent = `$${total.toFixed(2)}`;
}

function processOrder() {
    // Validate form
    const requiredFields = document.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value) {
            field.classList.add('is-invalid');
            isValid = false;
        } else {
            field.classList.remove('is-invalid');
        }
    });

    if (!isValid) {
        alert('Please fill in all required fields');
        return;
    }

    // Process order (mock)
    localStorage.removeItem('cart');
    window.location.href = 'order-confirmation.html';
}

// Initialize page
document.addEventListener('DOMContentLoaded', loadOrderSummary);

/* Load User Data */
function getCurrentUserData() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) return null;

    const users = localStorage.getItem('users');
    if (!users) return null;

    const usersData = JSON.parse(users);
    return usersData[currentUser.email];
}

function autofillCheckoutForm() {
    const userData = getCurrentUserData();
    if (!userData) {
        console.log('No user data found');
        return;
    }

    document.getElementById('firstName').value = userData.fullName.split(' ')[0] || '';
    document.getElementById('lastName').value = userData.fullName.split(' ')[1] || '';
    document.getElementById('email').value = userData.email || '';

    const addressParts = userData.address ? userData.address.split(',') : [];
    if (addressParts.length >= 1) {
        document.getElementById('address').value = addressParts[0].trim();
    }
    if (addressParts.length >= 2) {
        document.getElementById('city').value = addressParts[1].trim();
    }
    if (addressParts.length >= 3) {
        const stateSelect = document.getElementById('state');
        const state = addressParts[2].trim();
        for (let option of stateSelect.options) {
            if (option.text.toLowerCase() === state.toLowerCase()) {
                option.selected = true;
                break;
            }
        }
    }
    if (addressParts.length >= 4) {
        document.getElementById('zip').value = addressParts[3].trim();
    }

    if (userData.creditCard) {
        document.getElementById('cardNumber').value = '****-****-****-' + userData.creditCard.slice(-4);
    }
    if (userData.expiryDate) {
        document.getElementById('expDate').value = userData.expiryDate;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    autofillCheckoutForm();

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const orderItems = document.getElementById('orderItems');
    let subtotal = 0;

    orderItems.innerHTML = '';

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        orderItems.innerHTML += `
            <div class="d-flex mb-3">
                <div class="me-3">
                    <img src="${item.image}" alt="${item.name}" class="product-image">
                </div>
                <div class="flex-grow-1">
                    <h6 class="mb-0">${item.name}</h6>
                    <small class="text-muted">Quantity: ${item.quantity}</small>
                </div>
                <div>
                    $${itemTotal.toFixed(2)}
                </div>
            </div>
        `;
    });

    // Update totals
    const shipping = 5.00;
    const total = subtotal + shipping;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
});

// Function to handle order processing
function processOrder() {
    const requiredFields = ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zip', 'cardNumber', 'expDate', 'cvv'];
    const missingFields = requiredFields.filter(field => !document.getElementById(field).value);

    if (missingFields.length > 0) {
        alert('Please fill in all required fields');
        return;
    }

    alert('Order placed successfully!');
    localStorage.removeItem('cart');
    window.location.href = '../index.html';
}