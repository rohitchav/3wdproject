<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>



<div class="container" ng-app="BillingApp" ng-controller="BillingController">
    
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
	    <div class="product-card" ng-repeat="p in products" data-category="{{p.category}}" data-name="{{p.name}}">
	        <div class="product-image">
	            <img ng-src="{{p.imagePath}}" alt="{{p.name}}">
	            <span class="stock">{{p.stock}}</span>
	        </div>
	        <h3>{{p.name}}</h3>
	        <p class="category">{{p.category}}</p>
	        <p class="price">₹{{p.sellingPrice}}</p>
	        <button class="add-btn" ng-click="addToCart(p)">Add</button>
	    </div>
	</div>

    </div>

 <div class="cart-container">
    <h2><i class="fa fa-shopping-cart"></i> Current Bill</h2>
    <hr>

    <!-- ✅ Dynamic Cart Items -->
    <div class="cart-item" ng-repeat="item in cart">
        <img ng-src="{{item.image}}" alt="{{item.name}}">
        <div class="item-details">
            <p class="item-name">{{item.name}}</p>
            <p class="item-price">₹{{item.price * item.qty}}</p>
        </div>
        <div class="item-qty">
            <button ng-click="decrementQty(item)">-</button>
            <input type="text" ng-model="item.qty" readonly>
            <button ng-click="incrementQty(item)">+</button>
        </div>
        <button class="delete-btn" ng-click="removeFromCart(item)">🗑️</button>
    </div>

    <!-- ✅ Bill Summary -->
    <div class="bill-summary" ng-if="cart.length > 0">
        <p>Subtotal: <span>₹{{getTotal()}}</span></p>
        <p>Discount: <input type="number" style="width:40px"></p>
        <hr>
        <p class="total">Total: <span>₹{{getTotal()}}</span></p>
    </div>

    <p ng-if="cart.length == 0">Your cart is empty.</p>

    <div class="buttons" ng-if="cart.length > 0">
        <button class="generate-btn">Generate Bill</button>
        <button class="clear-btn" ng-click="clearCart()">Clear Cart</button>
    </div>
</div>

</div>

<script src="assets/js/maincontent.js"></script>
