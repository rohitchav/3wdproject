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
<title>Dashboard | Kirana Store</title>
<link rel="icon" href="assets/images/dashboard.jpg" type="image/png">
    <link rel="stylesheet" href="assets/css/common.css">
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>
<body>
    <jsp:include page="navbar.jsp">
      <jsp:param name="servlet" value="DashBoardServlet"/>
   </jsp:include>
    
    <div class="container">
       <%@ include file="navbar.jsp" %>
       <%@ include file="sidebar.jsp" %>
     
    </div>
</body>
</html>>