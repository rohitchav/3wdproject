package com.pos.kiranastore.serviceInterface;

import java.util.List;

import com.pos.kiranastore.bean.Customer;

public interface DebtService {
	List<Customer> getDebtors() throws Exception;

	boolean payDebt(int customerId, double paidAmount) throws Exception;
}
