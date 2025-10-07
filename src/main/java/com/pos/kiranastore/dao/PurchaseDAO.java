package com.pos.kiranastore.dao;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.pos.kiranastore.bean.Purchase;
import com.pos.kiranastore.connection.DBConnection;

public class PurchaseDAO {

	public List<Purchase> getAllPurchases() {
		List<Purchase> purchases = new ArrayList<>();

		String sql = "SELECT * FROM purchases";

		try (Connection conn = DBConnection.getConnection();
				PreparedStatement ps = conn.prepareStatement(sql);
				ResultSet rs = ps.executeQuery()) {

			while (rs.next()) {
				Purchase p = new Purchase();
				p.setId(rs.getInt("id")); // ID must be set
				p.setSupplier(rs.getString("supplier"));
				p.setAmount(rs.getBigDecimal("amount"));
				p.setDate(rs.getTimestamp("date").toString());
				p.setBillPath(rs.getString("bill_path"));
				purchases.add(p);
			}

		} catch (SQLException e) {
			System.err.println("Error fetching purchases: " + e.getMessage());
		}

		return purchases;
	}

	public boolean addPurchase(String supplier, BigDecimal amount, String billPath) {
		String sql = "INSERT INTO purchases (supplier, amount, bill_path, date) VALUES (?, ?, ?, CURRENT_TIMESTAMP)";

		try (Connection conn = DBConnection.getConnection(); PreparedStatement ps = conn.prepareStatement(sql)) {

			ps.setString(1, supplier);
			ps.setBigDecimal(2, amount);
			ps.setString(3, billPath);

			int rowsInserted = ps.executeUpdate();
			return rowsInserted > 0;

		} catch (SQLException e) {
			System.err.println("Error inserting purchase: " + e.getMessage());
			return false;
		}
	}

	public boolean deletePurchase(int id) {
		boolean success = false;
		String sql = "DELETE FROM purchases WHERE id = ?";
		try (Connection con = DBConnection.getConnection(); PreparedStatement ps = con.prepareStatement(sql)) {

			ps.setInt(1, id);
			int rows = ps.executeUpdate();
			success = (rows > 0);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return success;
	}

}
