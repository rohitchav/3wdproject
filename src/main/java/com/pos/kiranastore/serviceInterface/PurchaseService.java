package com.pos.kiranastore.serviceInterface;

import com.pos.kiranastore.bean.Purchase;
import java.math.BigDecimal;
import java.util.List;

public interface PurchaseService {
    boolean addPurchase(String supplier, BigDecimal amount, String filePath) throws Exception;
    boolean deletePurchase(int id) throws Exception;
    List<Purchase> getAllPurchases() throws Exception;
}