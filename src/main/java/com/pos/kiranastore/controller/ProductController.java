package com.pos.kiranastore.controller;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import com.google.gson.Gson;
import com.pos.kiranastore.bean.Product;
import com.pos.kiranastore.bean.Response;
import com.pos.kiranastore.dao.ProductDao;

@MultipartConfig(fileSizeThreshold = 1024 * 1024 * 2, // 2MB
		maxFileSize = 1024 * 1024 * 10, // 10MB
		maxRequestSize = 1024 * 1024 * 50 // 50MB
)
@WebServlet("/ProductController")
public class ProductController extends HttpServlet {
	ProductDao dao = new ProductDao();
	private static final long serialVersionUID = 1L;

	public ProductController() {
		super();
	}

	// Simple Response class for JSON

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		String action = request.getParameter("action");
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		Gson gson = new Gson();

		try (PrintWriter out = response.getWriter()) {
			if ("list".equals(action)) {
				List<Product> products = dao.getAllProducts();
				out.print(gson.toJson(products));
			} else if ("lowStock".equals(action)) {
				int threshold = 10;
				List<Product> lowStockProducts = dao.getLowStockProducts(threshold);
				out.print(gson.toJson(lowStockProducts));
			} else {
				response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid action");
			}
		} catch (Exception e) {
			e.printStackTrace();
			response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Server error");
		}
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		String action = request.getParameter("action");

		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		Gson gson = new Gson();

		try (PrintWriter out = response.getWriter()) {

			if (action == null) {
				out.print(gson.toJson(new Response(false, "Missing action parameter")));
				return;
			}

			if (action.equals("add")) {
				try {
					// 1. Retrieve form fields
					String name = request.getParameter("name");
					double costPrice = Double.parseDouble(request.getParameter("costPrice"));
					double sellingPrice = Double.parseDouble(request.getParameter("price"));
					String category = request.getParameter("category");
					int stock = Integer.parseInt(request.getParameter("stock"));

					// 2. Handle file upload
					Part filePart = request.getPart("imageFile");
					String fileName = "";

					if (filePart != null && filePart.getSize() > 0) {
						fileName = Paths.get(filePart.getSubmittedFileName()).getFileName().toString();

						String uploadPath = getServletContext().getRealPath("") + File.separator + "uploads";
						File uploadDir = new File(uploadPath);
						if (!uploadDir.exists())
							uploadDir.mkdir();

						filePart.write(uploadPath + File.separator + fileName);
					}

					// 3. Create Product object
					Product product = new Product();
					product.setName(name);
					product.setCostPrice(costPrice);
					product.setSellingPrice(sellingPrice);
					product.setCategory(category);
					product.setStock(stock);
					if (!fileName.isEmpty()) {
						product.setImagePath("uploads/" + fileName);
					}
					boolean isAdded = dao.addProduct(product);

					// 5. Return JSON response
					if (isAdded) {
						out.print(gson.toJson(new Response(true, "Product added successfully")));
					} else {
						out.print(gson.toJson(new Response(false, "Failed to add product")));
					}

				} catch (Exception e) {
					e.printStackTrace();
					out.print(gson.toJson(new Response(false, "Invalid input or server error")));
				}

			} else if (action.equals("update")) {
				try {
					int id = Integer.parseInt(request.getParameter("id"));
					String name = request.getParameter("name");
					double costPrice = Double.parseDouble(request.getParameter("costPrice"));
					double sellingPrice = Double.parseDouble(request.getParameter("price"));
					String category = request.getParameter("category");
					int stock = Integer.parseInt(request.getParameter("stock"));

					// Handle file upload (optional, only if user uploads new image)
					Part filePart = request.getPart("imageFile");
					String fileName = "";
					String imagePath = null;

					if (filePart != null && filePart.getSize() > 0) {
						fileName = Paths.get(filePart.getSubmittedFileName()).getFileName().toString();

						String uploadPath = getServletContext().getRealPath("") + File.separator + "uploads";
						File uploadDir = new File(uploadPath);
						if (!uploadDir.exists())
							uploadDir.mkdir();

						filePart.write(uploadPath + File.separator + fileName);
						imagePath = "uploads/" + fileName;
					}

					// Create Product object
					Product product = new Product();
					product.setId(id);
					product.setName(name);
					product.setCostPrice(costPrice);
					product.setSellingPrice(sellingPrice);
					product.setCategory(category);
					product.setStock(stock);

					// in ProductController update
					if (imagePath != null) {
						product.setImagePath(imagePath);
					} else {
						product.setImagePath(new ProductDao().getProductImage(id)); // ✅ preserve old image
					}
					boolean updated = dao.updateProduct(product);

					if (updated) {
						out.print(gson.toJson(new Response(true, "Product updated successfully")));
					} else {
						out.print(gson.toJson(new Response(false, "Failed to update product")));
					}

				} catch (Exception e) {
					e.printStackTrace();
					out.print(gson.toJson(new Response(false, "Invalid input or server error")));
				}
			} else if (action.equals("delete")) {
				try {
					int id = Integer.parseInt(request.getParameter("id"));
					boolean deleted = dao.deleteProduct(id);
					if (deleted) {
						out.print(gson.toJson(new Response(true, "Product deleted successfully")));
					} else {
						out.print(gson.toJson(new Response(false, "Failed to delete product")));
					}
				} catch (Exception e) {
					e.printStackTrace();
					out.print(gson.toJson(new Response(false, "Invalid input or server error")));
				}
			} else if (action.equals("deleteAll")) {
				try {
					ProductDao dao = new ProductDao();
					boolean deleted = dao.deleteAllProduct();

					if (deleted) {
						out.print(gson.toJson(new Response(true, "Products deleted successfully")));
					} else {
						out.print(gson.toJson(new Response(false, "Failed to delete product")));
					}
				} catch (Exception e) {
					e.printStackTrace();
					out.print(gson.toJson(new Response(false, "Invalid input or server error")));
				}
			} else if ("updateStock".equals(action)) {
				try {
					// Read JSON array from request body
					String json = request.getReader().lines().collect(Collectors.joining());
					Product[] products = new Gson().fromJson(json, Product[].class);

					boolean success = dao.updateStock(products);

					response.setContentType("application/json");
					response.setCharacterEncoding("UTF-8");
					if (success) {
						response.getWriter().write("{\"status\":\"success\"}");
					} else {
						response.getWriter().write("{\"status\":\"error\",\"message\":\"Stock update failed\"}");
					}
					response.getWriter().flush();
				} catch (Exception e) {
					e.printStackTrace();
					response.setContentType("application/json");
					response.setCharacterEncoding("UTF-8");
					response.getWriter().write("{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}");
					response.getWriter().flush();
				}
			}

			else {
				out.print(gson.toJson(new Response(false, "Unknown action: " + action)));
			}

		}
	}
}
