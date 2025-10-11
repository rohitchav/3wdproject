package com.pos.kiranastore.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.pos.kiranastore.bean.Product;
import com.pos.kiranastore.connection.DBConnection;

public class ProductDao {

	public boolean addProduct(Product product) throws SQLException {
		String sql = "INSERT INTO products (name, cost_price, selling_price, category, stock, image_path) VALUES (?, ?, ?, ?, ?, ?)";

		try (Connection conn = DBConnection.getConnection(); PreparedStatement ps = conn.prepareStatement(sql)) {

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

	public boolean updateProduct(Product product) {
		String sql = "UPDATE products SET name=?, cost_price=?, selling_price=?, category=?, stock=?, image_path=? WHERE id=?";
		try (Connection conn = DBConnection.getConnection(); PreparedStatement ps = conn.prepareStatement(sql)) {

			ps.setString(1, product.getName());
			ps.setDouble(2, product.getCostPrice());
			ps.setDouble(3, product.getSellingPrice());
			ps.setString(4, product.getCategory());
			ps.setInt(5, product.getStock());

			// if image is null, keep old image
			if (product.getImagePath() != null) {
				ps.setString(6, product.getImagePath());
			} else {
				// fetch current image from DB (or set as existing value)
				ps.setString(6, getProductImage(product.getId()));
			}

			ps.setInt(7, product.getId());

			return ps.executeUpdate() > 0;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}

	public boolean deleteProduct(int id) {
		String sql = "DELETE FROM products WHERE id=?";
		try (Connection conn = DBConnection.getConnection(); PreparedStatement ps = conn.prepareStatement(sql)) {
			ps.setInt(1, id);
			return ps.executeUpdate() > 0;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}

	// Helper method to keep old image if not updated
	public String getProductImage(int id) {
		String sql = "SELECT image_path FROM products WHERE id=?";
		try (Connection conn = DBConnection.getConnection(); PreparedStatement ps = conn.prepareStatement(sql)) {
			ps.setInt(1, id);
			ResultSet rs = ps.executeQuery();
			if (rs.next()) {
				return rs.getString("image_path");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	public boolean deleteAllProduct() {
		String sql = "DELETE FROM products";
		try (Connection conn = DBConnection.getConnection(); PreparedStatement ps = conn.prepareStatement(sql)) {
			return ps.executeUpdate() > 0;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}

	public List<Product> getLowStockProducts(int threshold) throws SQLException {
		List<Product> list = new ArrayList<>();
		String sql = "SELECT * FROM products WHERE stock < ?";
		try (Connection conn = DBConnection.getConnection(); PreparedStatement ps = conn.prepareStatement(sql)) {
			ps.setInt(1, threshold);
			ResultSet rs = ps.executeQuery();
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

	public boolean updateStock(Product[] products) {
		boolean success = false;

		try (Connection conn = DBConnection.getConnection();
				PreparedStatement ps = conn.prepareStatement("UPDATE products SET stock = stock - ? WHERE id = ?")) {

			for (Product p : products) {
				System.out.println(p.getQty() + "  " + p.getId());
				ps.setInt(1, p.getQty()); // Quantity to subtract
				ps.setInt(2, p.getId()); // Product ID
				ps.addBatch();
			}

			int[] results = ps.executeBatch();
			System.out.println("Updated Stock");
			// Check if all updates are successful
			success = java.util.Arrays.stream(results).allMatch(r -> r >= 0);

		} catch (Exception e) {
			e.printStackTrace();
		}

		return success;
	}

}
