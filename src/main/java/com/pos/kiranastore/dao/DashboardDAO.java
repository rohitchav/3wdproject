package com.pos.kiranastore.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import com.pos.kiranastore.bean.DashboardStats;
import com.pos.kiranastore.connection.DBConnection;

public class DashboardDAO {

	public DashboardStats getStats(String period) throws Exception {
		DashboardStats stats = new DashboardStats();

		String dateCondition;
		switch (period) {
		case "last7":
			dateCondition = "DATE(bill_date) >= CURDATE() - INTERVAL 7 DAY";
			break;
		case "month":
			dateCondition = "MONTH(bill_date) = MONTH(CURDATE()) AND YEAR(bill_date) = YEAR(CURDATE())";
			break;
		case "all":
			dateCondition = "1=1";
			break;
		default:
			dateCondition = "DATE(bill_date) = CURDATE()";
			System.out.println(dateCondition);
		}

		try (Connection con = DBConnection.getConnection()) {

			// ✅ Total Sales, Transactions, Average Bill
			String billQuery = "SELECT IFNULL(SUM(grand_total), 0) AS totalSales, " + "COUNT(*) AS transactions, "
					+ "IFNULL(AVG(grand_total), 0) AS avgBill " + "FROM bills WHERE " + dateCondition;

			try (PreparedStatement ps = con.prepareStatement(billQuery); ResultSet rs = ps.executeQuery()) {
				if (rs.next()) {
					stats.setTotalSales(rs.getDouble("totalSales"));
					stats.setTransactions(rs.getInt("transactions"));
					stats.setAvgBill(rs.getDouble("avgBill"));
				}
			}

			// ✅ Items Sold
			String itemQuery = "SELECT IFNULL(SUM(bi.qty), 0) AS itemsSold " + "FROM bill_items bi "
					+ "INNER JOIN bills b ON bi.bill_id = b.bill_id " + "WHERE " + dateCondition;

			try (PreparedStatement ps = con.prepareStatement(itemQuery); ResultSet rs = ps.executeQuery()) {
				if (rs.next()) {
					stats.setItemsSold(rs.getInt("itemsSold"));
				}
			}

			// ✅ Purchases (Expenses)
			String purchaseQuery = "SELECT IFNULL(SUM(amount), 0) AS totalExpenses " + "FROM purchases " + "WHERE "
					+ dateCondition.replace("bill_date", "date");

			try (PreparedStatement ps = con.prepareStatement(purchaseQuery); ResultSet rs = ps.executeQuery()) {
				if (rs.next()) {
					stats.setTotalExpenses(rs.getDouble("totalExpenses"));
				}
			}

			// ✅ Derived Fields
			stats.setTotalRevenue(stats.getTotalSales());
			stats.setCogs(stats.getTotalSales() * 0.6); // Assuming 60% of sales is cost
			stats.setGrossProfit(stats.getTotalRevenue() - stats.getCogs());
			stats.setNetLoss(stats.getGrossProfit() - stats.getTotalExpenses());
		}

		return stats;
	}
}
