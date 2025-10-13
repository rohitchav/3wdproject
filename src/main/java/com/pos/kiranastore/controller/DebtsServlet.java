package com.pos.kiranastore.controller;

import java.io.IOException;
import java.util.List;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.pos.kiranastore.bean.Customer;
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
				List<Customer> debtors = debtsService.getDebtors();
				writeJson(response, debtors);
			} else {
				RequestDispatcher rd = request.getRequestDispatcher("/debts.jsp");
				rd.forward(request, response);
			}
		} catch (Exception e) {
			e.printStackTrace();
			response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
					"Error fetching debtors: " + e.getMessage());
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

				if (success) {
					writeJson(response, success);
				} else {
					writeJson(response, "{\"status\":\"failed\"}");
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			writeJson(response, "{\"status\":\"failed\",\"message\":\"" + e.getMessage() + "\"}");
		}
	}

	private void writeJson(HttpServletResponse response, Object obj) throws IOException {
		response.setContentType("application/json");
		response.getWriter().write(new Gson().toJson(obj));
	}
}
