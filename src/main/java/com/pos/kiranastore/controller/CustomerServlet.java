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
		if ("getAll".equals(action)) {
			try {
				List<Customer> customers = dao.getAllCustomers();
				Gson gson = new Gson();
				String json = gson.toJson(customers);

				response.setContentType("application/json");
				response.getWriter().write(json);
			} catch (SQLException e) {
				e.printStackTrace();
				response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			}
			return;
		}

		RequestDispatcher rd = request.getRequestDispatcher("/customer.jsp");
		rd.forward(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		// Read JSON data from request body
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
	}
}
