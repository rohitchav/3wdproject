package com.pos.kiranastore.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.sql.Connection;
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
import com.pos.kiranastore.connection.DBConnection;
import com.pos.kiranastore.dao.CustomerDao;

@WebServlet("/CustomerServlet")
public class CustomerServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	CustomerDao dao = new CustomerDao();

	public CustomerServlet() {
		super();
	}

	// ✅ Handles page load
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		String action = request.getParameter("action");

		try {
			if ("getAll".equals(action)) {
				List<Customer> customers = dao.getAllCustomers();
				String json = new Gson().toJson(customers);
				response.setContentType("application/json");
				response.getWriter().write(json);
				return;
			}
			// ✅ New backend search action
			else if ("search".equals(action)) {
				String query = request.getParameter("query"); // from AngularJS
				List<Customer> customers = dao.searchCustomers(query); // filtered list
				String json = new Gson().toJson(customers);

				response.setContentType("application/json");
				response.getWriter().write(json);
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
		if ("add".equalsIgnoreCase(action)) {
			StringBuilder sb = new StringBuilder();
			BufferedReader reader = request.getReader();
			String line;
			while ((line = reader.readLine()) != null) {
				sb.append(line);
			}

			String json = sb.toString();
			System.out.println("Received JSON: " + json);

			// Convert JSON → Java object
			Gson gson = new Gson();
			Customer customer = gson.fromJson(json, Customer.class);

			if (customer == null) {
				response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
				response.getWriter().write("{\"status\":\"error\",\"message\":\"Invalid JSON\"}");
				return;
			}

			Customer customerBean = new Customer();
			customerBean.setName(customer.getName());
			customerBean.setPhone(customer.getPhone());
			customerBean.setAddress(customer.getAddress());

			try {
				dao.addCustomer(customerBean);
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

			response.setContentType("application/json");
			response.getWriter().write("{\"status\":\"success\"}");
		} else if ("delete".equalsIgnoreCase(action)) {
			int id = Integer.parseInt(request.getParameter("id"));
			System.out.println("Delete Id: " + id);
			try {
				boolean deleted = dao.deleteCustomer(id);
				response.setContentType("application/json");
				if (deleted) {
					response.getWriter().write("{\"status\":\"success\"}");
				} else {
					response.getWriter().write("{\"status\":\"error\"}");
				}
			} catch (SQLException e) {
				e.printStackTrace();
				response.getWriter().write("{\"status\":\"error\"}");
			}
			return;
		} else if ("updateOutstanding".equals(action)) {
			int customerId = Integer.parseInt(request.getParameter("customerId"));
			double amount = Double.parseDouble(request.getParameter("amount"));

			try (Connection conn = DBConnection.getConnection()) {

				boolean updated = dao.updateOutstanding(customerId, amount);

				if (updated) {
					response.getWriter().write("{\"status\":\"success\"}");
				} else {
					response.getWriter().write("{\"status\":\"failed\"}");
				}
			} catch (Exception e) {
				e.printStackTrace();
				response.getWriter().write("{\"status\":\"error\"}");
			}
		}

	}
}
