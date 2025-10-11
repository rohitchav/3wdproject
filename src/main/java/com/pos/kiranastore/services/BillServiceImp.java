package com.pos.kiranastore.services;

import com.pos.kiranastore.bean.Bill;
import com.pos.kiranastore.dao.BillDao;
import com.pos.kiranastore.serviceInterface.BillService;

public class BillServiceImp implements BillService {

	private BillDao billDao = new BillDao(); // DAO instance

	@Override
	public boolean saveBill(Bill bill) {
		return billDao.saveBill(bill); // call DAO to save
	}
}
