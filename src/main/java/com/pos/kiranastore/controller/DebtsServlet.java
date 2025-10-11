package com.pos.kiranastore.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.pos.kiranastore.bean.Customer;
import com.pos.kiranastore.dao.DebtsDAO;

@WebServlet("/DebtsServlet")
public class DebtsServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    DebtsDAO dao = new DebtsDAO();

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String action = request.getParameter("action");
        if ("getDebts".equals(action)) {
            List<Customer> debtors = dao.getDebtors();
            response.setContentType("application/json");
            response.getWriter().write(new Gson().toJson(debtors));
        } else {
            // fallback to JSP page
            RequestDispatcher rd = request.getRequestDispatcher("/debts.jsp");
            rd.forward(request, response);
        }
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String action = request.getParameter("action");
        PrintWriter out = response.getWriter();
        response.setContentType("application/json");

        if ("payDebt".equals(action)) {
            try {
                int customerId = Integer.parseInt(request.getParameter("customerId"));
                double paidAmount = Double.parseDouble(request.getParameter("paidAmount"));

                boolean success = dao.payDebt(customerId, paidAmount);

                if (success) {
                    out.write("{\"status\":\"success\"}");
                } else {
                    out.write("{\"status\":\"failed\"}");
                }
            } catch (Exception e) {
                e.printStackTrace();
                out.write("{\"status\":\"failed\"}");
            }
        }
    }
}
