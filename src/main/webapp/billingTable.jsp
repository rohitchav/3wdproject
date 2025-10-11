<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html lang="en" ng-app="BillingTableApp">
<head>
    <meta charset="UTF-8">
    <title>Modern Themed Product Table</title>

    <!-- ✅ Google Font -->
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
    </style>

    <!-- ✅ AngularJS -->
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>

    <!-- ✅ CSS -->
    <link rel="stylesheet" href="assets/css/billing.css">
    <link rel="stylesheet" href="assets/css/invoice.css">
</head>

<body ng-controller="BillingTableController">
<div class="container">

     <div class="search-area">
    <div class="search-box" style="position: relative; flex: 1;">
        <span class="search-icon">🔍</span>
        <input type="text"
               ng-model="searchQuery"
               ng-keyup="filterProducts()"
               placeholder="Search product name..."
               class="search-input">

        <!-- Suggestions -->
        <ul class="suggestions-box" ng-if="filteredProducts.length > 0">
            <li ng-repeat="product in filteredProducts" ng-click="selectProduct(product)">
                {{product.name}} - ₹{{product.sellingPrice}}
            </li>
        </ul>
    </div>

    <button ng-click="filterProducts()" class="search-button">Search</button>
</div>


    <!-- 🔹 Product Table -->
    <table class="product-table">
        <thead>
            <tr>
                <th class="product-name">Product Name</th>
                <th class="qty">Qty</th>
                <th class="amount">Amount</th>
                <th class="action">Action</th>
            </tr>
        </thead>

        <tbody>
            <tr ng-repeat="item in cart">
                <td>{{item.name}}</td>
                <td>
                    <input type="number"
                           ng-model="item.qty"
                           ng-change="updateAmount(item)"
                           min="1"
                           style="width:60px;">
                </td>
                <td>₹{{item.amount}}</td>
                <td>
                    <button ng-click="removeItem($index)" class="delete-btn">Delete</button>
                </td>
            </tr>
        </tbody>

        <tfoot>
            <tr class="total-row">
                <td colspan="2" class="total-label">Total</td>
                <td colspan="2" class="total-amount">₹{{getTotalAmount()}}</td>
            </tr>
        </tfoot>
    </table>
    <div class="buttons" ng-if="cart.length > 0">
         <button class="generate-btn" ng-click="generateBill()"> ${lblGenerateBill}</button>
        <button class="clear-btn" ng-click="clearCart()"> ${lblClearCart}</button>
    </div>
</div>

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

      <div class="qr-section" ng-if="!showCustomerCredit">
         <qr-code data="upiData"></qr-code> 
          <p>Scan to Pay using UPI</p>
     </div>


        <div class="payment-buttons" ng-if="!showCustomerCredit">
		    <button class="cash" ng-click="payCash()">Paid in Cash</button>
		    <button class="upi" ng-click="payUPI()">Paid by UPI</button>
		    <button class="card" ng-click="payCard()">Paid by Card</button>
		    <button class="credit" ng-click="addToCredit()">Add to Credit</button>
		</div>
		
	<div class="credit-selection" ng-if="showCustomerCredit">
    <label>Select Customer for Credit</label>
    <div class="credit-dropdown">
	  <select
	    ng-model="selectedCustomer.id"
	    ng-options="customer.id as customer.name for customer in customers track by customer.id">
	    <option value="">-- Select Customer --</option>
	</select>



        <button class="add-button"  ng-click="openModal()" title="Add Customer">➕</button>
    </div>

    <div class="credit-actions">
        <button class="back" ng-click="showCustomerCreditBack()">Back</button>
        <button class="confirm-credit" ng-click="confirmCredit()">Confirm Credit</button>
    </div>
</div>

        <div class="invoice-actions" ng-if="!showCustomerCredit">
            <button class="download" ng-click="printInvoice()">Print Invoice</button>
            <button class="cancel" ng-click="closeInvoice()">Cancel</button>
        </div>
        
        
            <div class="modal-overlay" ng-show="showModal">
            <div class="modal">
                <h3>${lblAddCustomer}</h3>
                <form ng-submit="addCustomer()">
                    <label>Customer Name</label>
                    <input type="text" ng-model="newCustomer.name" required>

                    <label>Phone Number</label>
                    <input type="text" ng-model="newCustomer.phone" required>

                    <label>Address (Optional)</label>
                    <input type="text" ng-model="newCustomer.address">

                    <div class="modal-buttons">
                        <button type="button" class="cancel-btn" ng-click="closeModal()">Cancel</button>
                        <button type="submit" class="add-btn">Add Customer</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  </div>

<!-- ✅ AngularJS Script -->
<script src="assets/js/billing.js"></script>

</body>
</html>
