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
<meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Dashboard | Kirana Store</title>
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

        <div class="dashboard-wrapper">

            <div class="dashboard-filters">
                <button type="button" ng-click="loadStats('today')" ng-class="{'active': filter==='today'}">${lblToday}</button>
                <button type="button" ng-click="loadStats('last7')" ng-class="{'active': filter==='last7'}">${lblLast7Day}</button>
                <button type="button" ng-click="loadStats('month')" ng-class="{'active': filter==='month'}">${lblThisMonth}</button>
                <button type="button" ng-click="loadStats('all')" ng-class="{'active': filter==='all'}">${lblAllTime}</button>
            </div>

            <div class="dashboard-section">
                <h2 class="section-title"><i class="fas fa-chart-line"></i> ${lblTranscationSummary}</h2>

                <div class="dashboard-cards four-col-grid">
                    <div class="card total-sales">
                        <h3><i class="fas fa-dollar-sign"></i> ${lblTotalSale}</h3>
                        <p>₹{{ stats.totalSales }}</p>
                    </div>

                    <div class="card transactions">
                        <h3><i class="fas fa-exchange-alt"></i> ${lblTransaction}</h3>
                        <p>{{ stats.transactions }}</p>
                    </div>

                    <div class="card items-sold">
                        <h3><i class="fas fa-box"></i> ${lblItemSold}</h3>
                        <p>{{ stats.itemsSold }}</p>
                    </div>

                    <div class="card avg-bill">
                        <h3><i class="fas fa-receipt"></i> ${lblAvgBill}</h3>
                        <p>₹{{ stats.avgBill }}</p>
                    </div>
                </div>
            </div>

            <div class="dashboard-section">
                <h2 class="section-title"><i class="fas fa-chart-pie"></i>${lblProfitLoss}</h2>

                <div class="dashboard-cards five-col-grid">
                    <div class="card revenue">
                        <h3><i class="fas fa-coins"> </i> ${lbltotalRevenue}</h3>
                        <p>₹{{ stats.totalRevenue }}</p>
                    </div>

                    <div class="card cogs">
                        <h3><i class="fas fa-cubes"></i> ${lblCostGooodSold}</h3>
                        <p>₹{{ stats.cogs }}</p>
                    </div>

                    <div class="card gross-profit highlight">
                        <h3><i class="fas fa-chart-line"></i> ${lblGrossProfit}</h3>
                        <p>₹{{ stats.grossProfit }}</p>
                    </div>

                    <div class="card expenses">
                        <h3><i class="fas fa-money-bill-wave"></i> ${lblTotalExpenses}</h3>
                        <p>₹{{ stats.totalExpenses }}</p>
                    </div>

                   <%--  <div class="card net-loss highlight-red">
                        <h3><i class="fas fa-arrow-down"></i> ${lblNetLoss}</h3>
                        <p>₹{{ stats.netLoss }}</p>
                    </div> --%>
                </div>
            </div>

        </div>
    </div>
</body>
</html>