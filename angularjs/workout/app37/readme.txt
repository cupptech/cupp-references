## Problem

	Enriching history tracking with AngularJS eventing
	Persisting workout history in browser storage
	Filtering workout history.

## Solution

### AngularJS eventing

	Events are implementation of the observer design pattern. 
	This eventing infrastructure is completely built over the scope object. 

	- $scope.$emit(eventName, args)			// $emit is what goes up
    - $scope.$broadcast(eventName, args)	// $broadcast is what propagates down
    - $scope.$on(eventName, listener(e, args)) 

### Enriching history tracking with AngularJS eventing

	Open workout.js and inside the startExercise function:

		if (exercisePlan.details.name != 'rest') {
		  $scope.currentExerciseIndex++;
		  $scope.$emit("event:workout:exerciseStarted", exercisePlan.details);
		}

	In services.js:

		$rootScope.$on("event:workout:exerciseStarted", function (e, args) {
		currentWorkoutLog.lastExercise = args.title;
		   ++currentWorkoutLog.exercisesDone;
		});	

	Use value services:

		angular.module('workout').value("appEvents", {
		   workout: { exerciseStarted: "event:workout:exerciseStarted" }
		});

		$scope.$emit(appEvents.workout.exerciseStarted, exercisePlan.details); // in WorkoutController

		$rootScope.$on(appEvents.workout.exerciseStarted, function (e, args) {// in workoutHistoryTracker service


	The value service appEvents acts as a single source of reference for all events published and subscribed throughout the app.

### Persisting workout history in browser storage

	AngularJS-local-storage (https://github.com/grevory/angular-local-storage). This is a simple module that has a service wrapper over the browser local storage API.

		workoutHistory = localStorageService.get(storageKey) || []
		localStorageService.add(storageKey, workoutHistory);

### Filtering workout history.

	<tr ng-repeat="historyItem in history | filter:search | orderBy:'-startedOn'">

	The filter object of AngularJS filters:

	{{ filter_expression | filter : expression : comparator}}

	The filter object can take three types of expressions (the first filter parameter expression), as follows:

	    Strings: The array searches for this string value. If it is an array of objects, each property in the array that is of the string type is searched. If we prefix it with ! (!string) then the condition is reversed.

	    Objects: This syntax is used for more advanced searches. In the preceding ng-repeat, we use object search syntax. The value of our search object is {completed:''}, {completed:true}, or {completed:false} based on the radio options selected. When we apply this search expression to the filter, it tries to find all the objects in the history where historyItem.completed = search.completed.

	    Using the object notation, we restrict our search to specific properties on the target array elements, unlike the string expression that only cares about the property value and not the name of the property.

	    We can search based on multiple properties too. For example, a search expression such as {completed:true, lastExercise:"Plank"}, will filter all exercises that were completed where the last exercise was Plank. Remember that in a multi-condition filter, every condition must be satisfied for an item to be filtered.

	    function(value): We can pass a predicate function, which is called for each array element and the element is passed in as value parameter. If the function returns true, it's a match else a mismatch.

	The comparator parameter defined in the previous filter syntax is used to control how comparison is done for a search.

	The AngularJS orderBy filter:

		The orderBy filter is used to sort the array elements before they are rendered in the view. Remember, the order in the original array remains intact.

		{{ orderBy_expression | orderBy : expression : reverse}}

	Special ng-repeat properties:

	The ng-repeat directive adds some special properties on the scope object of current iteration. 

		$index: This has the current iteration index (zero based)

	    $first: This is true if it is the first iteration

	    $middle: This is true if it is neither the first nor last iteration

	    $last: This is true if it is the last iteration

	    $even: This is true for even iterations

	    $odd: This is true for odd iterations

	    ng-class="{'even-class':$even, 'odd-class':$odd}"

