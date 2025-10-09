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
<title>Customer Debts | Kirana Store</title>
<link rel="icon" href="assets/images/debt.png" type="image/png">
<link rel="stylesheet" href="assets/css/common.css">
<link rel="stylesheet" href="assets/css/debts.css">

<!-- AngularJS -->
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>

<!-- Font Awesome -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

</head>
<body>
<jsp:include page="navbar.jsp">
    <jsp:param name="servlet" value="DebtsServlet"/>
</jsp:include>

<div ng-app="debtsApp" ng-controller="DebtsController" class="dashboard-main-container">
    <%@ include file="sidebar.jsp" %>

    <div class="debts-wrapper">

        <!-- Heading -->
        <div class="debts-header">
            <h2><i class="fas fa-money-bill-wave"></i> ${lblCustomerDebts}</h2>
        </div>

        <!-- Customer Cards -->
        <div class="debts-list">
            <div class="debts-card" ng-repeat="c in customers">
                <h3 class="customer-name">{{c.name}}</h3>
                <p class="phone-number">{{c.phone}}</p>
                <hr>
                <div class="balance-row">
                    <div>
                        <p class="balance-label">${lblOutstandingAmount}</p>
                        <p class="balance-amount">₹{{c.udharAmount}}</p>
                    </div>
                    <button type="button" class="btn-delete" ng-click="deleteCustomer(c.id)">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        </div>

    </div>
</div>

<script src="assets/js/debts.js"></script>
</body>
</html>
