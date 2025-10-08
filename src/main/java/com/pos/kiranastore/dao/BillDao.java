package com.pos.kiranastore.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;

import com.pos.kiranastore.bean.Bill;
import com.pos.kiranastore.bean.BillItem;
import com.pos.kiranastore.connection.DBConnection;

public class BillDao {
	public boolean saveBill(Bill bill) {
		Connection conn = null;
		PreparedStatement psBill = null;
		PreparedStatement psItem = null;
		ResultSet rs = null;
		boolean success = false;

		try {
			conn = DBConnection.getConnection();
			conn.setAutoCommit(false); // Start transaction

			// 1️⃣ Insert into bills
			String sqlBill = "INSERT INTO bills (bill_no, bill_date, subtotal, discount, grand_total, payment_method) VALUES (?, ?, ?, ?, ?, ?)";
			psBill = conn.prepareStatement(sqlBill, Statement.RETURN_GENERATED_KEYS);
			psBill.setString(1, bill.getBillNo());
			psBill.setString(2, bill.getBillDate());
			psBill.setDouble(3, bill.getSubtotal());
			psBill.setDouble(4, bill.getDiscount());
			psBill.setDouble(5, bill.getGrandTotal());
			psBill.setString(6, bill.getPaymentMethod());
			psBill.executeUpdate();
			System.out.println("Data Inserted");
			// 2️⃣ Get generated bill_id
			rs = psBill.getGeneratedKeys();
			int billId = 0;
			if (rs.next()) {
				billId = rs.getInt(1);
			}

			String sqlItem = "INSERT INTO bill_items (bill_id, product_id, product_name, qty, price, total_price) VALUES (?, ?, ?, ?, ?, ?)";
			psItem = conn.prepareStatement(sqlItem);
			List<BillItem> items = bill.getItems();
			for (BillItem item : items) {
				psItem.setInt(1, billId);
				psItem.setInt(2, item.getProductId()); // <-- use correct product_id
				psItem.setInt(1, billId);
				psItem.setInt(2, item.getProductId());
				psItem.setString(3, item.getProductName());
				psItem.setInt(4, item.getQty());
				psItem.setDouble(5, item.getPrice());
				psItem.setDouble(6, item.getTotalPrice());
				psItem.addBatch();
				double totalPrice = item.getPrice() * item.getQty();
				psItem.setDouble(6, totalPrice);
				psItem.addBatch();
			}
			psItem.executeBatch();

			psItem.executeBatch();
			conn.commit();
			success = true;

		} catch (Exception e) {
			e.printStackTrace();
			try {
				if (conn != null)
					conn.rollback();
			} catch (SQLException ex) {
				ex.printStackTrace();
			}
		} finally {
			try {
				if (rs != null)
					rs.close();
				if (psBill != null)
					psBill.close();
				if (psItem != null)
					psItem.close();
				if (conn != null)
					conn.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return success;
	}
}
