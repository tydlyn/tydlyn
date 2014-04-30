angular.module('tydlyn.candidates', []);
angular.module('tydlyn.candidates').config(['$routeProvider', function ($routeProvider) {
	$routeProvider.when('/candidates', {
		templateUrl: 'candidates/candidates.tpl.html',
		controller: 'CandidatesCtrl'
	})
}]);
angular.module('tydlyn.candidates').controller('CandidatesCtrl', function() {

});