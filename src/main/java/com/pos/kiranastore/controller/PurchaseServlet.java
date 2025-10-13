package com.pos.kiranastore.controller;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import com.google.gson.Gson;
import com.pos.kiranastore.bean.Purchase;
import com.pos.kiranastore.serviceInterface.PurchaseService;
import com.pos.kiranastore.services.PurchaseServiceImp;

@WebServlet("/PurchaseServlet")
@MultipartConfig(fileSizeThreshold = 1024 * 1024, maxFileSize = 5 * 1024 * 1024, maxRequestSize = 10 * 1024 * 1024)
public class PurchaseServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	private static final String UPLOAD_DIR = "uploads";
	private PurchaseService purchaseService = new PurchaseServiceImp();

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		String action = request.getParameter("action");

		try {
			if ("delete".equalsIgnoreCase(action)) {
				int id = Integer.parseInt(request.getParameter("id"));
				boolean deleted = purchaseService.deletePurchase(id);
				writeJson(response, deleted);
				return;
			}

			String supplier = request.getParameter("supplier");
			BigDecimal amount = new BigDecimal(request.getParameter("amount"));

			Part filePart = request.getPart("billFile");
			String fileName = null;
			String filePath = null;

			if (filePart != null && filePart.getSize() > 0) {
				fileName = new File(filePart.getSubmittedFileName()).getName();
				String uploadPath = getServletContext().getRealPath("") + File.separator + UPLOAD_DIR;
				File uploadDir = new File(uploadPath);
				if (!uploadDir.exists())
					uploadDir.mkdir();

				filePath = request.getContextPath() + "/" + UPLOAD_DIR + "/" + fileName;
				filePart.write(uploadPath + File.separator + fileName);
			}

			boolean success = purchaseService.addPurchase(supplier, amount, filePath);
			writeJson(response, "{\"success\":" + success + "}");

		} catch (Exception e) {
			e.printStackTrace();
			writeJson(response, "{\"success\":false,\"message\":\"" + e.getMessage() + "\"}");
		}
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String action = request.getParameter("action");

		try {
			if ("list".equals(action)) {
				List<Purchase> purchases = purchaseService.getAllPurchases();
				writeJson(response, purchases);
				return;
			}
		} catch (Exception e) {
			e.printStackTrace();
			writeJson(response, "{\"success\":false,\"message\":\"" + e.getMessage() + "\"}");
		}

		request.getRequestDispatcher("/purchase.jsp").forward(request, response);
	}

	private void writeJson(HttpServletResponse response, Object obj) throws IOException {
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(new Gson().toJson(obj));
	}
}
