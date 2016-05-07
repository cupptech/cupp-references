## Problem

	Building a workout.

## Solution

	The page has a left navigation that lists out all the exercises that can be added to the workout. Clicking on the arrow icon on the right adds the exercise to the end of the workout.

	The center area is designated for workout building. It consists of exercise tiles laid out in order from top to bottom and a form that allows the user to provide other details about the workout such as name, title, description, and rest duration.

	This page operates in two modes:

	Create/New: This mode is used for creating a new workout. The URL is #/builder/workouts/new.

    Edit: This mode is used for editing the existing workout. The URL is #/builder/workouts/:id, where :id maps to the name of the workout.

### Building left nav

	left-nav-exercises.html

		<div id="left-nav-exercises" ng-controller="ExercisesNavController">
		    <h4>Exercises</h4>
		    <div ng-repeat="exercise in exercises|orderBy:'title'" class="row">
		        <button class="btn btn-info col-sm-12" ng-click="addExercise(exercise)">{{exercise.title}}<span class="glyphicon glyphicon-chevron-right"></span></button>
		    </div>
		</div>	

### Adding the WorkoutBuilderService service

	WorkoutBuilderService tracks the state of the workout being worked on. It:

	- Tracks the current workout
    - Creates a new workout
    - Loads the existing workout
    - Saves the workout	

### Adding exercises using exercise nav

	To add exercises to the workout we are building, we just need to inject the dependency of WorkoutBuilderService into the ExercisesNavController and call the service method addExercise:

	$scope.addExercise = function (exercise) {
	    WorkoutBuilderService.addExercise(exercise);
	}

	ExerciseNavController does not update the workout data directly; in fact it does not have direct access to the workout being built. Instead, it relies upon the service method addExercise to change the current workout's exercise list.

### Implementing WorkoutDetailController

	WorkoutDetailController is responsible for managing a workout. This includes creating, editing, and viewing the workout. Due to the introduction of WorkoutBuilderService, the overall complexity of this controller has reduced. Other than the primary responsibility of integrating with the view, WorkoutDetailController will delegate most of the other work to WorkoutBuilderService.

	WorkoutDetailController is associated with two routes/views namely /builder/workouts/new and /builder/workouts/:id. This handles both creating and editing workout scenarios. The first job of the controller is to load or create the workout that it needs to manipulate. We plan to use Angular's routing framework to pass this data to WorkoutDetailController.

		$routeProvider.when('/builder/workouts/new', {
		    <!—existing route data-->
		    controller: 'WorkoutDetailController',
		    resolve: {
		        selectedWorkout: ['WorkoutBuilderService', function (WorkoutBuilderService) {
		            return WorkoutBuilderService.startBuilding();
		        }],
		    }});
		$routeProvider.when('/builder/workouts/:id', {;
		    <!—existing route data-->
		    controller: 'WorkoutDetailController',
		    resolve: {
		      selectedWorkout: ['WorkoutBuilderService', '$route', function (WorkoutBuilderService, $route) {
		      return WorkoutBuilderService.startBuilding($route.current.params.id);
		        }],
		    }});

	The resolve property is part of the route configuration object, and provides a mechanism to pass data and/or services to a specific controller. The resolve object property can be one of the following:

	     A string constant: The string name should be an AngularJS service. This is not very useful or often used as AngularJS already provides the ability to inject a service into the controller.

    	A function: In this case, the return value of the function can be injected into the controller with the property name. If the function returns a promise, the route is not resolved and the view is not loaded till the promise itself is resolved. Once the promise is resolved, the resolved value is injected into the controller. If the promise fails, the $routeChangeError event is raised on $rootScope and the route does not change.

    	The previous $route.current property contains useful details about the current route. The params object contains values for all placeholder tokens that are part of the route. Our edit route (/builder/workouts/:id) has only one token ID, hence params.id will point to the value of the last fragment of the workout edit route.

		These tokens are also available through an Angular service $routeParams. We did not use startBuilding($routeParams.id) here, as this service is not read during the resolve function call.

	Resolving routes not found, If a workout with a given name is not found, we can redirect the user back to the workout list page.

		$routeProvider.when('/builder/workouts/:id', {
		    //existing code
		    resolve: {
		      selectedWorkout: ['WorkoutBuilderService', '$route', '$location', function (WorkoutBuilderService, $route, $location) {
		var workout = 
		WorkoutBuilderService.startBuilding($route.current.params.id);
		            if (!workout) {
		                $location.path('/builder/workouts');
		            }
		            return workout;
		        }],
		    }	

### Implementing the workout builder view

	/partials/workoutbuilder/workout.html


