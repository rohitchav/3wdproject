let cart = [];

// Add product to cart
function addToCart(name, price) {
    const itemIndex = cart.findIndex(item => item.name === name);
    if (itemIndex > -1) {
        cart[itemIndex].quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    renderCart();
}

// Render current bill
function renderCart() {
    const cartDiv = document.getElementById("cartItems");
    if (cart.length === 0) {
        cartDiv.innerHTML = "Your cart is empty.";
        return;
    }
    let html = "";
    let total = 0;
    cart.forEach(item => {
        html += `<div class="cart-item">
                    <span>${item.name} x${item.quantity}</span>
                    <span>₹${item.price * item.quantity}</span>
                 </div>`;
        total += item.price * item.quantity;
    });
    html += `<hr><div class="cart-item"><strong>Total</strong><strong>₹${total}</strong></div>`;
    cartDiv.innerHTML = html;
}

// Search and filter products
document.getElementById("searchInput").addEventListener("input", filterProducts);
document.getElementById("categorySelect").addEventListener("change", filterProducts);

function filterProducts() {
    const searchText = document.getElementById("searchInput").value.toLowerCase();
    const category = document.getElementById("categorySelect").value;

    const products = document.querySelectorAll(".product-card");
    products.forEach(product => {
        const name = product.dataset.name.toLowerCase();
        const prodCategory = product.dataset.category;
        if ((name.includes(searchText) || searchText === "") &&
            (category === "all" || category === prodCategory)) {
            product.style.display = "block";
        } else {
            product.style.display = "none";
        }
    });
}
