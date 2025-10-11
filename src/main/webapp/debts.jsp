<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Customer Debts | Kirana Store</title>
<link rel="stylesheet" href="assets/css/common.css">
<link rel="stylesheet" href="assets/css/debts.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>
<body>

<jsp:include page="navbar.jsp" />
<%@ include file="sidebar.jsp" %>

<div class="debts-wrapper">
    <div class="debts-header">
        <h2><i class="fas fa-money-bill-wave"></i> Customer Debts</h2>
    </div>

    <div class="debts-list">
        <c:forEach var="c" items="${debtors}">
            <div class="debts-card">
                <h3 class="customer-name">${c.name}</h3>
                <p class="phone-number">${c.phone}</p>
                <p class="address">${c.address}</p>
                <hr>
                <div class="balance-row">
                    <div>
                        <p class="balance-label">${lblOutstandingAmount}</p>
                        <p class="balance-amount">₹${c.outstanding}</p>
                    </div>
                </div>
            </div>
        </c:forEach>
        <c:if test="${empty debtors}">
            <p style="margin-top:20px;">No customers with outstanding balance.</p>
        </c:if>
    </div>
</div>

</body>
</html>
