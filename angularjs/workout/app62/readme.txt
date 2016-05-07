## Problem
	
	Building a remote validation directive to validate the workout name
	
	If the exercise/workout already exists with this name, we need to inform the user with the appropriate validation message.

## Solution

	The plan is to create a validator that externalizes the actual validation logic.

	The directive will take the validation function as input from the controller scope. This implies that the actual validation logic is not part of the validator but is part of the controller that actually needs to validate input data. The job of the directive is just to call the scope function and set error keys on input element's ngModelController.$error object. 

	Remote calls add another layer of complexity due to asynchronous nature of these calls. The validator cannot get the validation results immediately; it has to wait. AngularJS promises can be of great help here. The remote validation function defined on the controller needs to return a promise instead of validating results and the remote validation directive needs to wait over it before setting the validation key.

### The remote-validator directive (for v1.3 or less)

	workoutbuilder/workout.html

		<input type="text" name="workoutName" ... remote-validator="uniqueName" remote-validator-function="uniqueUserName(value)"> 

		Add validation label:

		<label ng-show = "hasError(formWorkout.workoutName,formWorkout.workoutName.$error.uniqueName)" ng-class = "{'text-danger': formWorkout.workoutName.$error.uniqueName}">Workout with this name exists.</label>

		The remote-validator attribute has the value uniqueName and is used as the error key for the validation ($error.uniqueName). See the preceding validation label to know how the key is utilized. The other attribute remote-validator-function is not a directive but still has an expression assigned to it (uniqueUserName(value)) and a function defined on WorkoutDetailController. This function validates whether the workout name is uniquely passed in the workout name (value) as parameter.

	WorkoutDetailController:

		$scope.uniqueUserName = function (value) {
		if (!value || value === $routeParams.id) return $q.when(true);
		   return WorkoutService
		     	.getWorkout(value.toLowerCase())
			  	.then(function (data) { return $q.reject(); },
		             function (error) { return true; });
		};

		The uniqueUserName method checks whether a workout exists with the same name by calling the getWorkout function on WorkoutService.

		The promise returned as part of the then invocation is rejected if success callback is invoked (using return $q.reject()), else it is successfully resolved with the true value.

		The very first line uses $q.when to return a promise object that always resolves to true. If the value parameter is null/undefined or the workout name is the same as the original name (happens in edit cases), we want the validation to pass.

	shared/directives.js

		angular.module('app').directive('remoteValidator', ['$parse', function ($parse) {
		  return {
		    require: 'ngModel',
		    link: function (scope, elm, attr, ngModelCtrl) {
		    var expfn = $parse(attr["remoteValidatorFunction"]);
		      var validatorName = attr["remoteValidator"];
		      ngModelCtrl.$parsers.push(function (value) {
		       var result = expfn(scope, { 'value': value });
		       if (result.then) {
		           result.then(function (data) { 
		               ngModelCtrl.$setValidity(validatorName, true);
		               }, function (error) {
		               ngModelCtrl.$setValidity(validatorName, false); });
		         }
		         return value;
		      });
		    }
		  }
		}]);

	The require directive definition:

	 The require property is used to denote this dependency. The remote-validator directive requires an ng-model directive to be available on the same HTML element.

	 When Angular encounters such a dependency during directive execution (during the link phase), it injects the required directive controller into the last argument of the link function as seen in the preceding section (the ngModelCtrl parameter).

	 A directive dependency is actually a dependency on the directive's controller function.

	 The require parameter can take a single or array of dependency. For an array of dependency, the dependencies are injected as an array (of directive controllers) into the last argument of the link function.

	The link function:

		The link function of the directive gets called during the link phase of directive execution. Most of the Angular directives use the link function to implement their core functionality.

		The compile and controller functions are some other extension points to attach behaviors to a directive.

			link: function (scope, element, attr, ctrls) {}
			element: Like the compile function's element property, this is the DOM element on which the directive is defined.
			attr: This is a normalized list of attributes defined on elements.
			ctrls: This is a single controller or an array of controllers passed into the link function.

		The compile and link function parameters are assigned based on position; there is no dependency injection involved in the link function's invocation.

### The remote-validator directive in Angular 1.3

	Validators in v1.3 are registered with the $validators and $asyncValidators properties of NgModelController. 

	Since we too are doing remote validations, we need to use the $asyncValidators object to register our validator. Let's create a new definition of the remote-validator directive that uses $asyncValidators. Add this directive definition to directives.js file under shared:

		angular.module('app').directive('remoteValidator', ['$parse', function ($parse) {
		    return {
		        require: 'ngModel',
		        link: function (scope, elm, attr, ngModelCtrl) {
		            var expfn = $parse(attr["remoteValidatorFunction"]);
		            var validatorName = attr["remoteValidator"];
		            ngModelCtrl.$asyncValidators[validatorName] = 
						function (value) {
		                  return expfn(scope, { 'value': value });
		              	}
		        }
		    }
		}]);

	The function property name registered with $asyncValidators is used as the error key when the validation fails. In the preceding case, the error key will be uniquename.

	The asynchronous validation function should take an input (value) and should return a promise. If the promise is resolved to success, then the validation passes, else it is considered failed.

### ng-model-options

	<input type="text" name="workoutName" ...
		ng-model-options="{ updateOn: 'blur' }
	">	






