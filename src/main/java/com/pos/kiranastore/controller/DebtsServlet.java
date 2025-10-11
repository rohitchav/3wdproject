package com.pos.kiranastore.controller;

import java.io.IOException;
import java.util.List;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.pos.kiranastore.bean.Customer;
import com.pos.kiranastore.dao.DebtsDAO;

@WebServlet("/DebtsServlet")
public class DebtsServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    DebtsDAO dao = new DebtsDAO();

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // Load debtors and set as request attribute for JSP
        List<Customer> debtors = dao.getDebtors();
        request.setAttribute("debtors", debtors);

        RequestDispatcher rd = request.getRequestDispatcher("/debts.jsp");
        rd.forward(request, response);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doGet(request, response);
    }
}
