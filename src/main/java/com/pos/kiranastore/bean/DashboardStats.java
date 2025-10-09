package com.pos.kiranastore.bean;

public class DashboardStats {
    private double totalSales;
    private int transactions;
    private int itemsSold;
    private double avgBill;
    private double totalRevenue;
    private double cogs;
    private double grossProfit;
    private double totalExpenses;
    private double netLoss;

    public double getTotalSales() { return totalSales; }
    public void setTotalSales(double totalSales) { this.totalSales = totalSales; }

    public int getTransactions() { return transactions; }
    public void setTransactions(int transactions) { this.transactions = transactions; }

    public int getItemsSold() { return itemsSold; }
    public void setItemsSold(int itemsSold) { this.itemsSold = itemsSold; }

    public double getAvgBill() { return avgBill; }
    public void setAvgBill(double avgBill) { this.avgBill = avgBill; }

    public double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(double totalRevenue) { this.totalRevenue = totalRevenue; }

    public double getCogs() { return cogs; }
    public void setCogs(double cogs) { this.cogs = cogs; }

    public double getGrossProfit() { return grossProfit; }
    public void setGrossProfit(double grossProfit) { this.grossProfit = grossProfit; }

    public double getTotalExpenses() { return totalExpenses; }
    public void setTotalExpenses(double totalExpenses) { this.totalExpenses = totalExpenses; }

    public double getNetLoss() { return netLoss; }
    public void setNetLoss(double netLoss) { this.netLoss = netLoss; }
}
