</html>

<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<html>
<head>
    <title>Kirana Store</title>
    <%@include file="csslink.jsp" %>
</head>
<body>
    <!-- Navbar -->
    <div class="navbar">
         <div class="logo"><span><img src="assets/images/logo.jpg" alt="icon"></span> <c:out value="${lblHead}" default="Kirana Store"/>
</div>
        <div class="nav-options">
            <button class="billing-btn"><c:out value="${lblBilling}"/></button>
            <i class="fas fa-shopping-cart cart-icon"></i>
            <select class="lang-select" onchange="window.location.href='HomeServlet?lang='+this.value">
                  <option value="EN" ${vlang == 'EN' ? 'selected' : ''}>EN</option>
                  <option value="MR" ${vlang == 'MR' ? 'selected' : ''}>मराठी</option>
            </select>
 
            <div class="profile-icon"><i class="fas fa-user-circle"></i></div>
        </div>
    </div>

    <!-- Logout -->
    <a href="index.jsp"><c:out value="${lblLogout}"/></a>
</body>
</html>

