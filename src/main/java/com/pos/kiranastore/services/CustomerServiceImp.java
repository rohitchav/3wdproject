package com.pos.kiranastore.services;

import java.sql.SQLException;
import java.util.List;

import com.pos.kiranastore.bean.Customer;
import com.pos.kiranastore.dao.CustomerDao;
import com.pos.kiranastore.serviceInterface.CustomerService;

public class CustomerServiceImp implements CustomerService {

	private CustomerDao dao = new CustomerDao();

	@Override
	public List<Customer> getAllCustomers() throws SQLException {
		return dao.getAllCustomers();
	}

	@Override
	public List<Customer> searchCustomers(String query) throws SQLException {
		return dao.searchCustomers(query);
	}

	@Override
	public boolean addCustomer(Customer customer) throws SQLException {
		// You can add business rules here, e.g., phone number validation
		if (customer.getPhone() == null || customer.getPhone().isEmpty()) {
			throw new IllegalArgumentException("Phone number is required.");
		}
		return dao.addCustomer(customer);
	}

	@Override
	public boolean updateOutstanding(int customerId, double amount) throws SQLException {
		// Business logic: ensure amount is positive
		if (amount < 0) {
			throw new IllegalArgumentException("Amount must be positive.");
		}
		return dao.updateOutstanding(customerId, amount);
	}
}
