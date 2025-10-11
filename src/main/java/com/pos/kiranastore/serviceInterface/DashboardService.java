package com.pos.kiranastore.serviceInterface;

import com.pos.kiranastore.bean.DashboardStats;

public interface DashboardService {
	DashboardStats getStats(String period) throws Exception;
}
