package com.pos.kiranastore.controller;



import com.pos.kiranastore.bean.Product;
import com.pos.kiranastore.dao.ProductDao;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;

@WebServlet("/ProductController")
public class ProductController extends HttpServlet {

    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private ProductDao productDao = new ProductDao();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String action = request.getParameter("action");

        if ("add".equalsIgnoreCase(action)) {
            addProduct(request, response);
        } else if ("sell".equalsIgnoreCase(action)) {
            sellProduct(request, response);
        } else {
            response.sendRedirect("HomeServlet");
        }
    }

    private void addProduct(HttpServletRequest request, HttpServletResponse response)
            throws IOException, ServletException {
        try {
            String name = request.getParameter("name");
            double costPrice = Double.parseDouble(request.getParameter("costPrice"));
            double price = Double.parseDouble(request.getParameter("price"));
            int stock = Integer.parseInt(request.getParameter("stock"));
            String category = request.getParameter("category");
            String imagePath = request.getParameter("imagePath");

            Product product = new Product();
            product.setName(name);
            product.setCostPrice(costPrice);
            product.setPrice(price);
            product.setStock(stock);
            product.setCategory(category);
            product.setImagePath(imagePath);

            boolean success = productDao.addProduct(product);

            if (success) {
                request.getSession().setAttribute("msg", "Product added successfully!");
                
            } else {
                request.getSession().setAttribute("msg", "Failed to add product.");
               
            }

        } catch (Exception e) {
            e.printStackTrace();
            request.getSession().setAttribute("msg", "Error: " + e.getMessage());
        }

		 response.sendRedirect("InventoryServlet"); 
        
    }

    private void sellProduct(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        try {
            int productId = Integer.parseInt(request.getParameter("productId"));
            int qty = Integer.parseInt(request.getParameter("qty"));

            boolean success = productDao.updateStock(productId, qty);

            if (success) {
                request.getSession().setAttribute("msg", "Product sold successfully!");
            } else {
                request.getSession().setAttribute("msg", "Failed to sell product.");
            }

        } catch (Exception e) {
            e.printStackTrace();
            request.getSession().setAttribute("msg", "Error: " + e.getMessage());
        }

        response.sendRedirect("HomeServlet");
    }
}
