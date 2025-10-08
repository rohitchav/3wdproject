var app = angular.module("BillingApp", []);

app.controller("BillingController", function($scope, $http) {

    $scope.products = [];
    $scope.cart = [];

    console.log("BillingController initialized");

    // Load product list
    $scope.loadProducts = function() {
        $http.get("ProductController?action=list")
            .then(function(response) {
                $scope.products = response.data;
                console.log($scope.products);
            })
            .catch(function(error) {
                console.error("Error loading products:", error);
            });
    };

    // ✅ Add product to cart
    $scope.addToCart = function(p) {
        // Check if product already in cart
        let existing = $scope.cart.find(item => item.name === p.name);
        if (existing) {
            existing.qty += 1;
        } else {
            $scope.cart.push({
                name: p.name,
                price: p.sellingPrice,
                image: p.imagePath,
                qty: 1
            });
        }
    };


    $scope.removeFromCart = function(item) {
        let index = $scope.cart.indexOf(item);
        if (index !== -1) {
            $scope.cart.splice(index, 1);
        }
    };

    // ✅ Increase quantity
    $scope.incrementQty = function(item) {
        item.qty += 1;
    };

    // ✅ Decrease quantity
    $scope.decrementQty = function(item) {
        if (item.qty > 1) {
            item.qty -= 1;
        }
    };

    // ✅ Calculate total
    $scope.getTotal = function() {
        return $scope.cart.reduce((total, item) => total + (item.price * item.qty), 0);
    };

    // ✅ Clear cart
    $scope.clearCart = function() {
        $scope.cart = [];
    };

    $scope.loadProducts();
});
