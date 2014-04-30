angular.module('tydlyn.openings', []);
angular.module('tydlyn.openings').config(['$routeProvider', function ($routeProvider) {
	$routeProvider.when('/openings', {
		templateUrl: 'openings/openings.tpl.html',
		controller: 'OpeningsCtrl'
	})
}]);
angular.module('tydlyn.openings').controller('OpeningsCtrl', function() {

});