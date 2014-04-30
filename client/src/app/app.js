angular.module('tydlyn', [	'ngRoute',
							'tydlyn.templates',
							'tydlyn.dashboard',
							'tydlyn.openings',
							'tydlyn.candidates',
							'tydlyn.calendar']);
angular.module('tydlyn').config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
	$locationProvider.html5Mode(true);
	$routeProvider.otherwise({redirectTo:'/dashboard'});
}]);
angular.module('tydlyn').run();
angular.module('tydlyn').controller('AppCtrl', ['$scope', function($scope){

}])