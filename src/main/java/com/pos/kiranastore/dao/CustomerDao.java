package com.pos.kiranastore.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.pos.kiranastore.bean.Customer;
import com.pos.kiranastore.connection.DBConnection;

public class CustomerDao {

	public boolean addCustomer(Customer customer) throws SQLException {
		String sql = "INSERT INTO customers (name, phone, address) VALUES (?, ?, ?)";

		try (Connection conn = DBConnection.getConnection(); PreparedStatement ps = conn.prepareStatement(sql)) {

			ps.setString(1, customer.getName());
			ps.setString(2, customer.getPhone());
			ps.setString(3, customer.getAddress());

			int row = ps.executeUpdate(); // returns number of affected rows

			return row > 0; // return true if insert was successful
		}
	}

	public List<Customer> getAllCustomers() throws SQLException {
		List<Customer> customers = new ArrayList<>();
		String query = "SELECT * FROM customers where status = 'A'";
		try (Connection conn = DBConnection.getConnection();
				PreparedStatement ps = conn.prepareStatement(query);
				ResultSet rs = ps.executeQuery()) {

			while (rs.next()) {
				Customer c = new Customer();
				c.setId(rs.getInt("id"));
				c.setName(rs.getString("name"));
				c.setPhone(rs.getString("phone"));
				c.setAddress(rs.getString("address"));
				c.setOutstanding(rs.getDouble("outstanding"));
				customers.add(c);
			}
		}

		return customers;
	}

	/*
	 * public boolean deleteCustomer(int id) throws SQLException { String sql =
	 * "UPDATE customers SET status='B' WHERE id = ?"; try (Connection conn =
	 * DBConnection.getConnection(); PreparedStatement ps =
	 * conn.prepareStatement(sql)) { ps.setInt(1, id); int rows =
	 * ps.executeUpdate(); return rows > 0; } }
	 */

	public List<Customer> searchCustomers(String query) {
		List<Customer> list = new ArrayList<>();
		try (Connection con = DBConnection.getConnection()) {
			String sql = "SELECT * FROM customers WHERE (name LIKE ? OR phone LIKE ?) AND status='A'";
			PreparedStatement ps = con.prepareStatement(sql);
			ps.setString(1, "%" + query + "%");
			ps.setString(2, "%" + query + "%");
			ResultSet rs = ps.executeQuery();

			while (rs.next()) {
				Customer c = new Customer();
				c.setId(rs.getInt("id"));
				c.setName(rs.getString("name"));
				c.setPhone(rs.getString("phone"));
				c.setAddress(rs.getString("address"));
				list.add(c);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return list;
	}

	public boolean updateOutstanding(int customerId, double amount) {
		boolean success = false;
		String sql = "UPDATE customers SET outstanding = outstanding + ? WHERE id = ?";

		try (Connection conn = DBConnection.getConnection(); PreparedStatement ps = conn.prepareStatement(sql)) {

			ps.setDouble(1, amount);
			ps.setInt(2, customerId);

			int rows = ps.executeUpdate();
			success = rows > 0;

		} catch (Exception e) {
			e.printStackTrace();
		}

		return success;
	}

}
