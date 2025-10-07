package com.pos.kiranastore.dao;

import java.sql.*;
import java.util.*;
import java.math.BigDecimal;

import com.pos.kiranastore.bean.Purchase;
import com.pos.kiranastore.connection.DBConnection;

public class PurchaseDAO {

    /**
     * Fetch all purchase records from the database
     */
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

    /**
     * Insert a new purchase record into the database
     */
    public boolean addPurchase(String supplier, BigDecimal amount, String billPath) {
        String sql = "INSERT INTO purchases (supplier, amount, bill_path, date) VALUES (?, ?, ?, CURRENT_TIMESTAMP)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

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

    /**
     * Fetch a single purchase record by ID
     */
    public Purchase getPurchaseById(int id) {
        String sql = "SELECT * FROM purchases WHERE id = ?";
        Purchase p = null;

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, id);

            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    p = new Purchase();
                    p.setId(rs.getInt("id"));
                    p.setSupplier(rs.getString("supplier"));
                    p.setAmount(rs.getBigDecimal("amount"));
                    p.setDate(rs.getTimestamp("date").toString());
                    p.setBillPath(rs.getString("bill_path"));
                }
            }

        } catch (SQLException e) {
            System.err.println("Error fetching purchase by ID: " + e.getMessage());
        }

        return p;
    }

    /**
     * Delete a purchase record by ID
     */
    public boolean deletePurchase(int id) {
        String sql = "DELETE FROM purchases WHERE id = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, id);
            int rowsDeleted = ps.executeUpdate();
            return rowsDeleted > 0;

        } catch (SQLException e) {
            System.err.println("Error deleting purchase: " + e.getMessage());
            return false;
        }
    }

    /**
     * Update an existing purchase record
     */
    public boolean updatePurchase(Purchase purchase) {
        String sql = "UPDATE purchases SET supplier = ?, amount = ?, bill_path = ? WHERE id = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, purchase.getSupplier());
            ps.setBigDecimal(2, purchase.getAmount());
            ps.setString(3, purchase.getBillPath());
            ps.setInt(4, purchase.getId()); // ID must be set for update

            int rowsUpdated = ps.executeUpdate();
            return rowsUpdated > 0;

        } catch (SQLException e) {
            System.err.println("Error updating purchase: " + e.getMessage());
            return false;
        }
    }
}
