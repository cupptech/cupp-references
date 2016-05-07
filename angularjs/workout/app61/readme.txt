## Problem
	
	Working with Directives

## Solution

### Working with Directives

	Directives, together with data-binding infrastructure, make true view-logic separation possible.

	Directives have been conceptualized and incorporated into the framework in such a way that they allow the integration of controllers and views naturally and in a less verbose manner. 

### Anatomy of a directive

	To create a directive, we use the directive function on the Module API.

		directive(name, directiveFactory);

	The name attribute signifies the name and the directiveFactory function is a factory function that returns an object containing the directive configuration. 

	The complete directive definition object returned by the factory function looks:

		function directiveFactory (injectables) {
		      var directiveDefinitionObject = {
		          priority: 0,
		          template: 'html', //use either template or templateUrl
		          templateUrl: 'directive.html',
		          replace: false,
		          transclude: false,
		          restrict: 'A',
		          scope: false,
		          controller: function ($scope, $element, $attrs, $transclude) {},
		          require: 'siblingDirectiveName',
		          compile: function compile(tElement, tAttrs, transclude) {}, // use compile or link function
		          link: function postLink() {}
		      };
		      return directiveDefinitionObject;
		};

### Creating a workout-tile directive

	js/workoutBuilder/directives.js

		angular.module('WorkoutBuilder')
		 .directive('workoutTile', function () {
			return {
		      templateUrl:'/partials/workoutbuilder/workout-tile.html'
		   	}
		});

	workout-tile.html

		<div class="title">{{workout.title}}</div>
		<div class="stats"><!--Existing content --></div>		

	workouts.html

		<span workout-tile=''></span>

	Essentially, workout-tile is doing what ng-include does, but the template HTML is fixed.
	
### <workout-tile>

	restrict:'E',
	templateUrl:'/partials/workoutbuilder/workout-tile.html'

	<workout-tile></workout-tile> //replace the span declaration

	We now have a directive that encapsulated the view template for the HTML workout tile. Any reference to this directive in HTML now renders the tile content. 

	Summary

		Directives have a name, and it is normalized. We are defining a directive in JavaScript as workoutTile, but we refer to it in HTML as workout-tile. Directive naming follows camel case but the directives are referenced in HTML using the dash delimiter (-) as shown in the previous screenshot. In fact, directives can be referenced in HTML with extra prefixes such as x- or data-. For example, the workoutTile directive in HTML can be referred to as x-workout-tile, data-workout-tile, or the standard workout-tile pattern. This process of matching the HTML directive reference to the actual directive name is called normalization.

		Directives can have template (an inline template) or templateUrl (reference to the template). 

		Directives can be applied as an attribute, element, class, or comment.  ACEM

			Attribute (workout-tile="")
			Element (<workout-tile></workout-tile>)
			Class (class="workout-tile")
			Comment (<!-- directive:workout-tile-->)

### Exploring the ng-click directive

	The useful and well-defined ng-click directive allows us to attach behavior to an existing HTML element. It evaluates the expression defined on the ng-click attribute when the element is clicked.

		ngModule.directive('ngClick', ['$parse', function ($parse) {
		  return {
		    compile: function (element, attr) {
		      var fn = $parse(attr['ngClick']);
		      return function (scope, element, attr) {
		         element.on('click', function (event) {
		         scope.$apply(function () { 
					fn(scope, { $event: event }); 
		  		 });
		         });
		     };
		}};}]);

	A directive setup is all about creating a directive definition object and returning it. The directive definition object for ng-click only defines one property, the compile function with arguments such as these:

		element: This is the DOM element on which the directive has been defined. The element can be a jQuery element wrapper (if the jQuery library has been included) or a jqLite wrapper, which is the lite version of jQuery included as part of the Angular framework itself.

		attr: This is an object that contains values for all the attributes defined on the directive element. The attributes available on this object are already normalized. Consider this example:

			<button ng-click='doWork()' class='one two three'>
			Click Me</button>

			The attr object will have the properties: attr.ngClick and attr.class with the values doWork() and one two three, respectively.

		The compile function should always return a function commonly referred to as the link function. Angular invokes these compile and link functions as part of the directive's compilation process. 

		The very first line in the compile function uses an injected dependency, $parse. The job of the $parse service is to translate an AngularJS expression string into a function. 

		This function is then used to evaluate the expression in context of a specific object (mostly a scope object).

		When the link function for ng-click is executed, it sets up an event listener for the DOM event click by calling the element.on function on the directive element. This completes the directive setup process, and the event handler now waits for the click event.

		When the actual DOM click event occurs on the element, the event handler executes the expression function (fn(scope, { $event: event });).

		By wrapping the expression execution inside scope.$apply, we allow Angular to detect model changes that may occur when the expression function is executed and update the appropriate view bindings.

		




