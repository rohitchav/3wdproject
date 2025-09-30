package com.pos.kiranastore.dao;

import com.pos.kiranastore.bean.Product;
import com.pos.kiranastore.connection.DBConnection;

import java.sql.*;
import java.util.*;

public class ProductDao {

    public boolean addProduct(Product product) {
		
        try (Connection conn = DBConnection.getConnection()) {
            String sql = "INSERT INTO products(name, cost_price, price, stock, category,  image_path) VALUES(?, ?, ?, ?, ?, ?)";
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setString(1, product.getName());
            ps.setDouble(2,product.getCostPrice());
            ps.setDouble(3, product.getPrice());
            ps.setInt(4, product.getStock());
           ps.setString(5, product.getCategory());
            ps.setString(6, product.getImagePath());
            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public List<Product> getAllProducts() {
        List<Product> list = new ArrayList<>();
        try (Connection conn = DBConnection.getConnection()) {
            String sql = "SELECT * FROM products";
            PreparedStatement ps = conn.prepareStatement(sql);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                list.add(new Product(
                        rs.getInt("id"),
                        rs.getString("name"),
                        rs.getDouble("cost_price"),
                        rs.getDouble("price"),
                        rs.getInt("stock"),
                        rs.getString("category"),
                        rs.getString("image_path")
                ));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    public boolean updateStock(int productId, int qtySold) {
        try (Connection conn = DBConnection.getConnection()) {
            String sql = "UPDATE products SET stock = stock - ? WHERE id = ?";
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setInt(1, qtySold);
            ps.setInt(2, productId);
            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }
}
