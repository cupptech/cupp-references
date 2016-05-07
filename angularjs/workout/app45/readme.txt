## Problem

	custom validation

## Solution

Custom validation for an exercise count:

	<span name="exerciseCount" ng-model = "workout.exercises.length"> </span>
	  <div class="alert alert-danger" ng-show = "formWorkout.exerciseCount.$dirty && formWorkout.exerciseCount.$error.count">
	  The workout should have at least one exercise!
	</div>

Defined both the name and ng-model attribute on the span object.

When Angular encounters ng-model on an element inside a form, it creates an NgModelController object and exposes it on the scope using the name attribute (exerciseCount). The span setup is there to just get hold of the model controller so that the exercise count validator can be registered.

WorkoutDetailController:

	$scope.$watch('formWorkout.exerciseCount', function (newValue) {
	     if (newValue) {
	         newValue.$setValidity("count", 
	           $scope.workout.exercises.length > 0);
	     }});

	$scope.$watch('workout.exercises.length', 
	   function (newValue, oldValue) {
	     if (newValue != oldValue) {
	          $scope.formWorkout.exerciseCount.$dirty = true;
	          $scope.formWorkout.$setDirty();
	          $scope.formWorkout.exerciseCount
	.$setValidity("count", newValue > 0); 
	     }});	

	The first watch is on formWorkout.exerciseCount, an instance of NgModelController. This watch contains the initialization code for the exercise count validation. The watch is required because the WorkoutDetailController completes execution before the ng-model directive gets the chance to instantiate and attach the exerciseCount model controller to formWorkout.

	The $setValidity function is used to set the validation key ("count") on the $error object for a failed validation. The second parameter signifies whether the validation defined by the key (the first parameter) is valid. A false value implies the validation has failed.

	



