package com.pos.kiranastore.services;

import com.pos.kiranastore.bean.DashboardStats;
import com.pos.kiranastore.dao.DashboardDAO;
import com.pos.kiranastore.serviceInterface.DashboardService;

public class DashboardServiceImp implements DashboardService {

	private DashboardDAO dashboardDAO = new DashboardDAO();

	@Override
	public DashboardStats getStats(String period) throws Exception {
		// Add business logic if needed
		if (period == null || period.trim().isEmpty()) {
			period = "today";
		}
		return dashboardDAO.getStats(period);
	}
}
