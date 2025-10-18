angular.module('debtsApp', [])
.controller('DebtsController', function($scope, $http) {

    $scope.customers = [];
    $scope.showModal = false;
    $scope.viewBill = false;
    $scope.selectedCustomer = {};
    $scope.paidAmount = 0;
    $scope.billItems = [];
    $scope.billCustomer = {};
    $scope.billTotal = 0;
    $scope.billDate = new Date().toLocaleDateString();

    // Load Debtors
    $scope.loadDebts = function() {
        $http.get("DebtsServlet?action=getDebts")
            .then(function(response){
                $scope.customers = response.data;
            }, function(error){
                console.error("Error loading debts:", error);
            });
    };

    // Open Pay Modal
    $scope.openPayForm = function(customer) {
        $scope.selectedCustomer = angular.copy(customer);
        $scope.paidAmount = 0;
        $scope.showModal = true;
        $scope.viewBill = false;
    };

    // Close Payment Modal
    $scope.closeModal = function() {
        $scope.showModal = false;
    };

    // Pay Debt
    $scope.payDebt = function() {
        $http.post("DebtsServlet?action=payDebt&customerId=" 
                    + $scope.selectedCustomer.id 
                    + "&paidAmount=" + $scope.paidAmount)
        .then(function(response){
            if(response.data) {
                $scope.showModal = false;
                $scope.loadDebts();
            } else {
                alert("Payment failed!");
            }
        }, function(error){
            console.error("Error paying debt:", error);
        });
    };

    // ✅ View Customer Bill
    $scope.viewModal = function(customer) {
        $scope.showModal = false;
        $scope.viewBill = true;
        $scope.billCustomer = customer;

		$http.get("DebtsServlet?action=getCustomerBill&customerId=" + customer.id)
		    .then(function(response) {
		        // response.data is already the list of bill items
		        $scope.billItems = response.data;

		        // ✅ Print each item on console
		        console.log("Customer Bill Items:");
		        angular.forEach($scope.billItems, function(item, index) {
		            console.log(
		                "Item " + (index + 1) + ":",
		                "Product =", item.product_name,
		                "| Quantity =", item.qty,
		                "| Price =", item.price
		            );
		        });

		        // Optional: calculate total
		        $scope.billTotal = $scope.billItems.reduce(function(sum, item) {
		            return sum + (item.qty * item.price);
		        }, 0);

		        console.log("Total Bill Amount:", $scope.billTotal);
		    }, function(error) {
		        console.error("Error loading bill:", error);
		    });

    };

    // ✅ Close Bill View
    $scope.closeBillView = function() {
        $scope.viewBill = false;
        $scope.showModal = true;
    };

    // Optional features
    $scope.printBill = function() {
        window.print();
    };

    $scope.saveBill = function() {
        alert("Bill saved successfully!");
    };

    // Initial Load
    $scope.loadDebts();
});