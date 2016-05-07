## Problem
	
	Performing CRUD on exercises/workouts


## Solution

	When it comes to the create, read, update, and delete (CRUD) operations, all save, update, and delete functions need to be converted to the callback promise pattern.

	Before we start the implementation, it is important to understand how MongoLab identified a collection item and what our ID generation strategy is . Each collection item in MongoDB is uniquely identified in the collection using the _id property. While creating a new item, either we supply an ID or the server generates one itself. Once _id is set, it cannot be changed. For our model, we will use the name property of the exercise/workout as the unique ID and copy the name into the _id field (hence, there is no autogeneration of _id). Also, remember our model classes do not contain this _id field, it has to be created before saving the record for the first time.

### Fixing and creating a new workout

	WorkoutService:

		service.addWorkout = function (workout) {
		  if (workout.name) {
		    var workoutToSave = angular.copy(workout);
		    workoutToSave.exercises = 
		    workoutToSave.exercises.map(function (exercise) {
		         return {
		                name: exercise.details.name,
		                duration: exercise.duration
		         }
		      });
		    workoutToSave._id = workoutToSave.name;
		    return $http.post(collectionsUrl + "/workouts", workoutToSave,
		 		{ params: { apiKey: apiKey }})
		    	.then(function (response) { return workout });
		}}

	The updateWorkout function can be fixed in the same manner, the only difference being that the $http.put function is required:

		return $http.put(collectionsUrl + "/workouts/" + workout.name, workoutToSave, { params: { apiKey: apiKey } });

	The preceding request URL now contains an extra fragment (workout.name) that denotes the identifier of the collection item that needs to be updated.

	The last operation that needs to be fixed is deleting the workout.

		service.deleteWorkout = function (workoutName) {
		    return $http.delete(collectionsUrl + "/workouts/" + 
		    workoutName, { params: { apiKey: apiKey } });
		};

	The save function of WorkoutBuilderService now looks like this:

		service.save = function () {
		    var promise = newWorkout ? WorkoutService.addWorkout(buildingWorkout) : WorkoutService.updateWorkout(buildingWorkout);
		    promise.then(function (workout) {
		        newWorkout = false;
		    });
		    return promise;
		};

	Finally, WorkoutDetailController also needs to use the same callback pattern for handling save and delete, as shown here:

		$scope.save = function () {
		    $scope.submitted = true; // Will force validations
		    if ($scope.formWorkout.$invalid) return;
		    WorkoutBuilderService.save().then(function (workout) {
		        $scope.workout = workout;
		        $scope.formWorkout.$setPristine();
		        $scope.submitted = false;
		    });
		}
		service.delete = function () {
		   if (newWorkout) return; // A new workout cannot be deleted.
		   return WorkoutService.deleteWorkout(buildingWorkout.name);
		}


	
