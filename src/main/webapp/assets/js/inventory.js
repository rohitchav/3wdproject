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
        let fd = new FormData(document.getElementById("addProductForm"));
        $http.post("ProductController?action=add", fd, {
            headers: {'Content-Type': undefined}
        }).then(function(response) {
            if (response.data.success) {
                $scope.loadProducts();
                $("#addProductModal").modal("hide");
				alert( "Product added successfully");
            } else {
                alert("Failed to add product");
            }
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
     
	


});