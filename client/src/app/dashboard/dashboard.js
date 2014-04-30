angular.module('tydlyn.dashboard', []);
angular.module('tydlyn.dashboard').config(['$routeProvider', function ($routeProvider) {
	$routeProvider.when('/dashboard', {
		templateUrl: 'dashboard/dashboard.tpl.html',
		controller: 'DashboardCtrl'
	})
}]);
angular.module('tydlyn.dashboard').controller('DashboardCtrl', function() {

});