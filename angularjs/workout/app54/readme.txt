## Problem
	
	Using $resource to access exercise data

## Solution

	WorkoutService:

	service.Exercises = $resource(collectionsUrl + "/exercises/:id", { apiKey: apiKey}, { update: { method: 'PUT' } });

	The statement creates a Resource class configured with a specific URL and API key. The key is passed in to the default parameter collection.

	The $resource function is part of the ngResource module; therefore, we need to include the module script in index.html. 

		angular.module('app', […,'ngResource']);

	service.getWorkout:

		service.Exercises.query().$promise

		The query action returns an empty array that has a predefined $promise property that $q.all can wait over.

	ExerciseNavController / ExerciseListController:

		$scope.exercises = WorkoutService.Exercises.query();

		The empty array returned by the query action in the preceding code is filled in the future when the response is available. Once the model exercises updates, the bound view is automatically updated. No callback is required!

	ExerciseBuilderService:

		service.startBuilding = function (name) {
		  if (name) {
		    buildingExercise = WorkoutService.Exercises.get({ id: name },
				function (data) {
		            newExercise = false;
		        });
		  }
		  else {
		     buildingExercise = new Exercise({});
		     newExercise = true;
		  }
		  return buildingExercise;
		};		

		Before we turn the newExercise flag to false we need to wait for the response. We make use of the success callback for that. Interestingly, the data argument to a function and the buildingExercise variable point to the same resource object.

	ExerciseDetailController

		$scope.exercise = ExerciseBuilderService.startBuilding($routeParams.id);

### The hidden cost of hiding asynchronicity

	$scope.exercises = WorkoutService.Exercises.query();
	console.log($scope.exercises.length);

	We may think console.log prints the length of the exercises array, but that is absolutely incorrect. In fact, $scope.exercises is an empty array so log will always show 0. The array is filled in the future with the data returned from the server.

### Exercising CRUD with $resource
	
	ExerciseBuilderService: 

		service.save = function () {
		    if (!buildingExercise._id)
		    buildingExercise._id = buildingExercise.name;
		    var promise = newExercise ?
		       WorkoutService.Exercises.save({},buildingExercise).$promise
		      : buildingExercise.$update({ id: buildingExercise.name });
		    return promise.then(function (data) {
		        newExercise = false;
		        return buildingExercise;
		});
		};

		In the previous implementation based on the newExercise state, we call the appropriate resource action. We then pull out the underlying promise and again perform promise chaining to return the same exercise in future using then.

		A resource object is typically created when we invoke get operations on the corresponding Resource class, such as this:

			buildingExercise = WorkoutService.Exercises.get({ id: name });

		This operation creates an exercise resource object. And the following operation creates an array:

			$scope.exercises = WorkoutService.Exercises.query();

		The array is filled with exercise resource objects when the response is received.

		The actions defined on a resource object are the same as the Resource class except that all action names are prefixed with $. Also, resource object actions can derive data from the resource object itself. For example, in the preceding code, buildingExercise.$update does not take the payload as an argument whereas the payload is required when using the Exercise.save action

		Deleting is simple; we just call the $delete action on the resource object and return the underlying promise:

			service.delete = function () {
			   return buildingExercise.$delete({ id: buildingExercise.name });
			};


