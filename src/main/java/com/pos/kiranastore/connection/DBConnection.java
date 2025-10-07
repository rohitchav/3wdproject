package com.pos.kiranastore.connection;

import java.sql.Connection;
import java.sql.DriverManager;

public class DBConnection {
	private static Connection connection;

	public static void main(String[] args) {
		System.out.println(getConnection());
	}

	public static Connection getConnection() {
		try {
			if (connection == null || connection.isClosed()) {
				Class.forName("com.mysql.cj.jdbc.Driver");
				connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/kiranaPOS", "root", "12345678");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return connection;
	}
}
