package com.pos.kiranastore.serviceInterface;

import java.util.List;

import com.pos.kiranastore.bean.Product;

public interface ProductService {
	List<Product> getAllProducts() throws Exception;

	List<Product> getLowStockProducts(int threshold) throws Exception;

	boolean addProduct(Product product) throws Exception;

	boolean updateProduct(Product product) throws Exception;

	boolean deleteProduct(int id) throws Exception;

	boolean deleteAllProducts() throws Exception;

	int getProductStock(int id) throws Exception;

	boolean updateStock(Product[] products) throws Exception;

	String getProductImage(int id) throws Exception;
}
