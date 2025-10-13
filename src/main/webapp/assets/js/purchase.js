/**
 * 
 */
angular.module('purchaseApp', [])
.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function() {
                scope.$apply(function() {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}])
.controller('PurchaseController', function($scope, $http) {
    $scope.showModal = false;
    $scope.purchases = [];

    $scope.loadPurchases = function() {
        $http.get("PurchaseServlet?action=list").then(function(response) {
            $scope.purchases = response.data;
        });
    };

    $scope.openModal = function() {
        $scope.newPurchase = {};
        $scope.showModal = true;
    };

	$scope.closeModal = function() {
	    $scope.newPurchase = {}; // clear model
	    document.querySelector('input[type="file"]').value = null; // reset file input
	    $scope.showModal = false;
	};


    $scope.submitPurchase = function() {
        var fd = new FormData();
        fd.append("supplier", $scope.newPurchase.supplier);
        fd.append("amount", $scope.newPurchase.amount);
        fd.append("billFile", $scope.newPurchase.billFile);

        $http.post("PurchaseServlet", fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).then(function(response) {
            $scope.loadPurchases();
            $scope.closeModal();
        });
    };

    $scope.viewBill = function(path) {
        window.open(path, '_blank');
    };

	$scope.deletePurchase = function(id) {
	    if (!confirm("Are you sure you want to delete this purchase?")) return;

	    $http({
	        method: 'POST',
	        url: 'PurchaseServlet',
	        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
	        data: 'action=delete&id=' + id
	    }).then(function(response){
	        if(response.data){
	            $scope.purchases = $scope.purchases.filter(p => p.id !== id);
	        } else {
	            alert("Failed to delete purchase.");
	        }
	    }, function(error){
	        console.error(error);
	        alert("Error deleting purchase.");
	    });
	};

    $scope.loadPurchases();
});