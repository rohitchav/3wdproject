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

    <!-- Main Container -->
    <div class="purchase-container">

        <!-- Header with border and button -->
        <div class="purchase-header-bordered">
            <h2><i class="fas fa-file-invoice"></i> Purchase Management</h2>
            <button class="add-button" ng-click="openModal()">+ Add Purchase</button>
        </div>

        <!-- Cards -->
        <div class="purchase-cards">
            <div class="purchase-card" ng-repeat="p in purchases">
                <h3 class="supplier-name">{{ p.supplier }}</h3>
                <hr class="card-divider">
                <p><strong>Amount:</strong> <span class="amount">₹{{ p.amount }}</span></p>
                <p><strong>Date:</strong> {{ p.date }}</p>

                <div class="bill-image">
                    <img ng-if="p.billPath" ng-src="{{p.billPath}}" alt="Bill Image">
                    <span ng-if="!p.billPath">No Bill</span>
                </div>

                <div class="card-buttons">
                    <button class="view-btn" ng-if="p.billPath" ng-click="viewBill(p.billPath)">View Bill</button>
                    <button class="delete-btn" ng-click="deletePurchase(p.id)">Delete</button>
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
            <h3>Add New Purchase</h3>
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

<script>
angular.module('purchaseApp', [])
.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function() {
                scope.$apply(function() {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}])
.controller('PurchaseController', function($scope, $http) {
    $scope.showModal = false;
    $scope.purchases = [];

    $scope.loadPurchases = function() {
        $http.get("PurchaseServlet?action=list").then(function(response) {
            $scope.purchases = response.data;
        });
    };

    $scope.openModal = function() {
        $scope.newPurchase = {};
        $scope.showModal = true;
    };

    $scope.closeModal = function() {
        $scope.showModal = false;
    };

    $scope.submitPurchase = function() {
        var fd = new FormData();
        fd.append("supplier", $scope.newPurchase.supplier);
        fd.append("amount", $scope.newPurchase.amount);
        fd.append("billFile", $scope.newPurchase.billFile);

        $http.post("PurchaseServlet", fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).then(function(response) {
            $scope.loadPurchases();
            $scope.closeModal();
        });
    };

    $scope.viewBill = function(path) {
        window.open(path, '_blank');
    };

    $scope.deletePurchase = function(id) {
        if(confirm("Are you sure you want to delete this purchase?")) {
            $http.post("PurchaseServlet?action=delete", {id: id}).then(function(response) {
                $scope.purchases = $scope.purchases.filter(p => p.id !== id);
            });
        }
    };

    $scope.loadPurchases();
});
</script>

</body>
</html>
