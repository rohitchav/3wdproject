package com.pos.kiranastore.serviceInterface;

import java.sql.SQLException;
import java.util.List;

import com.pos.kiranastore.bean.Customer;

public interface CustomerService {
	List<Customer> getAllCustomers() throws SQLException;

	List<Customer> searchCustomers(String query) throws SQLException;

	boolean addCustomer(Customer customer) throws SQLException;

	boolean updateOutstanding(int customerId, double amount) throws SQLException;
}
