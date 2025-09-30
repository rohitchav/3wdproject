package com.pos.kiranastore.controller;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.pos.kiranastore.bean.User;
import com.pos.kiranastore.dao.UserDao;

@WebServlet("/login")
public class AuthController extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private UserDao userDAO = new UserDao();

    public AuthController() {
        super();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String username = request.getParameter("username");
        String password = request.getParameter("password");

        User user = userDAO.login(username, password);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        if (user != null) {
            HttpSession session = request.getSession();
            session.setAttribute("user", user);

            // ✅ Send success response
            response.getWriter().write("{\"status\":\"success\"}");
        } else {
            // ❌ Send error response
            response.getWriter().write("{\"status\":\"error\", \"message\":\"Invalid username or password!\"}");
        }
    }

}
