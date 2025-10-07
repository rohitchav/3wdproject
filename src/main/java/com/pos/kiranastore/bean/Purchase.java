package com.pos.kiranastore.bean;


import java.math.BigDecimal;

public class Purchase {
	
	private int id;
    private String supplier;
    private BigDecimal amount;
    private String date;
    private String billPath;

    public int getId() { return id;}
    public void setId (int id) {this.id=id;}
    
    public String getSupplier() { return supplier; }
    public void setSupplier(String supplier) { this.supplier = supplier; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getBillPath() { return billPath; }
    public void setBillPath(String billPath) { this.billPath = billPath; }
}
