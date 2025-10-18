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

