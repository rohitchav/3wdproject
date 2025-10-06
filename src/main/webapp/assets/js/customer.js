/**
 * 
 */
angular.module('customerApp', [])
  .controller('CustomerController', function($scope) {
    console.log("Hello");  // Make sure this logs
    $scope.showModal = false;

    $scope.newCustomer = {};

    $scope.openModal = function () {
      $scope.newCustomer = {};
      $scope.showModal = true;
    };

    $scope.closeModal = function () {
      $scope.showModal = false;
    };

    $scope.addCustomer = function () {
      console.log("Customer Added:", $scope.newCustomer);
      $scope.closeModal();
    };
  });
