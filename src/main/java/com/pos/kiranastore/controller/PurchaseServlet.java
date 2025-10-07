package com.pos.kiranastore.controller;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

import com.google.gson.Gson;
import com.pos.kiranastore.bean.Purchase;
import com.pos.kiranastore.dao.PurchaseDAO;

@WebServlet("/PurchaseServlet")
@MultipartConfig(fileSizeThreshold = 1024 * 1024, // 1 MB
                 maxFileSize = 5 * 1024 * 1024,   // 5 MB
                 maxRequestSize = 10 * 1024 * 1024) // 10 MB
public class PurchaseServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private static final String UPLOAD_DIR = "uploads";

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        request.setCharacterEncoding("UTF-8");

        String supplier = request.getParameter("supplier");
        BigDecimal amount = new BigDecimal(request.getParameter("amount"));

        // Handle file upload
        Part filePart = request.getPart("billFile");
        String fileName = null;
        String filePath = null;

        if (filePart != null && filePart.getSize() > 0) {
            fileName = new File(filePart.getSubmittedFileName()).getName();
            String uploadPath = getServletContext().getRealPath("") + File.separator + UPLOAD_DIR;
            File uploadDir = new File(uploadPath);
            if (!uploadDir.exists()) uploadDir.mkdir();

            filePath = request.getContextPath() + "/" + UPLOAD_DIR + "/" + fileName; // URL path
            filePart.write(uploadPath + File.separator + fileName);
        }

        PurchaseDAO dao = new PurchaseDAO();
        boolean success = dao.addPurchase(supplier, amount, filePath);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write("{\"success\":" + success + "}");
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String action = request.getParameter("action");
        if ("list".equals(action)) {
            // Return JSON list of purchases
            PurchaseDAO dao = new PurchaseDAO();
            List<Purchase> purchases = dao.getAllPurchases();

            // Convert to JSON
            String json = new Gson().toJson(purchases);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(json);
            return;
        }

        // Normal page forward
        request.getRequestDispatcher("/purchase.jsp").forward(request, response);
    }
}
