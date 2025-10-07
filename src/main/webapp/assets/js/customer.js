angular.module('customerApp', [])
  .controller('CustomerController', function($scope, $http) {  // ✅ inject $http
    console.log("Hello");  // Make sure this logs

    $scope.showModal = false;
    $scope.newCustomer = {};

    $scope.openModal = function() {
      $scope.newCustomer = {};
      $scope.showModal = true;
    };

    $scope.closeModal = function() {
      $scope.showModal = false;
    };

    $scope.addCustomer = function() {
      console.log("Customer Added:", $scope.newCustomer);

      // ✅ Use $http to send POST request to servlet
      $http.post('CustomerServlet', $scope.newCustomer)
        .then(function(response) {
          console.log("Response:", response.data);
          alert("Customer added successfully!");
          $scope.closeModal();
        }, function(error) {
          console.error("Error:", error);
          alert("Error while adding customer.");
        });
    };
  });
