## Problem

	Personal Trainer requirements:

	Based on the notion of managing workouts and exercises, these are some of the requirements that our Personal Trainer app should fulfil including:

	The ability to list all available workouts.

    The ability to create and edit a workout. While creating and editing a workout, it should have:

        The ability to add workout attributes including name, title, description, and rest duration

        The ability to add/remove multiple exercises for workouts

        The ability to order exercises in the workout

        The ability to save workout data

    The ability to list all available exercises.

    The ability to create and edit an exercise. While creating and editing an exercise, it should have:

        The ability to add exercise attributes such as name, title, description, and procedure

        The ability to add pictures for the exercise

        The ability to add related videos for the exercise

        The ability to add audio clues for the exercise

## Solution

### Sharing the workout model

	To share these model classes, we are going to expose the model as an AngularJS service using the factory template. 	

	The new model definition for Exercise looks like this:

		angular.module('app').factory('Exercise', function () {
		    function Exercise(args) {
		        //Existing fields
		    }
		    return Exercise;
		});

	By doing return Exercise, we are actually returning a constructor function reference. Now we can inject the Exercise service anywhere and also use new Exercise({}) to create the model object.

### The Personal Trainer layout

	Top Nav: This contains the app branding title and history link.

    Sub Nav: This has navigation elements that change based on the active view (the view shown is ng-view).

    Left nav: This contains elements that are dependent upon the active view.

    Content Area: This is the main view. This is where most of the action happens. We will create/edit exercises and workouts and show a list of exercises and workouts here.

### The Personal Trainer navigation with routes

	The navigation pattern that we plan to use for the app is the list-detail pattern. We create list pages for exercises and workouts available in the app. Clicking on any list item takes us to the detail view for the item where we can perform all CRUD operations (create/read/update/delete). The following routes adhere to this pattern:

		#/builder
		#/builder/workouts
		#/builder/workouts/new
		#/builder/workouts/:id
		#/builder/exercises
		#/builder/exercises/new
		#/builder/exercises/:id
	

	Integrating left and top navigation:
	The basic idea around integrating left and top navigation into the app is to provide context-aware subviews that change based on the active view. 

		$routeProvider.when('/builder/workouts', {
		templateUrl: 'partials/workoutbuilder/workouts.html',
		controller: 'WorkoutListController',
		leftNav: 'partials/workoutbuilder/left-nav-main.html',
		topNav: 'partials/workoutbuilder/top-nav.html'
		});

	The value of the topNav property is used to load the top navigation view in the top-nav div element ("id = top-nav") using the ng-include directive. 

	With this configuration in place, we can associate different left and top navigation views with different pages.

	root.js

		$scope.$on('$routeChangeSuccess', function (e, current, previous) {
		  $scope.currentRoute = current;
		});

	http://localhost:8080/#/builder/workouts



