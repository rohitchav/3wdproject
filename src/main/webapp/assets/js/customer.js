angular.module('customerApp', [])
  .controller('CustomerController', function($scope, $http) {
	
	$scope.customers = [];
	    $scope.searchQuery = "";

	    // Initial fetch of all customers
	    $scope.fetchCustomers = function() {
	        $http.get('CustomerServlet').then(function(response){
	            $scope.customers = response.data;
	        });
	    };

		$scope.searchCustomers = function() {
		    $http.get('CustomerServlet?action=search&query=' + $scope.searchQuery)
		        .then(function(response){
		            $scope.customers = response.data;
		        });
		};


	
	$scope.loadCustomers = function() {
	       $http.get('CustomerServlet?action=getAll')
	           .then(function(response) {
	               $scope.customers = response.data;
	           }, function(error) {
	               console.error('Error fetching customers', error);
	           });
	   }


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
      $http.post('CustomerServlet?action=add', $scope.newCustomer)
        .then(function(response) {
          console.log("Response:", response.data);
          alert("Customer added successfully!");
          $scope.closeModal();
		  $scope.loadCustomers();
        }, function(error) {
          console.error("Error:", error);
          alert("Error while adding customer.");
        });
		
		
    };
	
	$scope.deleteCustomer = function(id) {
	  if (confirm("Are you sure you want to delete this customer?")) {
	    $http.post('CustomerServlet?action=delete&id=' + id)
	      .then(function(response) {
	        if (response.data.status === "success") {
	          alert("Customer deleted successfully!");
	          $scope.loadCustomers();
	        } else {
	          alert("Failed to delete customer.");
	        }
	      }, function(error) {
	        console.error("Error deleting customer:", error);
	        alert("Error while deleting customer.");
	      });
	  }
	};

	
	$scope.loadCustomers();
  });
