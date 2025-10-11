<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

   <div class="custom-navbar">
    <div class="logo">
        <a href="HomeServlet" class="logo-link">
            <img src="assets/images/logo.jpg" alt="icon">
            <c:out value="${lblHead}" default="Kirana Store"/>
        </a>
    </div>
    <div class="nav-options">
		  <button class="billing-btn" onclick="window.location.href='BillingServlet'">
		    <c:out value="${lblBilling}"/>
		</button>

        <i class="fas fa-shopping-cart cart-icon"></i>
       <c:set var="targetServlet" value="${param.servlet}" />

		<select class="lang-select" 
		        onchange="window.location.href='${targetServlet}?lang='+this.value">
		    <option value="EN" ${sessionScope.vlang == 'EN' ? 'selected' : ''}>EN</option>
		    <option value="MR" ${sessionScope.vlang == 'MR' ? 'selected' : ''}>Marathi</option>
		</select>


        <div class="profile-icon"><i class="fas fa-user-circle"></i></div>
    </div>
</div>

