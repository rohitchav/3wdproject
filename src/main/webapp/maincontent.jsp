<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<div class="container">
    
    <!-- Products Section -->
    <div class="products-section">
        <h2>Billing Section</h2>
        <div class="search-bar">
            <input type="text" id="searchInput" placeholder="Search for products...">
            <select id="categorySelect">
                <option value="all">All Categories</option>
                <option value="Dairy">Dairy</option>
                <option value="Household">Household</option>
            </select>
        </div>

        <div class="products" id="productList">
            <!-- Example Products -->
            <div class="product-card" data-category="Dairy" data-name="Amul Milk">
                <div class="product-image">
                    <img src="assets/images/amul_milk.jpg" alt="Amul Milk">
                    <span class="stock">Stock: 20</span>
                </div>
                <h3>Amul Milk</h3>
                <p class="category">Dairy</p>
                <p class="price">₹50</p>
                <button class="add-btn" onclick="addToCart('Amul Milk', 50)">+ Add</button>
            </div>

            <div class="product-card" data-category="Household" data-name="Tata Salt">
                <div class="product-image">
                    <img src="assets/images/tata_salt.jpg" alt="Tata Salt">
                    <span class="stock">Stock: 15</span>
                </div>
                <h3>Tata Salt</h3>
                <p class="category">Household</p>
                <p class="price">₹25</p>
                <button class="add-btn" onclick="addToCart('Tata Salt', 25)">+ Add</button>
            </div>

            <!-- You can add more products here -->
        </div>
    </div>

    <!-- Current Bill Section -->
    <div class="cart-section">
        <h3>Current Bill</h3>
        <div id="cartItems">
            Your cart is empty.
        </div>
    </div>
</div>

<script src="assets/js/maincontent.js"></script>
