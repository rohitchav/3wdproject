angular.module('debtsApp', [])
.controller('DebtsController', function($scope, $http) {

    $scope.customers = [];
    $scope.showModal = false;
    $scope.selectedCustomer = {};
    $scope.paidAmount = 0;

    $scope.loadDebts = function() {
        $http.get("DebtsServlet?action=getDebts")
            .then(function(response){
                $scope.customers = response.data;
            }, function(error){
                console.error("Error loading debts:", error);
            });
    };

    $scope.openPayForm = function(customer) {
        $scope.selectedCustomer = angular.copy(customer);
        $scope.paidAmount = 0;
        $scope.showModal = true;
    };

    $scope.closeModal = function() {
        $scope.showModal = false;
    };

    $scope.payDebt = function() {
        if ($scope.paidAmount <= 0) {
            alert("Enter a valid amount");
            return;
        }

        $http.post("DebtsServlet?action=payDebt&customerId=" 
                    + $scope.selectedCustomer.id 
                    + "&paidAmount=" + $scope.paidAmount)
        .then(function(response){
            if(response.data.status === "success") {
                alert("Payment successful!");
                $scope.showModal = false;
                $scope.loadDebts();
            } else {
                alert("Payment failed!");
            }
        }, function(error){
            console.error("Error paying debt:", error);
        });
    };

    $scope.loadDebts();
});
