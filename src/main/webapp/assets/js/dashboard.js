var app = angular.module('dashboardApp', []);

app.controller('DashboardController', function($scope, $http) {

    $scope.filter = 'today';
    $scope.stats = {
        totalSales: 0,
        transactions: 0,
        itemsSold: 0,
        avgBill: 0,
        totalRevenue: 0,
        cogs: 0,
        grossProfit: 0,
        totalExpenses: 0,
        netLoss: 0
    };

    $scope.loadStats = function(period) {
        $scope.filter = period;

        $http.get("DashboardServlet?action=getStats&period=" + period)
            .then(function(response) {
                $scope.stats = response.data;
            })
            .catch(function(error) {
                console.error("Error fetching dashboard stats:", error);
            });
    };

    // Load today's stats on page load
    $scope.loadStats('today');
});
