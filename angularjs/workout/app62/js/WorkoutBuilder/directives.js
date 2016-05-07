angular.module('WorkoutBuilder')
	.directive('workoutTile', function(){
		return {
			restrict: 'EA',
			templateUrl: '/partials/WorkoutBuilder/workout-tile.html'
		}
	});