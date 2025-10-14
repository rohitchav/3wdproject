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

			String sqlBill;
			if (bill.getCustomerId() != null) {
				System.out.println("From Bill Dao: " + bill.getCustomerId());
				sqlBill = "INSERT INTO bills (bill_no, bill_date, subtotal, discount, grand_total, payment_method, customer_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
			} else {
				System.out.println("From Bill Dao: " + bill.getCustomerId());
				sqlBill = "INSERT INTO bills (bill_no, bill_date, subtotal, discount, grand_total, payment_method) VALUES (?, ?, ?, ?, ?, ?)";
			}

			psBill = conn.prepareStatement(sqlBill, Statement.RETURN_GENERATED_KEYS);
			psBill.setString(1, bill.getBillNo());
			psBill.setString(2, bill.getBillDate());
			psBill.setDouble(3, bill.getSubtotal());
			psBill.setDouble(4, bill.getDiscount());
			psBill.setDouble(5, bill.getGrandTotal());
			psBill.setString(6, bill.getPaymentMethod());
			if (bill.getCustomerId() != null) {
				psBill.setInt(7, bill.getCustomerId());
			}

			// ✅ Execute the bill insert first
			psBill.executeUpdate();

			// ✅ Then get the generated bill_id
			rs = psBill.getGeneratedKeys();
			int billId = 0;
			if (rs.next()) {
				billId = rs.getInt(1);
			}

			// 3️⃣ Insert into bill_items
			String sqlItem = "INSERT INTO bill_items (bill_id, product_id, product_name, qty, price, total_price) VALUES (?, ?, ?, ?, ?, ?)";
			psItem = conn.prepareStatement(sqlItem);
			List<BillItem> items = bill.getItems();
			for (BillItem item : items) {
				// 🛑 **FIX: Removed redundant psItem.setInt(1, billId) and psItem.setInt(2,
				// item.getProductId())**
				// 🛑 **FIX: Consolidated parameter setting into one block**
				psItem.setInt(1, billId);
				psItem.setInt(2, item.getProductId());
				psItem.setString(3, item.getProductName());
				psItem.setInt(4, item.getQty());
				psItem.setDouble(5, item.getPrice());

				// Calculate total price once and set it
				double totalPrice = item.getPrice() * item.getQty();
				psItem.setDouble(6, totalPrice);

				// 🚀 **FIX: Only ONE call to addBatch() per item!**
				psItem.addBatch();
			}

			// 4️⃣ Execute the batch once
			psItem.executeBatch();

			// 🛑 **FIX: Removed the second psItem.executeBatch() call that was here**

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