## Problem

	AngularJS forms
	- Allowing user input
    - Validating those inputs against business rules
    - Submitting the data to the backend server

    ng-model
    ng-messages

## Solution

The primary form-related constructs in AngularJS are:

	- The form directive and the corresponding FormController object
    - The ng-model directive and the corresponding NgModelController object

For the ng-model directive to work correctly, another set of directives is required, which include:

    input: HTML input extended using directive
    textarea: HTML textarea extended using directive
    select: HTML dropdown extended using directive

### The ng-model directive

	One of the primary roles of the ng-model directive is to support two-way binding between user input and the underlying model.

		<input type="text" name="workoutName" id="workout-name" ng-model="workout.name">

	The preceding ng-model directive sets up a two-way binding between the input and model property workout.name.

	Using ng-model with select:

		<select … name="duration" ng-model="exercise.duration" 
		ng-options="duration.value as duration.title for duration in durations"></select>	

	There are no inner option tags! Instead, there is a ng-options attribute. binds to an array, durations.

	The ng-options directive supports multiple formats of data binding. The format we use is:

	[selected] as [label] for [value] in array

	Where:
	    selected: What (duration.value) gets assigned to ng-model (exercise.duration) when the item is selected
	    label: What is shown (duration.title) in the dropdown
	    value: This is an item (duration) in the array that binds to a select option	

	The selected parameter is optional and only required if we want to set a subproperty of a selected item to ng-model:

		ng-options="duration.title for duration in durations"

	The same select tag if implemented with the option tag would look like this:

		<select ... ng-model="exercise.duration">
		  <option value="{{duration.value}}" 
		    label="{{duration.title}}" 
		    ng-repeat="duration in durations" 
		    ng-selected="exercise.duration==duration.value">
		    {{duration.title}}
		  </option>
		</select>

### Controlling model updates with ng-model-options (Angular 1.3)

	<input type="text" … ng-model="workout.name" 
	  	ng-model-options="{updateOn:'blur'}">{{workout.name}}	

	The updateOn expression allows us to customize on what event model data should be updated, and we can configure multiple events here (space-delimited).

		ng-model-options="{updateOn:'blur mouseleave'}"

	This debounce mechanism dictates how long Angular waits after an event to update the underlying model.

		ng-model-options = "{updateOn:'default blur'
		  , debounce: {'default': 1000, 'blur': 0}}"

	Type ahead input too can utilize these options (especially the debounce option) to reduce the number of remote requests.

	https://docs.angularjs.org/api/ng/directive/ngModelOptions

### ng-model – beyond data binding

	The ng-model directive in itself is a mini MVC component that has its own controller. Through this controller, it exposes an API to format and validate model data.

	The form controller (the FormController object) provides an API to check and manipulate the state of the form.

	On similar lines, when AngularJS encounters the ng-model directives, it creates a model controller (an instance of the ngModelController class). If the element with ng-model is defined inside a named form, the model controller instance is available as a property of the form controller (see $scope.formWorkout.workoutName).

### Understanding NgModelController
	
	AngularJS model controller defines two pipelines:

	Formatter: This pipeline is used as $formatters. It is an array of formatter functions that are called one after another when the model value changes. 

	Parser: This pipeline is used as $parsers. This is also an array of parser functions. Parser pipeline is executed when the view element is updated by the user and model data needs to be synchronized.

	The complete AngularJS validation infrastructure is built upon formatter and parser pipelines.

	Angular 1.3 does not employ these pipelines for validation. Validating user input in Angular 1.3 happens after execution of formatter/parser pipelines.

	As the name suggests, these pipelines make formatting a model and parsing view data easier.

		function upperCase(value) {
		   if (value) { return value.toUpperCase();}
		}
		ngModel.$formatters.push(upperCase);

### Implementing a decimal-to-integer formatter and parser

	Create a formatter and parser to sanitize the user input and model data.

	WorkoutDetailController:

		var restWatch = $scope.$watch('formWorkout.restBetweenExercise', 
		  function (newValue) {
			if (newValue) {
		      newValue.$parsers.unshift(function (value) {
		         return isNaN(parseInt(value)) ? value : parseInt(value);
		      });
		      newValue.$formatters.push(function (value) {
		         return isNaN(parseInt(value)) ? value : parseInt(value);
		      });
		      restWatch(); //De-register the watch after first time.
		    }
		});

	We register our formatter and parser once the restBetweenExercise model controller is created. The watch has been registered just to know when the model controller instance is created.

	Test parser:

		Rest Time (in seconds):{{workout.restBetweenExercise}}

	Test formatter:

		$scope.workout.restBetweenExercise = 25.53;

### AngularJS validation

	As the saying goes "never trust user input", and Angular has us covered here! 

	Other than validations based on input type, there is also support for validation attributes including the standard required, min, max, and custom attributes such as ng-pattern, ng-minlength, and ng-maxlength.

	NgModelController can provide the validation state of the input. 

		<label ng-show="formWorkout.workoutName.$error.required" ng-class="{'text-danger': formWorkout.workoutName.$error.required}"> 
  		Workout name is required and it should be unique.</label>

  	Every model controller (such as formWorkout.workoutName shown previously) has a property $error that contains a list of all errors for the specific ng-model directive. The $error key (the property name) is the name of the validation (required in our case) that is failing and the value is true. If the key is not present on the $error object, it implies the input does not have the corresponding validation error. We use the $error.required error key to show the validation error and set an error class style.

### The AngularJS model state

	Every element that uses ng-model—including input, textarea, and select—has some states defined on the associated model controller:

		$pristine: The value of this is true as long as the user does not interact with the input. Any updates to the input field and $pristine is set to false. Once false, it never flips, unless we call the $setPristine() function on the model controller.

	    $dirty: This is the reverse of $pristine. This is true when the input data has been updated. This gets reset to false if $setPristine() is called.

	    $touched: This is part of Angular 1.3. This is true if the control ever had focus.

	    $untouched: This is part of Angular 1.3. This is true if the control has never lost focus. This is just the reverse of $touched.

	    $valid: This is true if there are validations defined on the input element and none of them are failing.

	    $invalid: This is true if any of the validations defined on the element are failing.


	    ng-show="formWorkout.workoutName.$dirty && formWorkout.workoutName.$error.required"

	Based on the model state, Angular also adds some CSS classes to an input element. These include the following:

	    ng-valid: This is used if the model is valid.

	    ng-invalid: This is used if the model is invalid.

	    ng-pristine: This is used if the model is pristine.

	    ng-dirty: This is used if the model is dirty.

	    ng-untouched: This is part of Angular 1.3. This is used when the input is never visited.

	    ng-touched: This is part of Angular 1.3. This is used when the input has focus.

	    ng-invalid-<errorkey>: This is used for a specific failed validation.

	    ng-valid-<errorkey>: This is used for a specific validation that does not have failure.	

	    input.ng-invalid {  border:2px solid red; }

### Workout builder validation

	Updates to a model and model validation happen instantaneously, not on input blur

    Once validations are in place, AngularJS does not allow invalid values to be assigned to the model from view

    This holds good the other way around too. Invalid model data does not show up in the view either

	workout.html

### How validation works (pre-Angular 1.3)

	In AngularJS, validations are done using the parser/formatter pipelines.
	Angular too uses these pipelines to register validation functions within the pipeline. 

	These validation functions (inside the pipeline) test the input value against a condition and return undefined if the validation fails, otherwise, pass the value along to the next in the pipeline. The end effect is that model or view data is cleared on validation failures.

	For example:

		<input type="number" ng-model="workout.restBetweenExercise" min="1" ng-pattern="/^-?\d+$/" required ...>

	One of the validation functions that do regular expression-based validation (ng-pattern) is registered in both the formatter and parser pipelines and its implementation looks like this (from AngularJS source code 1.2.15):

		function(value) {
		  return validateRegex(pattern, value);
		};		

### How validation works (Angular 1.3)

	Validators in 1.3 are registered on the model controller property object $validators. Angular calls each function defined on the $validators property to validate the data.

	Another difference is that validator functions in 1.3 return a Boolean value to signify if the validation passed or failed.

	- Formatters and parsers always run before validators get a chance to validate input. In pre-Angular 1.3, we could control the order.
    - In the case of a parser pipeline (the one that converts a view value to a model) specifically, if there is failure during parsing, the validator pipeline is not called.
    - In pre-Angular 1.3, a failed validator in the pipeline used to clear the input value, and the subsequent validators received undefined. In 1.3, each validator gets a chance to validate the input value irrespective of the outcome of other validations.

### Managing validation error messages with ng-messages (Angular 1.3)

	Angular 1.3 provides a better mechanism to show/hide an error message based on the state of the control. It exposes two directives: ng-messages and ng-message that allow us to show/hide error messages, but with a less verbose syntax.

		<div ng-messages="formWorkout.restBetweenExercise.$error"
		ng-if="formWorkout.restBetweenExercise.$dirty">
		    <label ng-message="required" class="text-danger">
				Time duration is required.</label>
		    <label ng-message="number" class="text-danger">
				Time duration should be numeric.</label>
		    <label ng-message="min" class="text-danger">
				Only positive integer value allowed.</label>
		    <label ng-message="pattern" class="text-danger">
				Only integer value allowed.</label>
		</div>

	Angular module ngMessages
		angular.module('app', ['ngRoute', . . . , 'ngMessages']).

	To show all the failed validations, we need to add another property to the ng-messages HTML:

		<div ng-messages=". . ." ng-messages-multiple>
