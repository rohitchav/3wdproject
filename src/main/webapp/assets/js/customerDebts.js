angular.module('debtsApp', [])
.controller('DebtsController', function($scope, $http) {
    $scope.customers = [];

    // Load all customer debts initially
    $http.get("DebtsServlet?action=getDebts&range=all")
    .then(function(response) {
        $scope.customers = response.data;
    }, function(error) {
        console.error("Error loading debts:", error);
    });

    // Optional: delete customer
    $scope.deleteCustomer = function(id) {
        if(confirm("Are you sure you want to delete this customer?")) {
            $http.post("DebtsServlet?action=deleteCustomer&id=" + id)
            .then(function(response){
                // Reload debts after deletion
                $http.get("DebtsServlet?action=getDebts&range=all")
                .then(function(resp){ $scope.customers = resp.data; });
            }, function(error){
                console.error("Error deleting customer:", error);
            });
        }
    };
});
