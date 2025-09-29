<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Login</title>
  <%@include file="csslink.jsp"%>
</head>
<body>
    
    
 <div class="login-box">
    <img src="assets/images/logo.jpg" alt="icon">
    <h2>Kirana Store</h2>
    <p>Please log in to continue</p>

	     <form action="login" method="post">
	        <label>Username:</label>
	        <input type="text" name="username" required><br>
	        <label>Password:</label>
	        <input type="password" name="password" required><br>
	        <button type="submit">Login</button>
	    </form>
</div>
    
    <p style="color:red">${errorMessage}</p>
</body>
</html>
