<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Customer Debts | Kirana Store</title>
<link rel="icon" href="assets/images/debt.png" type="image/png">

<link rel="stylesheet" href="assets/css/common.css">
<link rel="stylesheet" href="assets/css/debts.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

<!-- AngularJS -->
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
</head>
<body>

<jsp:include page="navbar.jsp" />
<%@ include file="sidebar.jsp" %>

<div ng-app="debtsApp" ng-controller="DebtsController" class="debts-wrapper">

    <div class="debts-header">
        <h2><i class="fas fa-money-bill-wave"></i> ${lblCustomerDebts}</h2>
    </div>

    <div class="debts-list">
        <div class="debts-card" ng-repeat="c in customers" ng-click="openPayForm(c)">
            <h3 class="customer-name">{{c.name}}</h3>
            <p class="phone-number">{{c.phone}}</p>
            <p class="address">{{c.address}}</p>
            <hr>
            <div class="balance-row">
                <div>
                    <p class="balance-label"> ${lblOutstandingAmount}</p>
                    <p class="balance-amount">₹{{c.outstanding}}</p>
                </div>
            </div>
        </div>
        <div ng-if="customers.length == 0" style="margin-top:20px;">
            No customers with outstanding balance.
        </div>
    </div>

    <!-- Payment Modal -->
    <div class="modal-overlay" ng-show="showModal">
        <div class="modal">
            <h3>${lblPayDebts}</h3>
            <form ng-submit="payDebt()">
                <label> ${lblName}</label>
                <input type="text" ng-model="selectedCustomer.name" readonly>

                <label>${lblMobile}</label>
                <input type="text" ng-model="selectedCustomer.phone" readonly>

                <label>${lblOutstandingAmount}</label>
                <input type="text" ng-model="selectedCustomer.outstanding" readonly>

                <label> ${lblPaidAmount}</label>
                <input type="number" ng-model="paidAmount" min="0" placeholder="Enter amount to pay" required>

                <div class="modal-buttons">
                    <button type="button" class="btn-cancel" ng-click="closeModal()"> ${lblcancel}</button>
                    <button type="submit" class="btn-submit"> ${lblPay}</button>
                </div>
            </form>
        </div>
    </div>

</div>

<script src="assets/js/customerDebts.js"></script>
</body>
</html>
