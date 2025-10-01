package com.pos.kiranastore.controller;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Paths;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import com.google.gson.Gson;
import com.pos.kiranastore.bean.Product;
import com.pos.kiranastore.dao.ProductDao;
import com.pos.kiranastore.bean.Response;
@MultipartConfig(
    fileSizeThreshold = 1024 * 1024 * 2,  // 2MB
    maxFileSize = 1024 * 1024 * 10,       // 10MB
    maxRequestSize = 1024 * 1024 * 50     // 50MB
)
@WebServlet("/ProductController")
public class ProductController extends HttpServlet {
    private static final long serialVersionUID = 1L;

    public ProductController() {
        super();
    }

    // Simple Response class for JSON

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String action = request.getParameter("action");
        ProductDao dao = new ProductDao();

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try (PrintWriter out = response.getWriter()) {
            if ("list".equals(action)) {
                List<Product> products = dao.getAllProducts();
                Gson gson = new Gson();
                out.print(gson.toJson(products));
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
                        if (!uploadDir.exists()) uploadDir.mkdir();

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

                    // 4. Call DAO to save product
                    ProductDao dao = new ProductDao();
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
                // TODO: handle update

            } else if (action.equals("delete")) {
                // TODO: handle delete

            } else {
                out.print(gson.toJson(new Response(false, "Unknown action: " + action)));
            }

        }
    }
}
