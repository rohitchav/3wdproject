# 🏪 Kirana Store Management System

A **Java-based desktop application** designed to help local Kirana (grocery) shop owners efficiently manage **customers, products, billing, and purchases**.  
It provides a user-friendly interface to handle sales, track stock, and monitor outstanding balances.

---

## 📋 Features

- 👤 **Customer Management** — Add, edit, or remove customer details and track outstanding payments.  
- 📦 **Product Management** — Maintain product stock, categories, and pricing.  
- 🧾 **Billing System** — Generate bills with multiple items, automatic total and discount calculation.  
- 💰 **Purchases Record** — Keep track of supplier purchases and expenses.  
- 🔒 **User Authentication** — Secure login system for shop owners or staff.  
- 📊 **Customer Bill View** — Combined view of customer, bill, and product details for reporting.  

---

## 🧱 Database Structure

The project uses a **MySQL** database. Below are the main tables and their purpose:

| Table | Description |
|--------|--------------|
| `customers` | Stores customer information and outstanding amounts |
| `products` | Contains product details and stock |
| `bills` | Holds bill headers (bill number, date, totals, payment info) |
| `bill_items` | Stores item-level details for each bill |
| `purchases` | Records supplier purchases |
| `users` | Manages application login credentials |
| `customer_bill_view` | View joining customers, bills, and items for easy reporting |

---

## ⚙️ Installation Steps

### 1️⃣ Install Requirements
- Install **MySQL Server** and **MySQL Workbench** (or phpMyAdmin)  
- Install **Java JDK 8+**  
- *(Optional)* Install **NetBeans** or **IntelliJ IDEA** to open the project  

---

### 2️⃣ Database Setup

1. Open **MySQL** or **phpMyAdmin**.  
2. Create the database:
   ```sql
   CREATE DATABASE kirana_store;
Run the SQL script file (kirana_store.sql) included in the project:

sql
Copy code
SOURCE kirana_store.sql;
3️⃣ Configure Database Connection
Open DBConnection.java and update your MySQL credentials:

java
Copy code
private static final String URL = "jdbc:mysql://localhost:3306/kirana_store";
private static final String USER = "root";
private static final String PASSWORD = "your_password";
4️⃣ Run the Application
Compile and run the main class (e.g., Main.java).

Login using credentials from the users table (add a user manually if needed).

💡 Usage Guide
Login using your username and password.

Add Products in the product management section.

Add Customers with name, phone, and address.

Create a Bill:

Select a customer

Add products and enter quantity

System auto-calculates total, discount, and grand total

Save Bill — updates stock and records outstanding amounts automatically.

View Reports via the customer_bill_view.

🧠 Technologies Used
Technology	Purpose
Java	Core application logic
MySQL	Database storage
JDBC	Database connectivity
Swing / JavaFX	User Interface
CSS	UI Styling
JasperReports / PDF (optional)	Bill generation

🗂️ Folder Structure (Example)
pgsql
Copy code
kirana-store/
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   ├── db/DBConnection.java
│   │   │   ├── ui/MainFrame.java
│   │   │   ├── models/
│   │   │   └── controllers/
│   │   └── resources/
│   │       └── images/
│
├── sql/
│   └── kirana_store.sql
│
├── README.md
└── pom.xml / build.gradle (if using Maven/Gradle)
🧑‍💻 Default Admin Login (Optional)
If no user exists, insert one manually using:

sql
Copy code
INSERT INTO users (username, password) VALUES ('admin', 'admin123');
🧰 Backup & Restore
Backup Database:

bash
Copy code
mysqldump -u root -p kirana_store > kirana_store_backup.sql
Restore Database:

bash
Copy code
mysql -u root -p kirana_store < kirana_store_backup.sql
💬 Support
If you face any issues while setting up or running the project:

✅ Ensure MySQL service is running

✅ Verify database credentials in DBConnection.java

✅ Make sure kirana_store.sql has been properly imported



-- Create Database
CREATE DATABASE IF NOT EXISTS kirana_store;
USE kirana_store;

-- -------------------------------
-- Table: customers
-- -------------------------------
CREATE TABLE customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  address VARCHAR(255),
  outstanding DECIMAL(10,2) DEFAULT 0,
  status VARCHAR(1) DEFAULT 'A'
);

-- -------------------------------
-- Table: products
-- -------------------------------
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  selling_price DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL,
  image_path VARCHAR(255),
  cost_price DECIMAL(10,2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------------
-- Table: bills
-- -------------------------------
CREATE TABLE bills (
  bill_id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT,
  bill_no VARCHAR(20),
  bill_date DATETIME,
  subtotal DECIMAL(10,2),
  discount DECIMAL(10,2),
  grand_total DECIMAL(10,2),
  payment_method VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
);

-- -------------------------------
-- Table: bill_items
-- -------------------------------
CREATE TABLE bill_items (
  item_id INT AUTO_INCREMENT PRIMARY KEY,
  bill_id INT,
  product_id INT,
  product_name VARCHAR(100),
  qty INT,
  price DECIMAL(10,2),
  total_price DECIMAL(10,2),
  FOREIGN KEY (bill_id) REFERENCES bills(bill_id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- -------------------------------
-- Table: purchases
-- -------------------------------
CREATE TABLE purchases (
  id INT AUTO_INCREMENT PRIMARY KEY,
  supplier VARCHAR(100),
  amount DECIMAL(10,2),
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  bill_path VARCHAR(255)
);

-- -------------------------------
-- Table: users
-- -------------------------------
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

-- -------------------------------
-- View: customer_bill_view
-- -------------------------------
CREATE OR REPLACE VIEW customer_bill_view AS
SELECT 
    c.id AS id,
    c.name AS name,
    c.outstanding AS outstanding,
    b.bill_id AS bill_id,
    bi.product_name AS product_name,
    bi.qty AS qty,
    bi.price AS price
FROM customers c
JOIN bills b ON c.id = b.customer_id
JOIN bill_items bi ON b.bill_id = bi.bill_id;


