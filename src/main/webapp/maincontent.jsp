<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!-- 1. Include the QR Code Library here -->
<script src="https://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js"></script>

<div class="container" ng-app="BillingApp" ng-controller="BillingController">
    
    <!-- Products Section -->
    <div class="products-section">
        <!-- ... (Products section remains the same) ... -->
        
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
	            <!-- Assuming image path is correct -->
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

    <!-- Dynamic Cart Items -->
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

    <!-- Bill Summary -->
    <div class="bill-summary" ng-if="cart.length > 0">
        <p>Subtotal: <span>₹{{getTotal() | number:2}}</span></p>
        <p>Discount: <span>₹{{discount | number:2}}</span></p>
        <hr>
        <p class="total">Total: <span>₹{{getTotal() - discount | number:2}}</span></p>
    </div>

    <p ng-if="cart.length == 0">Your cart is empty.</p>

    <div class="buttons" ng-if="cart.length > 0">
         <button class="generate-btn" ng-click="generateBill()">Generate Bill</button>
        <button class="clear-btn" ng-click="clearCart()">Clear Cart</button>
    </div>

  <!-- Invoice Modal -->
  <div id="invoiceModal" class="invoice-modal" ng-show="showInvoice">
    <div class="invoice">
        <h2>Invoice</h2>
        <p class="store-name">Kirana Store</p>
        <p class="store-address">123 Market St, Phaltan, Maharashtra</p>
        
        <div class="bill-info">
            <span>Bill No: #INV-{{billNo}}</span>
            <span>Date: {{billDate}}</span>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Rate</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr ng-repeat="item in cart">
                    <td>{{item.name}}</td>
                    <td>{{item.qty}}</td>
                    <td>₹{{item.price | number:2}}</td>
                    <td>₹{{item.price * item.qty | number:2}}</td>
                </tr>
            </tbody>
        </table>

        <div class="totals">
            <p>Subtotal: ₹{{getTotal() | number:2}}</p>
            <p>Discount: - ₹{{discount | number:2}}</p>
            <h3>Grand Total: ₹{{getTotal() - discount | number:2}}</h3>
        </div>

        <div class="qr-section">
            <!-- 2. Replaced static image with dynamic QR code directive -->
            <qr-code data="upiData"></qr-code> 
            <p>Scan to Pay using UPI</p>
        </div>

        <div class="payment-buttons">
            <button class="cash" ng-click="payCash()">Paid in Cash</button>
            <button class="upi" ng-click="payUPI()">Paid by UPI</button>
            <button class="card" ng-click="payCard()">Paid by Card</button>
            <button class="credit" ng-click="addToCredit()">Add to Credit</button>
        </div>

        <div class="invoice-actions">
            <button class="download" ng-click="printInvoice()">Print Invoice</button>
            <button class="cancel" ng-click="closeInvoice()">Cancel</button>
        </div>
    </div>
  </div>


</div><!-- Cart Container -->




<script src="assets/js/maincontent.js"></script>
