<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<script src="https://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js"></script>

<div class="container" ng-app="BillingApp" ng-controller="BillingController">
    
    <div class="products-section">
        
        <div class="search-bar">
            <input type="text" id="searchInput" placeholder="Search for products...">
            <select id="categorySelect">
                <option value="all">${lblAllCategory}</option>
                  <option value="Snacks"> ${lblSnacks} </option>
                                <option value="Beverages"> ${lblBeverages} </option>
                                <option value="Dairy"> ${lblDairy} </option>
                                <option value="Household"> ${lblHousehold} </option>
                                <option value="Other"> ${lblOther} </option>
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
	        <button class="add-btn" ng-click="addToCart(p)">${lblAdd}</button>
	    </div>
	</div>

    </div>

 <div class="cart-container">
    <h2><i class="fa fa-shopping-cart"></i>${lblCurrentBill}</h2>
    <hr>

   <div class="cart-item" ng-repeat="item in cart">
    <img ng-src="{{item.image}}" alt="{{item.name}}">
    <div class="item-details">
        <p class="item-name">{{item.name}}</p>
        <p class="item-price">₹{{item.price * item.qty | number:2}}</p>
    </div>
    <div class="item-qty">
        <button ng-click="decreaseQty(item)" ng-disabled="item.qty <= 1">-</button>
        <input type="text" ng-model="item.qty" readonly>
        <button ng-click="increaseQty(item)" ng-disabled="item.qty >= item.stock">+</button>
    </div>
    <button class="delete-btn" ng-click="removeFromCart(item)">🗑️</button>
</div>


    <div class="bill-summary" ng-if="cart.length > 0">
        <p> ${lblSubTotal} : <span>₹{{getTotal() | number:2}}</span></p>
        <p> ${lblDiscount} :<span>₹{{discount | number:2}}</span></p>
        <hr>
        <p class="total">${lblTotal} : <span>₹{{getTotal() - discount | number:2}}</span></p>
    </div>

    <p ng-if="cart.length == 0">Your cart is empty.</p>

    <div class="buttons" ng-if="cart.length > 0">
         <button class="generate-btn" ng-click="generateBill()"> ${lblGenerateBill}</button>
        <button class="clear-btn" ng-click="clearCart()"> ${lblClearCart}</button>
    </div>

  <div id="invoiceModal" class="invoice-modal" ng-show="showInvoice">
    <div class="invoice">
        <h2> ${lblInvoice}</h2>
        <p class="store-name">Kirana Store</p>
        <p class="store-address">123 Market St, Phaltan, Maharashtra</p>
        
        <div class="bill-info">
            <span> ${lblBillNo} : #INV-{{billNo}}</span>
            <span> ${lblDate} : {{billDate}}</span>
        </div>

        <table>
            <thead>
                <tr>
                    <th> ${lblItem }</th>
                    <th>${lblQTY}</th>
                    <th> ${lblRate}</th>
                    <th> ${lblAmount}</th>
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
            <p>${lblDiscount}  : - ₹{{discount | number:2}}</p>
            <h3> ${lblTotal} : ₹{{getTotal() - discount | number:2}}</h3>
        </div>

      <div class="qr-section" ng-if="!showCustomerCredit">
         <qr-code data="upiData"></qr-code> 
          <p>Scan to Pay using UPI</p>
     </div>


        <div class="payment-buttons" ng-if="!showCustomerCredit">
		    <button class="cash" ng-click="payCash()"> ${lblPaidCash}</button>
		    <button class="upi" ng-click="payUPI()"> ${lblPaidUPI}</button>
		    <button class="card" ng-click="payCard()"> ${lblPaidCard}</button>
		    <button class="credit" ng-click="addToCredit()"> ${lblAddtoCredit}</button>
		</div>
		
	<div class="credit-selection" ng-if="showCustomerCredit">
    <label>${lblCustomerForCredit}</label>
    <div class="credit-dropdown">
	  <select
	    ng-model="selectedCustomer.id"
	    ng-options="customer.id as customer.name for customer in customers track by customer.id">
	    <option value="">-- Select Customer --</option>
	</select>



        <button class="add-button"  ng-click="openModal()" title="Add Customer">➕</button>
    </div>

    <div class="credit-actions">
        <button class="back" ng-click="showCustomerCreditBack()"> ${lblBack}</button>
        <button class="confirm-credit" ng-click="confirmCredit()"> ${lblConfirmCredit}</button>
    </div>
</div>

        <div class="invoice-actions" ng-if="!showCustomerCredit">
            <button class="download" ng-click="printInvoice()"> ${lblPrintInvoice}</button>
            <button class="cancel" ng-click="closeInvoice()"> ${lblcancel }</button>
        </div>
        
        
            <div class="modal-overlay" ng-show="showModal">
            <div class="modal">
                <h3>${lblAddCustomer}</h3>
                <form ng-submit="addCustomer()">
                    <label> ${lblCustomerName}</label>
                    <input type="text" ng-model="newCustomer.name" required>

                    <label> ${lblMobile}</label>
                    <input type="text" ng-model="newCustomer.phone" required>

                    <label>${lblAddress}</label>
                    <input type="text" ng-model="newCustomer.address">

                    <div class="modal-buttons">
                        <button type="button" class="cancel-btn" ng-click="closeModal()"> ${lblcancel}</button>
                        <button type="submit" class="add-btn"> ${lblAddCustomer}</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  </div>


</div><script src="assets/js/maincontent.js"></script>