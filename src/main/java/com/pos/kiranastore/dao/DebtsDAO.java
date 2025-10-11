package com.pos.kiranastore.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import com.pos.kiranastore.bean.Customer;
import com.pos.kiranastore.connection.DBConnection;

public class DebtsDAO {

    public List<Customer> getDebtors() {
        List<Customer> debtors = new ArrayList<>();
        String sql = "SELECT * FROM customers WHERE outstanding > 0 AND status='A'";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                Customer c = new Customer();
                c.setId(rs.getInt("id"));
                c.setName(rs.getString("name"));
                c.setPhone(rs.getString("phone"));
                c.setAddress(rs.getString("address"));
                c.setOutstanding(rs.getDouble("outstanding"));
                debtors.add(c);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return debtors;
    }
}
