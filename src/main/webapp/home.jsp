<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%
    String vlang = (String)session.getAttribute("vlang");
    if (vlang==null) {
       session.setAttribute("vlang", "EN");
    }
%>

<html>
<head>
    <title>Kirana Store</title>
    <link rel="stylesheet" href="assets/css/home.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>
<body>
    <!-- Navbar -->
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
       <select class="lang-select" onchange="window.location.href='HomeServlet?lang='+this.value">
             <option value="EN" ${sessionScope.vlang == 'EN' ? 'selected' : ''}>EN</option>
             <option value="MR" ${sessionScope.vlang == 'MR' ? 'selected' : ''}>Marathi</option>
       </select>

        <div class="profile-icon"><i class="fas fa-user-circle"></i></div>
    </div>
</div>
   

    <!-- MAIN LAYOUT -->
    <div class="container">
        <!-- LEFT SIDEBAR -->
      <!-- Sidebar -->
		<%@ include file="sidebar.jsp" %>
		
		<!-- Search Bar -->
		<div class="search-bar">
		    Search Bar
		   <%--  <input type="text" placeholder="<c:out value='${lblSearchPlaceholder}'/>" /> --%>
		</div>
		
		<!-- Product List -->
		<div class="product-list">
		
		   <!--  <div class="product-card">
		       
		    </div> -->
		</div>
		
		<!-- Right Sidebar (Cart) -->
		<aside class="cart">
		    <h2><c:out value="${lblCurrentBill}"/></h2>
		    <ul class="cart-items">
		        <li>
		            <span><c:out value="${lblItem}"/> 1</span>
		            <span>1 x $10</span>
		            <button class="remove">x</button>
		        </li>
		    </ul>
		    <div class="summary">
		        <p><span><c:out value="${lblTotal}"/></span> <span>$10</span></p>
		    </div>
		    <div class="cart-actions">
		        <button class="checkout"><c:out value="${lblCheckout}"/></button>
		        <button class="clear"><c:out value="${lblClearCart}"/></button>
		    </div>
		</aside>

    </div>
</body>
</html>
