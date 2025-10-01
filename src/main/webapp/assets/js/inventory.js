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

app.controller("InventoryController", function($scope, $http) {
    $scope.products = [];

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

    // Delete product
    $scope.deleteProduct = function(id) {
        if(confirm("Are you sure?")) {
            $http.post("ProductController?action=delete&id=" + id).then(function(resp) {
                $scope.loadProducts();
            });
        }
    };
});