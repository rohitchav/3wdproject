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
<title>Dashboard | Kirana Store</title>
<link rel="icon" href="assets/images/dashboard.jpg" type="image/png">
<link rel="stylesheet" href="assets/css/common.css">
<link rel="stylesheet" href="assets/css/dashboard.css">

<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
<script src="assets/js/dashboard.js"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>

<body>
<jsp:include page="navbar.jsp">
    <jsp:param name="servlet" value="DashboardServlet"/>
</jsp:include>

<div ng-app="dashboardApp" ng-controller="DashboardController" class="dashboard-main-container">
    <%@ include file="sidebar.jsp" %>

    <!-- ✅ Entire Dashboard Content Inside One Form -->
    <form class="dashboard-wrapper">

        <!-- Filter Buttons -->
        <div class="dashboard-filters">
            <button type="button" ng-click="loadStats('today')" ng-class="{'active': filter==='today'}">Today</button>
            <button type="button" ng-click="loadStats('last7')" ng-class="{'active': filter==='last7'}">Last 7 Days</button>
            <button type="button" ng-click="loadStats('month')" ng-class="{'active': filter==='month'}">This Month</button>
            <button type="button" ng-click="loadStats('all')" ng-class="{'active': filter==='all'}">All Time</button>
        </div>

        <!-- Dashboard Cards Section -->
        <div class="dashboard-cards">
            <div class="card total-sales">
                <h3><i class="fas fa-dollar-sign"></i> Total Sales</h3>
                <p>₹{{ stats.totalSales }}</p>
            </div>

            <div class="card transactions">
                <h3><i class="fas fa-exchange-alt"></i> Transactions</h3>
                <p>{{ stats.transactions }}</p>
            </div>

            <div class="card items-sold">
                <h3><i class="fas fa-box"></i> Items Sold</h3>
                <p>{{ stats.itemsSold }}</p>
            </div>

            <div class="card avg-bill">
                <h3><i class="fas fa-receipt"></i> Avg. Bill Value</h3>
                <p>₹{{ stats.avgBill }}</p>
            </div>
        </div>

    </form> 
</div>

</body>
</html>
