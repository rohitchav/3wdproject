package com.pos.kiranastore.services;

import java.util.List;

import com.pos.kiranastore.bean.Product;
import com.pos.kiranastore.dao.ProductDao;
import com.pos.kiranastore.serviceInterface.ProductService;

public class ProductServiceImp implements ProductService {

	private ProductDao dao = new ProductDao();

	@Override
	public List<Product> getAllProducts() throws Exception {
		return dao.getAllProducts();
	}

	@Override
	public List<Product> getLowStockProducts(int threshold) throws Exception {
		return dao.getLowStockProducts(threshold);
	}

	@Override
	public boolean addProduct(Product product) throws Exception {
		if (product.getName() == null || product.getName().trim().isEmpty()) {
			throw new IllegalArgumentException("Product name is required");
		}
		if (product.getStock() < 0) {
			throw new IllegalArgumentException("Stock cannot be negative");
		}
		return dao.addProduct(product);
	}

	@Override
	public boolean updateProduct(Product product) throws Exception {
		return dao.updateProduct(product);
	}

	@Override
	public boolean deleteProduct(int id) throws Exception {
		return dao.deleteProduct(id);
	}

	@Override
	public boolean deleteAllProducts() throws Exception {
		return dao.deleteAllProduct();
	}

	@Override
	public int getProductStock(int id) throws Exception {
		return dao.getProductStock(id);
	}

	@Override
	public boolean updateStock(Product[] products) throws Exception {
		return dao.updateStock(products);
	}

	@Override
	public String getProductImage(int id) throws Exception {
		return dao.getProductImage(id);
	}

}
