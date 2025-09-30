<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html ng-app="loginApp" ng-controller="LoginController">
<%
    String vlang = (String)session.getAttribute("vlang");
    if (vlang==null) {
       session.setAttribute("vlang", "EN");
    }
%>
<head>
    <title>Login</title>
    <%@include file="csslink.jsp"%>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
     <%@include file="jslink.jsp"%>
</head>
<body>
<div class="login-box">
    <img src="assets/images/logo.jpg" alt="icon">
    <h2>Kirana Store</h2>
    <p>Please log in to continue</p>

    <!-- AngularJS controlled form -->
    <form ng-submit="submitLogin()">
        <label>Username:</label>
        <input type="text" ng-model="user.username" required><br>

        <label>Password:</label>
        <input type="password" ng-model="user.password" required><br>

        <button type="submit">Login</button>
    </form>
    <br>
    <p style="color:red" ng-if="errorMessage">{{errorMessage}}</p>
</div>

</body>
</html>
