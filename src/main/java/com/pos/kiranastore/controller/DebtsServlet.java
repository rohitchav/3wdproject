package com.pos.kiranastore.controller;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.pos.kiranastore.bean.Customer;
import com.pos.kiranastore.connection.DBConnection;
import com.pos.kiranastore.serviceInterface.DebtService;
import com.pos.kiranastore.services.DebtsServiceImp;

@WebServlet("/DebtsServlet")
public class DebtsServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	private DebtService debtsService = new DebtsServiceImp();

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String action = request.getParameter("action");

		try {
			if ("getDebts".equals(action)) {
				// ✅ Get all customers with outstanding debts
				List<Customer> debtors = debtsService.getDebtors();
				writeJson(response, debtors);
			} else if ("getCustomerBill".equals(action)) {
				// ✅ Get items purchased on credit by specific customer
				int customerId = Integer.parseInt(request.getParameter("customerId"));

				List<Map<String, Object>> billItems = new ArrayList<>();

				try (Connection conn = DBConnection.getConnection()) {
					String sql = "SELECT product_name, qty, price FROM customer_bill_view WHERE id = ?";
					PreparedStatement ps = conn.prepareStatement(sql);
					ps.setInt(1, customerId);
					ResultSet rs = ps.executeQuery();

					while (rs.next()) {
						Map<String, Object> item = new HashMap<>();
						item.put("product_name", rs.getString("product_name"));
						item.put("qty", rs.getInt("qty"));
						item.put("price", rs.getDouble("price"));
						billItems.add(item);
					}

				} catch (Exception e) {
					e.printStackTrace();
				}

				writeJson(response, billItems);
			} else {
				// ✅ Default: open JSP
				RequestDispatcher rd = request.getRequestDispatcher("/debts.jsp");
				rd.forward(request, response);
			}
		} catch (Exception e) {
			e.printStackTrace();
			response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
					"Error in DebtsServlet: " + e.getMessage());
		}
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String action = request.getParameter("action");

		try {
			if ("payDebt".equals(action)) {
				int customerId = Integer.parseInt(request.getParameter("customerId"));
				double paidAmount = Double.parseDouble(request.getParameter("paidAmount"));

				boolean success = debtsService.payDebt(customerId, paidAmount);

				writeJson(response, Collections.singletonMap("success", success));
			}
		} catch (Exception e) {
			e.printStackTrace();
			writeJson(response, Collections.singletonMap("error", e.getMessage()));
		}
	}

	private void writeJson(HttpServletResponse response, Object obj) throws IOException {
		response.setContentType("application/json");
		response.getWriter().write(new Gson().toJson(obj));
	}
}
