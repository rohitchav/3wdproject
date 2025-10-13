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
import com.pos.kiranastore.serviceInterface.ProductService;
import com.pos.kiranastore.services.ProductServiceImp;

@WebServlet("/ProductController")
@MultipartConfig(fileSizeThreshold = 1024 * 1024 * 2, maxFileSize = 1024 * 1024 * 10, maxRequestSize = 1024 * 1024 * 50)
public class ProductController extends HttpServlet {

	private static final long serialVersionUID = 1L;
	private ProductService productService = new ProductServiceImp();

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		String action = request.getParameter("action");
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		Gson gson = new Gson();

		try (PrintWriter out = response.getWriter()) {

			if ("list".equals(action)) {
				List<Product> products = productService.getAllProducts();
				out.print(gson.toJson(products));

			} else if ("lowStock".equals(action)) {
				int threshold = 10;
				List<Product> lowStockProducts = productService.getLowStockProducts(threshold);
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
				handleAdd(request, response, out, gson);

			} else if (action.equals("update")) {
				handleUpdate(request, response, out, gson);

			} else if (action.equals("delete")) {
				int id = Integer.parseInt(request.getParameter("id"));
				boolean deleted = productService.deleteProduct(id);
				out.print(gson.toJson(
						new Response(deleted, deleted ? "Product deleted successfully" : "Failed to delete product")));

			} else if (action.equals("deleteAll")) {
				boolean deleted = productService.deleteAllProducts();
				out.print(gson.toJson(
						new Response(deleted, deleted ? "Products deleted successfully" : "Failed to delete product")));

			} else if ("updateStock".equals(action)) {
				String json = request.getReader().lines().collect(Collectors.joining());
				Product[] products = new Gson().fromJson(json, Product[].class);

				for (Product p : products) {
					int availableQty = productService.getProductStock(p.getId());
					if (p.getQty() > availableQty) {
						response.getWriter().write("{\"status\":\"error\",\"message\":\"Requested quantity for product "
								+ p.getName() + " exceeds available stock.\"}");
						return;
					}
				}

				boolean success = productService.updateStock(products);

				System.out.println("DEbug Mode:-" + success);
				response.getWriter().write("{\"status\":\"" + (success ? "success" : "error") + "\"}");
			}

		} catch (Exception e) {
			e.printStackTrace();
			response.getWriter().write("{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}");
		}
	}

	private void handleAdd(HttpServletRequest request, HttpServletResponse response, PrintWriter out, Gson gson)
			throws Exception {
		String name = request.getParameter("name");
		double costPrice = Double.parseDouble(request.getParameter("costPrice"));
		double sellingPrice = Double.parseDouble(request.getParameter("price"));
		String category = request.getParameter("category");
		int stock = Integer.parseInt(request.getParameter("stock"));

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

		Product product = new Product();
		product.setName(name);
		product.setCostPrice(costPrice);
		product.setSellingPrice(sellingPrice);
		product.setCategory(category);
		product.setStock(stock);
		if (!fileName.isEmpty())
			product.setImagePath("uploads/" + fileName);

		boolean isAdded = productService.addProduct(product);
		out.print(gson.toJson(new Response(isAdded, isAdded ? "Product added successfully" : "Failed to add product")));
	}

	private void handleUpdate(HttpServletRequest request, HttpServletResponse response, PrintWriter out, Gson gson)
			throws Exception {
		int id = Integer.parseInt(request.getParameter("id"));
		String name = request.getParameter("name");
		double costPrice = Double.parseDouble(request.getParameter("costPrice"));
		double sellingPrice = Double.parseDouble(request.getParameter("price"));
		String category = request.getParameter("category");
		int stock = Integer.parseInt(request.getParameter("stock"));

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

		Product product = new Product();
		product.setId(id);
		product.setName(name);
		product.setCostPrice(costPrice);
		product.setSellingPrice(sellingPrice);
		product.setCategory(category);
		product.setStock(stock);
		product.setImagePath(imagePath != null ? imagePath : productService.getProductImage(id));

		boolean updated = productService.updateProduct(product);
		out.print(gson
				.toJson(new Response(updated, updated ? "Product updated successfully" : "Failed to update product")));
	}
}
