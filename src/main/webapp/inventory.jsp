<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%
    String vlang = (String) session.getAttribute("vlang");
    if (vlang == null) {
        session.setAttribute("vlang", "EN");
    }
%>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Inventory</title>
<link rel="stylesheet" href="assets/css/home.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
<!-- For AngularJS 1.x -->
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.3/angular.min.js"></script>

<style>
    body { background-color: #f8f9fa; }
    .container-fluid { padding: 20px; }
    .card { border: none; border-radius: 8px; box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075); }
    .header-controls { display: flex; gap: 10px; }
    .table img { width: 30px; height: 30px; object-fit: cover; border-radius: 4px; margin-right: 10px; vertical-align: middle; }
    .action-icons { cursor: pointer; margin: 0 5px; font-size: 1.1em; transition: color 0.2s; }
    .btn-primary-custom { background-color: #2979ff; border-color: #2979ff; }
    .btn-warning-custom { background-color: #ff9800; border-color: #ff9800; color: white; }
    html, body {
    height: 100%;
}

.sidebar {
    height: 100%;
    min-height: 100vh; /* Makes sidebar full viewport height */
    border-right: 1px solid #ddd;
}
    
</style>
</head>
<body ng-app="inventoryApp" ng-controller="InventoryController">

<%@ include file="navbar.jsp" %>


<div class="container-fluid p-0" style="height: 100vh;">
    <div class="d-flex" style="height: 100%;">
        
        <!-- Sidebar -->
        <div class="sidebar">
            <%@ include file="sidebar.jsp" %>
        </div>

        <!-- Main Content -->
        <div class="content">
            <div class="flex-grow-1 p-3" style="overflow-y: auto;">
            <div class="card p-4">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2 class="h4 font-weight-bold">Inventory Management</h2>
                    <div class="header-controls">
                        <button class="btn btn-primary btn-primary-custom" data-toggle="modal" data-target="#addProductModal">
                            <i class="fas fa-plus"></i> Add New Product
                        </button>
                        <button class="btn btn-danger" id="deleteAllButton">
                            <i class="fas fa-trash-alt"></i> Delete All
                        </button>
                    </div>
                </div>

                <!-- Session Message -->
                <c:if test="${not empty sessionScope.msg}">
                    <div class="alert alert-info alert-dismissible fade show" role="alert">
                        <c:out value="${sessionScope.msg}"/>
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <c:remove var="msg" scope="session"/>
                </c:if>

                <!-- Product Table -->
                <div class="table-responsive">
                   <table class="table table-hover" ng-init="loadProducts()">
						    <thead>
						        <tr>
						            <th>Product Name</th>
						            <th>Category</th>
						            <th>Cost Price</th>
						            <th>Selling Price</th>
						            <th>Stock</th>
						            <th>Actions</th>
						        </tr>
						    </thead>
						    <tbody>
						        <tr ng-repeat="p in products">
						            <td>
						                <img ng-src="{{p.imagePath ? p.imagePath : 'images/placeholder.png'}}" 
						                     alt="{{p.name}}" width="30" height="30">
						                {{p.name}}
						            </td>
						            <td>{{p.category}}</td>
						            <td>&#8377; {{p.costPrice}}</td>
						            <td>&#8377; {{p.sellingPrice}}</td>
						            <td>{{p.stock}}</td>
						            <td>
						                <a href="" ng-click="editProduct(p)" class="text-primary">
						                    <i class="fas fa-edit"></i>
						                </a>
						                <a href="" ng-click="deleteProduct(p.id)" class="text-danger">
						                    <i class="fas fa-trash-alt"></i>
						                </a>
						            </td>
						        </tr>
						        <tr ng-if="products.length === 0">
						            <td colspan="6" class="text-center text-muted p-4">
						                <i class="fas fa-box-open mr-2"></i> No products found.
						            </td>
						        </tr>
						    </tbody>
						</table>

                </div>

                <div class="text-right mt-3">
                    <button class="btn btn-secondary">
                        <i class="fas fa-download"></i> Download Low Stock Report
                    </button>
                </div>
            </div>
        </div>
        </div>
    </div>
</div>


<!-- Add Product Modal -->
<div class="modal fade" id="addProductModal" tabindex="-1" role="dialog" aria-labelledby="addProductModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="addProductModalLabel" style="color: #337ab7;">Add New Product</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            
            <form id="addProductForm" ng-submit="addProduct()" enctype="multipart/form-data">
            
                <input type="hidden" name="action" value="add">
                
                <div class="modal-body">
                    <div class="form-group">
                        <label for="productName">Product Name</label>
                        <input type="text" class="form-control" id="productName" name="name" placeholder="Enter product name" required>
                    </div>
                    <div class="form-row">
                        <div class="form-group col-md-6">
                            <label for="costPrice">Cost Price (&#8377;)</label>
                            <input type="number" step="0.01" class="form-control" id="costPrice" name="costPrice" placeholder="0.00" required>
                        </div>
                        <div class="form-group col-md-6">
                            <label for="sellingPrice">Selling Price (&#8377;)</label>
                            <input type="number" step="0.01" class="form-control" id="sellingPrice" name="price" placeholder="0.00" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group col-md-6">
                            <label for="category">Category</label>
                            <select id="category" name="category" class="form-control" required>
                                <option value="" selected>-- Select a Category --</option>
                                <option value="Snacks">Snacks</option>
                                <option value="Beverages">Beverages</option>
                                <option value="Dairy">Dairy</option>
                                <option value="Household">Household</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div class="form-group col-md-6">
                            <label for="stockQuantity">Stock Quantity</label>
                            <input type="number" class="form-control" id="stockQuantity" name="stock" placeholder="0" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="productImageFile">Product Image</label>
                        <div class="custom-file">
                            <input type="file" class="custom-file-input" id="productImageFile" name="imageFile" accept="image/*">
                            <label class="custom-file-label" for="productImageFile">Choose file</label>
                        </div>
                        <input type="hidden" name="imagePath" id="imagePathHidden" value="">
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-warning btn-warning-custom">Add Product</button>
                </div>
            </form>
        </div>
    </div>
</div>

<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>

<%@ include file="jslink.jsp" %>
</body>
</html>
