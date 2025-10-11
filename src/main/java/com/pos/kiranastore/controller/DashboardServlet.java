package com.pos.kiranastore.controller;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.pos.kiranastore.bean.DashboardStats;
import com.pos.kiranastore.serviceInterface.DashboardService;
import com.pos.kiranastore.services.DashboardServiceImp;

@WebServlet("/DashboardServlet")
public class DashboardServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	private DashboardService dashboardService = new DashboardServiceImp();

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		String action = request.getParameter("action");

		try {
			if ("getStats".equalsIgnoreCase(action)) {
				String period = request.getParameter("period");
				DashboardStats stats = dashboardService.getStats(period);

				response.setContentType("application/json");
				response.setCharacterEncoding("UTF-8");

				String json = String.format(
						"{" + "\"totalSales\": %.2f," + "\"transactions\": %d," + "\"itemsSold\": %d,"
								+ "\"avgBill\": %.2f," + "\"totalRevenue\": %.2f," + "\"cogs\": %.2f,"
								+ "\"grossProfit\": %.2f," + "\"totalExpenses\": %.2f," + "\"netLoss\": %.2f" + "}",
						stats.getTotalSales(), stats.getTransactions(), stats.getItemsSold(), stats.getAvgBill(),
						stats.getTotalRevenue(), stats.getCogs(), stats.getGrossProfit(), stats.getTotalExpenses(),
						stats.getNetLoss());

				PrintWriter out = response.getWriter();
				out.print(json);
				out.flush();
			} else {
				request.getRequestDispatcher("/dashboard.jsp").forward(request, response);
			}
		} catch (Exception e) {
			e.printStackTrace();
			response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
					"Error fetching dashboard data: " + e.getMessage());
		}
	}

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doGet(request, response);
	}
}
