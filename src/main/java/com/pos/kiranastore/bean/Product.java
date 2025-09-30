package com.pos.kiranastore.bean;
public class Product {
    private int id;
    private String name;
    private double costPrice;
    private double price;
    private int stock;
    private String category;
    private String imagePath;

    public Product() {}

    public Product(int id, String name, double costPrice, double price, int stock, String category, String imagePath) {
        this.id = id;
        this.name = name;
        this.costPrice = costPrice;
        this.price = price;
        this.stock = stock;
        this.category = category;
        this.imagePath = imagePath;
    }

    // Getters & Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public double getCostPrice() { return costPrice; }
    public void setCostPrice(double costPrice) { this.costPrice = costPrice; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getImagePath() { return imagePath; }
    public void setImagePath(String imagePath) { this.imagePath = imagePath; }
}
