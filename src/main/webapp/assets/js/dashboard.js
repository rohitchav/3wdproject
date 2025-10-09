/**
 * Dashboard Module - Kirana POS
 * Fetches live stats from DashBoardSevlet and updates dashboard cards
 */
var app = angular.module('dashboardApp', []);

app.controller('DashboardController', function($scope, $http) {

    // 🔹 Default values to prevent blank screen before data loads
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

    // 🔹 Load statistics based on selected time period
    $scope.loadStats = function(period) {
        $scope.filter = period;

        // AJAX call to Dashboard servlet
        $http.get("DashBoardSevlet?action=getStats&period=" + period)
            .then(function(response) {
                console.log("✅ Dashboard data fetched:", response.data);
                $scope.stats = response.data; // Bind JSON to scope
            })
            .catch(function(error) {
                console.error("❌ Error fetching dashboard stats:", error);
                alert("Unable to load dashboard data. Check console for details.");
            });
    };

    // 🔹 Initialize with today's stats
    $scope.loadStats('today');
});
