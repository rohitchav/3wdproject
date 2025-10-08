<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<%
    String vlang = (String) session.getAttribute("vlang");
    if (vlang == null) {
        session.setAttribute("vlang", "EN");
    }
%>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Purchase | Kirana Store</title>
    <link rel="stylesheet" href="assets/css/common.css">
    <link rel="stylesheet" href="assets/css/purchase.css">

    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>
<body>

<jsp:include page="navbar.jsp">
    <jsp:param name="servlet" value="PurchaseServlet"/>
</jsp:include>

<div ng-app="purchaseApp" ng-controller="PurchaseController" class="main-layout">

    <%@ include file="sidebar.jsp" %>

    <!-- Main Purchase Section -->
    <div class="purchase-container">
        <div class="header-purchase">
            <h2><i class="fas fa-file-invoice"></i> ${lblPurchaseTitle}</h2>
            <div class="search-add">
                <input type="text" placeholder="Search purchases..." class="search-box"
                       ng-model="searchQuery" ng-change="searchPurchases()">
                <button class="add-button" ng-click="openModal()"> ${lblAddPurchase}</button>
            </div>
        </div>

        <!-- Purchase Cards -->
        <div class="purchase-list" ng-repeat="p in purchases | filter:searchQuery">
            <div class="purchase-card">
                <h3 class="supplier-name">{{ p.supplier }}</h3>
                <hr>
                <p><strong>${lblPurchaseAmount} :</strong> ₹{{ p.amount }}</p>
                <p><strong>${lblPurchaseDate} :</strong> {{ p.date }}</p>

                <div class="bill-image">
                    <img ng-if="p.billPath" ng-src="{{p.billPath}}" alt="Bill Image">
                    <span ng-if="!p.billPath">No Bill</span>
                </div>

                <div class="card-buttons">
                    <button class="view-btn" ng-if="p.billPath" ng-click="viewBill(p.billPath)">${lblViewBill}</button>
                    <button class="delete-btn" ng-click="deletePurchase(p.id)">${lblDeleteBill}</button>
                </div>
            </div>
        </div>

        <div ng-if="purchases.length === 0" class="empty-message">
            No purchases have been recorded yet.
        </div>
    </div>

    <!-- Add Purchase Modal -->
    <div class="modal-overlay" ng-show="showModal">
        <div class="modal">
            <h3>${lblAddNewPurchase}</h3>
            <form ng-submit="submitPurchase()" enctype="multipart/form-data">
                <label>Supplier Name</label>
                <input type="text" ng-model="newPurchase.supplier" required>

                <label>Purchase Amount (₹)</label>
                <input type="number" ng-model="newPurchase.amount" step="0.01" required>

                <label>Bill Photo</label>
                <input type="file" file-model="newPurchase.billFile">

                <div class="modal-buttons">
                    <button type="button" class="cancel-btn" ng-click="closeModal()">Cancel</button>
                    <button type="submit" class="add-btn">Save</button>
                </div>
            </form>
        </div>
    </div>
</div>

<script type="text/javascript" src="assets/js/purchase.js"></script>

</body>
</html>
