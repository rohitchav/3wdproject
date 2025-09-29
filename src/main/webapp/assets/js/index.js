var app = angular.module("loginApp", []);

app.controller("LoginController", function($scope, $http, $window) {
    $scope.user = {};
    $scope.errorMessage = "";

    $scope.submitLogin = function() {
        // Convert JSON to form-urlencoded manually
        var data = "username=" + encodeURIComponent($scope.user.username) +
                   "&password=" + encodeURIComponent($scope.user.password);

				   $http({
				       method: "POST",
				       url: "login",
				       data: data,
				       headers: { "Content-Type": "application/x-www-form-urlencoded" }
				   }).then(function success(response) {
				       if (response.data.status === "success") {
				           $window.location.href = "HomeServlet";   // go to homepage
				       } else {
				           $scope.errorMessage = response.data.message;
				       }
				   }, function error() {
				       $scope.errorMessage = "Server error! Please try again.";
				   });

    };
});