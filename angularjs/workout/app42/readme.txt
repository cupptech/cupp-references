## Problem

Implementing the workout and exercise list

## Solution

### WorkoutService as a workout and exercise repository

Exercise-related CRUD operations: Get all exercises, get a specific exercise based on its name, create an exercise, update an exercise, and delete it.

Workout-related CRUD operations: These are similar to the exercise-related operations, but targeted toward the workout entity.

	angular.module('app')
	   .factory("WorkoutService", ['WorkoutPlan', 'Exercise', 
	     function (WorkoutPlan, Exercise) {
	       var service = {};
	       var workouts = [];
	       var exercises = [];
	       service.getExercises = function () {//implementation}
	       service.getWorkouts = function (){//implementation}
	       //Some initialization code to load existing data.
	       return service;
	    }]);

### Exercise and workout list controllers

workout.js

	This defines the WorkoutListController controller that loads workout data using WorkoutService. The $scope.goto function implements navigation to the workout detail page. This navigation happens when we double-click on an item in the workout list. The selected workout name is passed as part of the route/URL to the workout detail page.

exercises.js

	 ExerciseListController is used by the exercise list view.

	ExerciseNavController is there to support the left-nav-exercises.html view, and just loads the exercise data. If we look at the route definition, this view is loaded in the left navigation when we create/edit a workout.

### Exercise and workout list views

	Both the views use ng-repeat to list out the exercises and workouts. The ng-dblclick directive is used to navigate to the respective detail page by double-clicking on the list item.
