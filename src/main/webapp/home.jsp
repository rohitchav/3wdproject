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
    <title>Home | Kirana Store</title>
    <link rel="icon" href="assets/images/home.jpg" type="image/png">
    <link rel="stylesheet" href="assets/css/style.css">
     <link rel="stylesheet" href="assets/css/common.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>
<body>
   
	<%@ include file="navbar.jsp" %>
	<%@ include file="sidebar.jsp" %>
	<div class="content">
        <%@ include file="maincontent.jsp" %>
    </div>
	
</body>
</html>
