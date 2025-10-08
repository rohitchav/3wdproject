package com.pos.kiranastore.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import com.pos.kiranastore.bean.User;
import com.pos.kiranastore.connection.DBConnection;

public class UserDao {

	public User login(String username, String password) {
		User user = null;
		try {
			Connection conn = DBConnection.getConnection();
			String sql = "SELECT * FROM users WHERE  username=? AND password=?";
			PreparedStatement ps = conn.prepareStatement(sql);
			ps.setString(1, username);
			ps.setString(2, password); // (later we’ll hash password)
			ResultSet rs = ps.executeQuery();

			if (rs.next()) {
				user = new User();
				user.setId(rs.getInt("id"));
				user.setUsername(rs.getString("username"));
				user.setPassword(rs.getString("password"));
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return user;
	}
}
