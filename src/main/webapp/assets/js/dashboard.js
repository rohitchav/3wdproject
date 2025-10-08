/**
 * 
 */
angular.module('dashboardApp', [])
.controller('DashboardController', function($scope, $http) {
    $scope.stats = {};

    // Fetch dashboard statistics from servlet
    $http.get("DashboardServlet?action=stats").then(function(response) {
        $scope.stats = response.data;
    });
});

angular.module('dashboardApp', [])
.controller('DashboardController', function($scope, $http) {
    $scope.stats = {};
    $scope.filter = 'today'; // Default filter

    $scope.loadStats = function(range) {
        $scope.filter = range;

        $http.get("DashboardServlet?action=stats&range=" + range)
        .then(function(response) {
            $scope.stats = response.data;
        }, function(error) {
            console.error("Error loading dashboard stats:", error);
        });
    };

    // Load default stats
    $scope.loadStats('today');
});


angular.module('dashboardApp', [])
.controller('DashboardController', function($scope, $http) {
    $scope.filter = 'today';
    $scope.stats = { totalSales: 0, transactions: 0, itemsSold: 0, avgBill: 0 };

    $scope.loadStats = function(period) {
        $scope.filter = period;
        $http.get("DashboardServlet?action=getStats&period=" + period)
        .then(function(response) {
            $scope.stats = response.data;
        });
    };

    // Load today's stats initially
    $scope.loadStats('today');
});



angular.module('dashboardApp', [])
.controller('DashboardController', function($scope, $http) {
    $scope.filter = 'today';
    $scope.stats = {
        totalSales: 0, transactions: 0, itemsSold: 0, avgBill: 0,
        totalRevenue: 0, cogs: 0, grossProfit: 0, totalExpenses: 0, netLoss: 0
    };

    $scope.loadStats = function(period) {
        $scope.filter = period;
        $http.get("DashboardServlet?action=getStats&period=" + period)
        .then(function(response) {
            $scope.stats = response.data;
        }, function(error) {
            console.error("Error loading stats:", error);
        });
    };

    $scope.loadStats('today');
});


