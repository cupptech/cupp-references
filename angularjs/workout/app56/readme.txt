## Problem
	
	Handling routing failure for rejected promises

## Solution

The resolve configuration has an additional advantage if any of the resolve functions return a promise like the selectedWorkout function:

	return WorkoutBuilderService.startBuilding($route.current.params.id);

When the promise is resolved successfully, the data is injected into the controller.

With a failed promise, two things happen:

	Firstly, the app route does not change. If you refresh the page using the browser, the complete content is cleared.

	Secondly, a $routeChangeError event is broadcasted on $rootScope

### Handling workouts not found

	We can an some error on the page if the user tries to navigate to a non-existing workout. The error has to be shown at the container level outside the ng-view directive.

	Update index.html and add this line before the ng-view declaration:

		<label ng-if="routeHasError" class="alert alert-danger">{{routeError}}</label>

	Open root.js and update the event handler for the $routeChangeSuccess event with the highlighted code:

		$scope.$on('$routeChangeSuccess', function (event, current,previous) {
		    $scope.currentRoute = current;
		    $scope.routeHasError = false;
		});


	Add another event handler for $routeChangeError:

		$scope.$on('$routeChangeError', function (event, current, previous, error) {
		    if (error.status === 404 
				&& current.originalPath === "/builder/workouts/:id") {
		              $scope.routeHasError = true;
		              $scope.routeError = current.routeErrorMessage;}
		});

	Lastly, update config.js by adding the routeErrorMessage property on the route configuration to edit workouts:

		$routeProvider.when('/builder/workouts/:id', {
		  // existing configuration
		  topNav: 'partials/workoutbuilder/top-nav.html',
		  routeErrorMessage:"Could not load the specific workout!",
		  //existing configuration

