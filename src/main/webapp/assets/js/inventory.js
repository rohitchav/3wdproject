/**
 * 
 */


document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('productImageFile');
    const imagePathHidden = document.getElementById('imagePathHidden');

    if(fileInput) {
        fileInput.addEventListener('change', function(e) {
            const fileName = e.target.files.length > 0 ? e.target.files[0].name : 'Choose file';
            const label = document.querySelector('label[for="productImageFile"]');
            if(label) label.innerText = fileName;

            if(imagePathHidden && e.target.files.length > 0){
                imagePathHidden.value = "images/" + fileName; // server should handle actual path
            }
        });
    }
});



var app = angular.module("inventoryApp", []);

app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function() {
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);


app.controller("InventoryController", function($scope, $http) {
    $scope.products = [];
	console.log("InventoryController initialized")
    // Load products
    $scope.loadProducts = function() {
        $http.get("ProductController?action=list").then(function(response) {
			
            $scope.products = response.data;
        });
    };


	
	// Add product
	$scope.addProduct = function() {
	    let form = document.getElementById("addProductForm");
	    let fd = new FormData(form);

	    $http.post("ProductController?action=add", fd, {
	        headers: { 'Content-Type': undefined }
	    }).then(function(response) {
	        if (response.data.success) {
	            // ✅ Reload product list dynamically
	            $scope.loadProducts();

	            // ✅ Hide the modal
	            $("#addProductModal").modal("hide");

	            // ✅ Show confirmation
	            alert("Product added successfully");

	            // ✅ Reset the form fields
	            form.reset();

	            // ✅ Clear file label text (if file upload field exists)
	            const label = document.querySelector('label[for="productImageFile"]');
	            if (label) label.innerText = "Choose file";

	            // ✅ Reset hidden image path if used
	            const imagePathHidden = document.getElementById('imagePathHidden');
	            if (imagePathHidden) imagePathHidden.value = '';

	            // ✅ Also reset AngularJS model (if any)
	            $scope.product = {};
	        } else {
	            alert("Failed to add product");
	        }
	    }).catch(function(error) {
	        console.error("Error adding product:", error);
	    });
	};



	$scope.openEditModal = function(product) {
	    $scope.$applyAsync(function() {
	        $scope.selectedProduct = product;
	    });
	    $("#editProductModal").modal("show");
	};


	// Save changes (update)
	// Save changes (update)
	$scope.updateProduct = function(product) {
		console.log(product.id)
	    var formData = new FormData();
	    formData.append("action", "update");
	   
		formData.append("id", product.id || 0);
	    formData.append("name", product.name);
	    formData.append("costPrice", product.costPrice);
	    formData.append("price", product.sellingPrice); // Mapped to 'price' in ProductController
	    formData.append("category", product.category);
	    formData.append("stock", product.stock);

	    if (product.imageFile) {
	        formData.append("imageFile", product.imageFile);
	    }

	    $http.post('ProductController', formData, {
	        transformRequest: angular.identity,
	        headers: { 'Content-Type': undefined }
	    }).then(function(response) {
	        if (response.data.success) {
	            alert(response.data.message);
	            $("#editProductModal").modal("hide");
	            $scope.loadProducts();
	        } else {
	            alert(response.data.message);
	        }
	    });
	};
	
	$scope.deleteProduct = function(id) {
	    if (confirm("Are you sure you want to delete this product?")) {
	        let fd = new FormData();
	        fd.append("action", "delete");
	        fd.append("id", id);

	        $http.post("ProductController", fd, {
	            transformRequest: angular.identity,
	            headers: {'Content-Type': undefined}
	        }).then(function(response) {
	            if (response.data.success) {
	                alert(response.data.message);
	                $scope.loadProducts(); // refresh the product table
	            } else {
	                alert(response.data.message);
	            }
	        });
	    }
	};
	
    $scope.deleteAllProduct = function(){
		if(confirm("Are You Sure To Delete All Products ?"))
			{
				let fd = new FormData();
				fd.append("action","deleteAll");
				
				
				$http.post("ProductController", fd, {
				            transformRequest: angular.identity,
				            headers: {'Content-Type': undefined}
				        }).then(function(response) {
				            if (response.data.success) {
				                alert(response.data.message);
				                $scope.loadProducts(); // refresh the product table
				            } else {
				                alert(response.data.message);
				            }
				        });
				
			}
	}
	



	    $scope.downloadLowStockReport = function() {
	        $http.get("ProductController?action=lowStock").then(function(response) {
	            let products = response.data;

	            if (!products || products.length === 0) {
	                alert("No products with low stock.");
	                return;
	            }

	            let reportHtml = `
	                <html>
	                <head>
	                    <title>Low Stock Report</title>
	                    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
	                    <style>
	                        body { font-size: 1.2em; }
	                        table { pointer-events: none; }
	                        th, td { text-align: center; }
	                    </style>
	                </head>
	                <body>
	                    <div class="container mt-4">
	                        <h2 style="text-align:center">Kirana Store</h2>
	                        <h3>Low Stock Report</h3>
	                        <table class="table table-bordered table-striped mt-3">
	                            <thead>
	                                <tr>
	                                    <th>Product Name</th>
	                                    <th>Category</th>
	                                    <th>Cost Price</th>
	                                    <th>Selling Price</th>
	                                    <th>Stock</th>
	                                </tr>
	                            </thead>
	                            <tbody>
	                                ${products.map(p => `
	                                    <tr>
	                                        <td>${p.name}</td>
	                                        <td>${p.category}</td>
	                                        <td>₹ ${p.costPrice}</td>
	                                        <td>₹ ${p.sellingPrice}</td>
	                                        <td>${p.stock}</td>
	                                    </tr>
	                                `).join('')}
	                            </tbody>
	                        </table>
	                    </div>
	                </body>
	                </html>
	            `;

				let printWindow = window.open('', '', 'height=1000,width=1200'); // optional
				if (printWindow) {
				    printWindow.document.write(reportHtml);
				    printWindow.document.close();

				    // ensure print styles are applied before printing
				    printWindow.focus();
				    printWindow.print();
				    printWindow.close();
				}
	        }, function() {
	            alert("Failed to fetch low stock products.");
	        });
	    };





});