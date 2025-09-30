<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
   <%
    String vlang = (String)session.getAttribute("vlang");
    if (vlang==null) {
       session.setAttribute("vlang", "EN");
    }
    %>
   
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Inventory</title>
 <link rel="stylesheet" href="assets/css/home.css">
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>
<body>
  <div class="navbar">
    <div class="logo">
        <a href="home.jsp" class="logo-link">
            <img src="assets/images/logo.jpg" alt="icon">
            <c:out value="${lblHead}" default="Kirana Store"/>
        </a>
    </div>
    <div class="nav-options">
        <button class="billing-btn"><c:out value="${lblBilling}"/></button>
        <i class="fas fa-shopping-cart cart-icon"></i>
       <select class="lang-select" onchange="window.location.href='inventory?lang='+this.value">
             <option value="EN" ${sessionScope.vlang == 'EN' ? 'selected' : ''}>EN</option>
             <option value="MR" ${sessionScope.vlang == 'MR' ? 'selected' : ''}>Marathi</option>
       </select>

        <div class="profile-icon"><i class="fas fa-user-circle"></i></div>
    </div>
  
</div>
  <div class="container">
     <%@ include file="sidebar.jsp" %>
    </div>
</body>
</html>