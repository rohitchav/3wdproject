<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html lang="en" ng-app="BillingTableApp">
<head>
    <meta charset="UTF-8">
    <title>Modern Themed Product Table</title>

    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
    </style>

    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
    <script src="https://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js"></script>

    <link rel="stylesheet" href="assets/css/billing.css">
    <link rel="stylesheet" href="assets/css/invoice.css">
</head>

<body ng-controller="BillingTableController" ng-keydown="handleKeyPress($event)">
<div class="container">

     <div class="search-area">
    <div class="search-box" style="position: relative; flex: 1;">
        <span class="search-icon">🔍</span>
        <input type="text"
               ng-model="searchQuery"
               ng-keyup="filterProducts()"
               placeholder="Search product name..."
               class="search-input">

       <!--  <ul class="suggestions-box" ng-if="filteredProducts.length > 0">
            <li ng-repeat="product in filteredProducts" ng-click="selectProduct(product)">
                {{product.name}} - ₹{{product.sellingPrice}}
            </li>
        </ul> -->
        <ul class="suggestions-box" ng-if="filteredProducts.length > 0">
		    <li ng-repeat="product in filteredProducts" 
		        ng-click="selectProduct(product)"
		        ng-class="{ 'highlighted': $index === selectedIndex }">
		        {{product.name}} - ₹{{product.sellingPrice}}
		    </li>
       </ul>
    </div>

    <button ng-click="filterProducts()" class="search-button">Search</button>
</div>


    <table class="product-table">
        <thead>
            <tr>
                <th class="product-name"> ${lblProductName}</th>
                <th class="qty"> ${lblQTY}</th>
                <th class="amount"> ${lblAmount}</th>
                <th class="action">${lblAction}</th>
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
                    <button ng-click="removeItem($index)" class="delete-btn">${lblDeleteBill}</button>
                </td>
            </tr>
        </tbody>

        <tfoot>
            <tr class="total-row">
                <td colspan="2" class="total-label"> ${lblTotal}</td>
                <td colspan="2" class="total-amount">₹{{getTotalAmount() | number:2}}</td>
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
        <h2> ${lblInvoice}</h2>
        <p class="store-name">Kirana Store</p>
        <p class="store-address">123 Market St, Phaltan, Maharashtra</p>
        
        <div class="bill-info">
            <span> ${lblBillNo} : #INV-{{billNo}}</span>
            <span> ${lblDate} : {{billDateTime.toLocaleString()}}</span>
        </div>

        <table>
            <thead>
                <tr>
                    <th>${lblItem}</th>
                    <th>${lblQTY}</th>
                    <th>${lblRate}</th>
                    <th>${lblAmount}</th>
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
            <p> ${lblSubTotal} : ₹{{getTotal() | number:2}}</p>
            <p> ${lblDiscount} : - ₹{{discount | number:2}}</p>
            <h3> ${lblTotal} : ₹{{getTotal() - discount | number:2}}</h3>
        </div>

      <div class="qr-section" ng-if="!showCustomerCredit">
         <qr-code data="upiData"></qr-code> 
          <p>Scan to Pay using UPI</p>
     </div>


        <div class="payment-buttons" ng-if="!showCustomerCredit">
		    <button class="cash" ng-click="payCash()"> ${lblPaidCash}  </button>
		    <button class="upi" ng-click="payUPI()"> ${lblPaidUPI}</button>
		    <button class="card" ng-click="payCard()"> ${lblPaidCard}</button>
		    <button class="credit" ng-click="addToCredit()"> ${lblAddtoCredit} </button>
		</div>
		
	<div class="credit-selection" ng-if="showCustomerCredit">
    <label> ${lblSelectCustomerforCredit}</label>
    <div class="credit-dropdown">
	  <select
	    ng-model="selectedCustomer.id"
	    ng-options="customer.id as customer.name for customer in customers track by customer.id">
	    <option value="">-- ${lblSelectCustomer} --</option>
	</select>


        <button class="add-button"  ng-click="openModal()" title="Add Customer">➕</button>
    </div>

    <div class="credit-actions">
        <button class="back" ng-click="showCustomerCreditBack()"> ${lblBack}</button>
        <button class="confirm-credit" ng-click="confirmCredit()"> ${lblConfirmCredit} </button>
    </div>
</div>

        <div class="invoice-actions" ng-if="!showCustomerCredit">
            <button class="download" ng-click="printInvoice()"> ${lblPrintInvoice} </button>
            <button class="cancel" ng-click="closeInvoice()"> ${lblcancel}</button>
        </div>
        
        
            <div class="modal-overlay" ng-show="showModal">
            <div class="modal">
                <h3>${lblAddCustomer}</h3>
                <form ng-submit="addCustomer()">
                    <label>${lblCustomerName} </label>
                    <input type="text" ng-model="newCustomer.name" required>

                    <label> ${lblMobile} </label>
                    <input type="text" ng-model="newCustomer.phone" required>

                    <label> ${lblAddress} </label>
                    <input type="text" ng-model="newCustomer.address">

                    <div class="modal-buttons">
                        <button type="button" class="cancel-btn" ng-click="closeModal()"> ${lblcancel }</button>
                        <button type="submit" class="add-btn"> ${lblAddCustomer} </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  </div>

<script src="assets/js/billing.js"></script>

</body>
</html>