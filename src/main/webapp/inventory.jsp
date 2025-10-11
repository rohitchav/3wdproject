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
  <title>Inventory | Kirana Store</title>
  <link rel="icon" href="assets/images/inventory.jpg" type="image/png">
  <link rel="stylesheet" href="assets/css/common.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">

  <!-- ✅ Load jQuery first -->
  <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>

  <!-- ✅ Then Bootstrap JS (depends on jQuery) -->
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.bundle.min.js"></script>

  <!-- AngularJS -->
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.3/angular.min.js"></script>

  <!-- Your custom JS -->
  <script src="assets/js/inventory.js"></script>
</head>

<body ng-app="inventoryApp" ng-controller="InventoryController">

<jsp:include page="navbar.jsp">
   <jsp:param name="servlet" value="InventoryServlet"/>
</jsp:include>


       
        
        <%@include file = "sidebar.jsp" %>>

        <!-- Main Content -->
        <div class="content">
            <div class="flex-grow-1 p-3" style="overflow-y: auto;">
            <div class="card p-4">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2 class="h4 font-weight-bold">${lblInventoryPageTitle}</h2>
                    <div class="header-controls">
                        <button class="btn btn-primary btn-primary-custom" data-toggle="modal" data-target="#addProductModal">
                            <i class="fas fa-plus"></i> ${lblAddNewProduct}
                        </button>
                        <button class="btn btn-danger" id="deleteAllButton" ng-click="deleteAllProduct()">
                            <i class="fas fa-trash-alt"></i> ${lblDeleteAllProducts}
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
						            <th>${lblProductName}</th>
						            <th>${lblCategory}</th>
						            <th> ${lblCostPrice}</th>
						            <th>${lblSellingPrice}</th>
						            <th>${lblStock}</th>
						            <th>${lblAction}</th>
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
											<button type="button" ng-click="openEditModal(p)"
												class="btn btn-link text-primary p-0">
												<i class="fas fa-edit"></i>
											</button>
											<button type="button" ng-click="deleteProduct(p.id)"
												class="btn btn-danger btn-sm">
												<i class="fas fa-trash-alt"></i>
											</button>
										</td>
									</tr>
						        <tr ng-if="products.length === 0">
						            <td colspan="6" class="text-center text-muted p-4">
						                <i class="fas fa-box-open mr-2"></i> ${lblNoProduct}.
						            </td>
						        </tr>
						    </tbody>
						</table>

                </div>

                <div class="text-right mt-3">
                    <button class="btn btn-secondary" ng-click="downloadLowStockReport()">
                        <i class="fas fa-download"></i> ${lblLowStockReport}
                    </button>
                </div>
            </div>
        </div>
        </div>
  

<!-- Add Product Modal -->
<div class="modal fade" id="addProductModal" tabindex="-1" role="dialog" aria-labelledby="addProductModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="addProductModalLabel" style="color: #337ab7;">${lblAddNewProduct}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            
            <form id="addProductForm" ng-submit="addProduct()" enctype="multipart/form-data">
            
                <input type="hidden" name="action" value="add">
                
                <div class="modal-body">
                    <div class="form-group">
                        <label for="productName"> ${lblProductName }</label>
                        <input type="text" class="form-control" id="productName" name="name" placeholder="Enter product name" required>
                    </div>
                    <div class="form-row">
                        <div class="form-group col-md-6">
                            <label for="costPrice">${lblCostPrice} (&#8377;)</label>
                            <input type="number" step="0.01" class="form-control" id="costPrice" name="costPrice" placeholder="0.00" required>
                        </div>
                        <div class="form-group col-md-6">
                            <label for="sellingPrice">${lblSellingPrice } (&#8377;)</label>
                            <input type="number" step="0.01" class="form-control" id="sellingPrice" name="price" placeholder="0.00" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group col-md-6">
                            <label for="category">${lblCategory}</label>
                            <select id="category" name="category" class="form-control" required>
                                <option value="" selected>-- Select a Category --</option>
                                <option value="Snacks">${lblSnacks}</option>
                                <option value="Beverages">${lblBeverages}</option>
                                <option value="Dairy">${lblDairy}</option>
                                <option value="Household">${lblHousehold}</option>
                                <option value="Other">${lblOther} </option>
                            </select>
                        </div>
                        <div class="form-group col-md-6">
                            <label for="stockQuantity">${lblStockQuantity}</label>
                            <input type="number" class="form-control" id="stockQuantity" name="stock" placeholder="0" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="productImageFile">${lblProductImage}</label>
                        <div class="custom-file">
                            <input type="file" class="custom-file-input" id="productImageFile" name="imageFile" accept="image/*">
                            <label class="custom-file-label" for="productImageFile">Choose file</label>
                        </div>
                        <input type="hidden" name="imagePath" id="imagePathHidden" value="">
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">${lblcancel }</button>
                    <button type="submit" class="btn btn-warning btn-warning-custom">${lblAddNewProduct}</button>
                </div>
            </form>
        </div>
    </div>
</div>
<!-- Edit Product Modal -->
<div class="modal fade" id="editProductModal" tabindex="-1" role="dialog" aria-labelledby="editProductModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="editProductModalLabel" style="color: #337ab7;">Edit Product</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      
      <form ng-submit="updateProduct(selectedProduct)" enctype="multipart/form-data">
        <div class="modal-body">
        <input type="hidden" ng-model="selectedProduct.id">
        
          <div class="form-group">
            <label for="editProductName">Product Name</label>
            <input type="text" class="form-control" id="editProductName" ng-model="selectedProduct.name" required>
          </div>
          <div class="form-row">
            <div class="form-group col-md-6">
              <label for="editCostPrice">Cost Price (₹)</label>
              <input type="number" step="0.01" class="form-control" id="editCostPrice" ng-model="selectedProduct.costPrice" required>
            </div>
            <div class="form-group col-md-6">
              <label for="editSellingPrice">Selling Price (₹)</label>
              <input type="number" step="0.01" class="form-control" id="editSellingPrice" ng-model="selectedProduct.sellingPrice" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-md-6">
              <label for="editCategory">${lblAllCategory}</label>
              <select id="editCategory" class="form-control" ng-model="selectedProduct.category" required>
                <option value="Snacks">${lblSnacks}</option>
                <option value="Beverages">${lblBeverages}</option>
                <option value="Dairy">${lblDairy}</option>
                <option value="Household">${lblHousehold}</option>
                <option value="Other">${lblOther} </option>
              </select>
            </div>
            <div class="form-group col-md-6">
              <label for="editStock">Stock Quantity</label>
              <input type="number" class="form-control" id="editStock" ng-model="selectedProduct.stock" required>
            </div>
          </div>
          <div class="form-group">
            <label for="editImageFile">Product Image (optional)</label>
            <input type="file" class="form-control-file" id="editImageFile" file-model="selectedProduct.imageFile">
          </div>
        </div>
        
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
          <button type="submit" class="btn btn-warning">Update Product</button>
        </div>
      </form>
    </div>
  </div>
</div>

<%@ include file="jslink.jsp" %>
</body>
</html>
