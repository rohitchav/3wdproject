<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<aside class="sidebar">


		    <ul>
				 <li>
				    <a href="HomeServlet"> 
				        <i class="fa-solid fa-home"></i> 
				        <c:out value="${lblHome}"/>
				    </a>
				</li>
				 <li>
				    <a href="DashboardServlet"> 
				        <i class="fa-solid fa-chart-pie"></i>
				        <c:out value="${lblDashboard}"/>
				    </a>
				</li>
				 <li>
				    <a href="InventoryServlet"> 
				        <i class="fa-solid fa-boxes-stacked"></i> 
				        <c:out value="${lblInventory}"/>
				    </a>
				</li>

				 <li>
				    <a href="CustomerServlet">
				        <i class="fa-solid fa-users"></i> 
				        <c:out value="${lblCustomers}"/>
				    </a>
				</li>
				
				<li>
				    <a href="DebtsServlet">
				        <i class="fa-solid fa-file-invoice-dollar"></i> 
				        <c:out value="${lblDebts}"/>
				    </a>
				</li>
				
				<li>
				    <a href="PurchaseServlet">
				        <i class="fa-solid fa-truck"></i> 
				        <c:out value="${lblPurchases}"/>
				    </a>
				</li>

		        <hr>
		        <li><a href="logout"><i class="fa-solid fa-right-from-bracket"></i> <c:out value="${lblLogout}"/></a></li>
		    </ul>
		</aside>