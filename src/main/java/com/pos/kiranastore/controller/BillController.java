package com.pos.kiranastore.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.pos.kiranastore.bean.Bill;
import com.pos.kiranastore.serviceInterface.BillService;
import com.pos.kiranastore.services.BillServiceImp;

@WebServlet("/BillingController")
public class BillController extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private BillService billService = new BillServiceImp();

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		String action = request.getParameter("action");
		if ("save".equalsIgnoreCase(action)) {
			saveBill(request, response);
		}
	}

	private void saveBill(HttpServletRequest request, HttpServletResponse response) throws IOException {
		response.setContentType("application/json");
		PrintWriter out = response.getWriter();

		try {
			BufferedReader reader = request.getReader();
			Gson gson = new Gson();
			Bill bill = gson.fromJson(reader, Bill.class);

			boolean result = billService.saveBill(bill); // use service instead of DAO

			if (result)
				out.print("{\"status\":\"success\",\"message\":\"Bill saved successfully!\"}");
			else
				out.print("{\"status\":\"error\",\"message\":\"Failed to save bill.\"}");

		} catch (Exception e) {
			e.printStackTrace();
			out.print("{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}");
		}
	}
}
