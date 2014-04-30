angular.module('tydlyn.calendar', []);
angular.module('tydlyn.calendar').config(['$routeProvider', function ($routeProvider) {
	$routeProvider.when('/calendar', {
		templateUrl: 'calendar/calendar.tpl.html',
		controller: 'CalendarCtrl'
	})
}]);
angular.module('tydlyn.calendar').controller('CalendarCtrl', function() {

});