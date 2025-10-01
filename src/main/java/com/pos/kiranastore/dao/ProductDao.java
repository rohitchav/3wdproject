package com.pos.kiranastore.dao;

import com.pos.kiranastore.bean.Product;
import com.pos.kiranastore.connection.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ProductDao {

	public boolean addProduct(Product product) throws SQLException {
        String sql = "INSERT INTO products (name, cost_price, selling_price, category, stock, image_path) VALUES (?, ?, ?, ?, ?, ?)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, product.getName());
            ps.setDouble(2, product.getCostPrice());
            ps.setDouble(3, product.getSellingPrice());
            ps.setString(4, product.getCategory());
            ps.setInt(5, product.getStock());
            ps.setString(6, product.getImagePath());

            int rowsInserted = ps.executeUpdate();
            return rowsInserted > 0;
        }
	}

	public List<Product> getAllProducts() throws SQLException {
	    List<Product> list = new ArrayList<>();
	    String sql = "SELECT * FROM products";
	    try (Connection conn = DBConnection.getConnection();
	         Statement st = conn.createStatement();
	         ResultSet rs = st.executeQuery(sql)) {

	        while (rs.next()) {
	            Product p = new Product();
	            p.setId(rs.getInt("id"));
	            p.setName(rs.getString("name"));
	            p.setCostPrice(rs.getDouble("cost_price"));
	            p.setSellingPrice(rs.getDouble("selling_price"));
	            p.setCategory(rs.getString("category"));
	            p.setStock(rs.getInt("stock"));
	            p.setImagePath(rs.getString("image_path"));
	            list.add(p);
	        }
	    }
	    return list;
	}

  
}
