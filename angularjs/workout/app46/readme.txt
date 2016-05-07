## Problem

	Saving the workout

## Solution

WorkoutService needs two new methods: addWorkout and updateWorkout:

	service.updateWorkout = function (workout) {
	    var workoutIndex;
	    for (var i = 0; i < workouts.length; i++) {
	      if (workouts[i].name === workout.name) {
	          workouts[i] = workout;
	          break;
	      }
		}
	    return workout;
	};

	service.addWorkout = function (workout) {
	    if (workout.name) {
	        workouts.push(workout);
	        return workout;
	    }
	}


WorkoutBuilderService:

	service.save = function () {
	  var workout = newWorkout ? 
	    WorkoutService.addWorkout(buildingWorkout): 
	      WorkoutService.updateWorkout(buildingWorkout);
	   newWorkout = false;
	   return workout;
	};

### The AngularJS form directive and form validation	

The standard form behavior of posting data to the server using full-page post-back does not make sense with a SPA framework such as AngularJS. In Angular, all server requests are made through AJAX invocations originating from controllers, directives, or services.


The form here plays a different role. When the form encapsulates a set of input elements (such as input, textarea, and select) it provides an API for:

    Determining the state of the form, such as whether the form is dirty or pristine based on the input controls on it

    Checking validation errors at the form or control level

The form declaration creates a controller with the name formWorkout in the WorkoutDetailController scope.

WorkoutDetailController:

	$scope.save = function () {
	    if ($scope.formWorkout.$invalid) return;
	    $scope.workout = WorkoutBuilderService.save();
	    $scope.formWorkout.$setPristine();		// set the form to pristine state
	}

The FormController API:

	$addControl(modelController)
	$removeControl(modelController)
	$setValidity(validationKey, status, childController)
	$setDirty()
	$setPristine()
	$setUntouched()

We use the $dirty property with the workout title:

	<h2 class="col-sm-5 col-sm-offset-1">{{workout.title}} {{formWorkout.$dirty?'*':''}} ...
	It appends an asterisks (*) symbol after the title when the form is dirty.

### Fixing the saving of forms and validation messages:

	$scope.save = function () {
	    $scope.submitted = true; // Will force validations
	    if ($scope.formWorkout.$invalid) return;
	    $scope.workout = WorkoutBuilderService.save();
	    $scope.formWorkout.$setPristine();
	    $scope.submitted = false;
	}

	ng-show="(submitted || formWorkout.workoutName.$dirty) && formWorkout.workoutName.$error.required"

	With this fix, the error message is shown when the control is dirty or form Submit button is pressed (submitted is true). 

Angular 1.3 has this feature inbuilt. The form controller in Angular 1.3 already has $submitted, and its behavior matches our own implementation.

	Add a hasError method in WorkoutDetailController:

		$scope.hasError = function (modelController, error) {
		  return (modelController.$dirty || $scope.submitted) && error;
		}

	The function does a similar check to the previous one in ng-show, but here we pass, in the controller, the error state parameter. The ng-show expression now becomes:

		ng-show = "hasError(formWorkout.workoutName, formWorkout.workoutName.$error.required)"

### Fixing unwarranted model updates

	Update the getWorkout method, return a copy of the workout instead of the original.

	if (workout.name === name) result = angular.copy(workout);

### Resetting the form

	For Workout Builder, we will reset the form to its initial state using a similar approach outlined in the last section. Open workout.js, update WorkoutDetailController, and add the reset method:

		$scope.reset = function () {
		  $scope.workout = 
			WorkoutBuilderService.startBuilding($routeParams.id);
		  $scope.formWorkout.$setPristine();
		  $scope.submitted = false;
		};

### AngularJS $routeParams

	The $routeParams service contains route fragment values derived from the current route, for routes that are dynamic in nature. 

### Dynamically generated inputs and forms

	<input type="number" name="{{exercise.name}}-duration"  ng-model="exercise.duration"/>

	 this does not work. AngularJS literally creates a model controller with the name {{exercise.name}}-duration. The reason is that the name attribute on the form and input (with ng-model) do not support interpolations. 
	 This issue has been fixed in Angular 1.3. The approach detailed later and that uses nested forms is still a better approach.

	Validating exercise duration with ng-form:

	Change the exercise list item template script (id="workout-exercise-tile") and wrap the select tag into an ng-form directive together with a validation label:

		<ng-form name="formDuration">
		  <select class="select-duration form-control" name="duration" 
		  ng-model="exercise.duration" ng-options="duration.value as duration.title for duration in durations" required>
		    <option value="">Select Duration</option>
		  </select>
		  <label ng-show=
		     "hasError(formDuration.duration,  
		      formDuration.duration.$error.required)" 
		      class="text-danger">Time duration is required.</label> 
		</ng-form>

	The ng-form directive behaves similarly to form. It creates a form controller and adds it to the scope with the name formDuration. All validations within the ng-form happen in the context of the formDuration form controller as we can see in the previous binding expressions. This is possible because ng-repeat creates a new scope for each item it generates.

	Other than the formDuration added to the ng-repeat scope, internally the formDuration controller is also registered with the parent form controller (formWorkout) using the controller API function $addControl.

	Due to this, the validation state and dirty/pristine state of the child forms roll up into the parent form controller (formWorkout). This implies:

	    If there are validation errors at the child form controller, then the parent form controller state becomes invalid ($invalid returns true for parent)

	    If the child form controller is set to dirty, the parent form controller is also marked dirty

	    Conversely, if we call $setPristine on the parent form controller, all child form controllers are also reset to the pristine stage

	Refresh the workout builder page again and now the validation on exercise duration also works and integrates well with the parent formWorkout controller. If there is any error in the exercise duration input, the formWorkout controller is also marked invalid.