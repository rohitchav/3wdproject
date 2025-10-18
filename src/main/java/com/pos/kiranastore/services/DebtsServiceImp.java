package com.pos.kiranastore.services;

import java.util.List;

import com.pos.kiranastore.bean.Customer;
import com.pos.kiranastore.dao.DebtsDAO;
import com.pos.kiranastore.serviceInterface.DebtService;

public class DebtsServiceImp implements DebtService {

	private DebtsDAO dao = new DebtsDAO();

	@Override
	public List<Customer> getDebtors() throws Exception {
		return dao.getDebtors();
	}

	@Override
	public boolean payDebt(int customerId, double paidAmount) throws Exception {

		return dao.payDebt(customerId, paidAmount);
	}
}
