package com.pos.kiranastore.services;

import java.math.BigDecimal;
import java.util.List;

import com.pos.kiranastore.bean.Purchase;
import com.pos.kiranastore.dao.PurchaseDAO;
import com.pos.kiranastore.serviceInterface.PurchaseService;

public class PurchaseServiceImp implements PurchaseService {

	private PurchaseDAO dao = new PurchaseDAO();

	@Override
	public boolean addPurchase(String supplier, BigDecimal amount, String filePath) throws Exception {
		if (supplier == null || supplier.trim().isEmpty()) {
			throw new IllegalArgumentException("Supplier is required.");
		}
		if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
			throw new IllegalArgumentException("Amount must be greater than zero.");
		}
		return dao.addPurchase(supplier, amount, filePath);
	}

	@Override
	public boolean deletePurchase(int id) throws Exception {
		if (id <= 0) {
			throw new IllegalArgumentException("Invalid purchase ID.");
		}
		return dao.deletePurchase(id);
	}

	@Override
	public List<Purchase> getAllPurchases() throws Exception {
		return dao.getAllPurchases();
	}

}
