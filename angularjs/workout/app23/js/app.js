'use strict';

angular.module('app', ['ngRoute', 'workout'])
.config(function($routeProvider){
	$routeProvider.when('/start', { templateUrl: 'partials/start.html'});
	$routeProvider.when('/workout', { templateUrl: 'partials/workout.html', controller: 'WorkoutController'});
	$routeProvider.when('/finish', { templateUrl: 'partials/finish.html'});
	$routeProvider.otherwise({'redirectTo': '/start'});
});

angular.module('workout', []);
