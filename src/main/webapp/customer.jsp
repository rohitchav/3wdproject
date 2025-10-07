<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%
    String vlang = (String)session.getAttribute("vlang");
    if (vlang == null) {
        session.setAttribute("vlang", "EN");
    }
%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Customers | Kirana Store</title>
    <link rel="icon" href="assets/images/customer.png" type="image/png">
    <link rel="stylesheet" href="assets/css/common.css">
    <link rel="stylesheet" href="assets/css/customer.css">
    
    <!-- AngularJS -->
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>
<body>
    <!-- Only ONE navbar include is needed -->
    <jsp:include page="navbar.jsp">
        <jsp:param name="servlet" value="CustomerServlet"/>
    </jsp:include>

    <!-- ✅ Start AngularJS App Block -->
    <div ng-app="customerApp" ng-controller="CustomerController">

        <!-- Sidebar -->
        <div>
            <%@ include file="sidebar.jsp" %>
        </div>

        <!-- Main Customer Section -->
        <div class="customer-container">
            <div class="header-customer">
                <h2><span class="icon">👥</span> Customer Management</h2>
                <div class="search-add">
                    <input type="text" placeholder="Search customers..." class="search-box">
                    <button class="add-button" ng-click="openModal()">Add New Customer</button>
                </div>
            </div>

            <!-- Example Static Customer -->
            <div class="customer-list">
                <div class="customer-card">
                    <h3 class="customer-name">Rohit Chavan</h3>
                    <p class="phone-number">9326981878</p>
                    <hr>
                    <p class="balance-label">Outstanding Balance</p>
                    <p class="balance-amount">₹0.00</p>
                </div>
            </div>
        </div>

        <!-- ✅ Modal must be INSIDE Angular block -->
        <div class="modal-overlay" ng-show="showModal">
            <div class="modal">
                <h3>Add New Customer</h3>
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

    </div> <!-- ✅ End Angular App Block -->

    <script type="text/javascript" src="assets/js/customer.js"></script>
</body>
</html>
