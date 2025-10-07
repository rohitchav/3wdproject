package com.pos.kiranastore.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import com.pos.kiranastore.bean.Customer;
import com.pos.kiranastore.connection.DBConnection;

public class CustomerDao {

	public void addCustomer(Customer customer) throws SQLException {
		// TODO Auto-generated method stub
		String sql = "INSERT INTO customers (name,phone,address) VALUES (?, ?, ?)";

		try (Connection conn = DBConnection.getConnection(); PreparedStatement ps = conn.prepareStatement(sql)) {

			ps.setString(1, customer.getName());
			ps.setString(2, customer.getPhone());
			ps.setString(3, customer.getAddress());
			ps.executeUpdate();
			System.out.println("Inserted");
		}
	}

}
