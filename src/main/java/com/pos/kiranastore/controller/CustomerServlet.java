package com.pos.kiranastore.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.pos.kiranastore.bean.Customer;
import com.pos.kiranastore.serviceInterface.CustomerService;
import com.pos.kiranastore.services.CustomerServiceImp;

@WebServlet("/CustomerServlet")
public class CustomerServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	private CustomerService customerService = new CustomerServiceImp();

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		String action = request.getParameter("action");

		try {
			if ("getAll".equals(action)) {
				List<Customer> customers = customerService.getAllCustomers();
				writeJson(response, customers);
				return;
			} else if ("search".equals(action)) {
				String query = request.getParameter("query");
				List<Customer> customers = customerService.searchCustomers(query);
				writeJson(response, customers);
				return;
			}
		} catch (SQLException e) {
			e.printStackTrace();
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			return;
		}

		RequestDispatcher rd = request.getRequestDispatcher("/customer.jsp");
		rd.forward(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		String action = request.getParameter("action");
		System.out.println(action);

		try {
			if ("add".equalsIgnoreCase(action)) {
				Customer customer = parseCustomerFromJson(request);
				customerService.addCustomer(customer);
				writeJson(response, "{\"status\":\"success\"}");
			} else if ("updateOutstanding".equals(action)) {
				int customerId = Integer.parseInt(request.getParameter("customerId"));
				double amount = Double.parseDouble(request.getParameter("amount"));
				boolean updated = customerService.updateOutstanding(customerId, amount);
				if (updated) {
					writeJson(response, "{\"status\":\"success\"}");
				} else {
					writeJson(response, "{\"status\":\"failed\"}");
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			writeJson(response, "{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}");
		}
	}

	// Helper method to parse JSON into Customer object
	private Customer parseCustomerFromJson(HttpServletRequest request) throws IOException {
		BufferedReader reader = request.getReader();
		StringBuilder sb = new StringBuilder();
		String line;
		while ((line = reader.readLine()) != null)
			sb.append(line);
		return new Gson().fromJson(sb.toString(), Customer.class);
	}

	// Helper method to write JSON response
	private void writeJson(HttpServletResponse response, Object obj) throws IOException {
		response.setContentType("application/json");
		response.getWriter().write(new Gson().toJson(obj));
	}
}
