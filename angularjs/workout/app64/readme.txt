## Problem

	Understanding directive-isolated scopes

## Solution

Inputs to directives are provided in one or more forms using directive templates, parent scope, and dependencies on other directives.

Directive output could be behavior extension of an existing HTML element or the generation of new HTML content. The directive API is supported through directive controllers.

For a truly reusable component, all dependencies of a component should be externalized and explicitly stated. When a directive is dependent upon the parent scope for input (even when it creates a child scope), the dependency is implicit and hard to change/replace. Another side effect of an inherited scope is that a directive has access to the parent scope model and can manipulate it. This can lead to unintended bugs that are difficult to debug and fix.

Directive-isolated scopes can solve this problem. As the name suggests, if a directive is created with an isolated scope, it does not inherit from its parent scope but creates its own isolated scope. This may not seem to be a big thing, but the consequences are far reaching. This mechanism lets us create directives that do not have any implicit dependency on the parent scope, hence resulting in a truly reusable component.

To create a directive with an isolated scope, we just need to set the scope property on the directive definition object to this:

	scope:{}

This statement creates a new isolated scope. Now, the scope injected into the link or controller function is the isolated scope and can be manipulated without affecting the directives parent scope.

The parent scope of an isolated scope is still accessible through the $parent property defined on scope object. It's just that an isolated scope does not inherit from its parent scope.

The purpose of an isolated scope is to make this dependency explicit. The scope object notation is there for passing data to directives from the parent scope. The directive scope object can take dependency through three mechanisms.

	 scope: {
	     prop: '@'
	     data: '=',
	     action: '&',
	 },

	<div directive-one prop="Hi {{userName}}"></div>

	<div directive-one data="user"></div>

		The HTML attribute value should be a property on the parent scope.

		This exposes the parent scope property user on isolated scope property data. Changes to user are reflected in data, and changes done to data are reflected back to user.

	<div directive-one action="findUser(name)"></div>

		The action property on the directive scope can invoke the parent scope function (expression) by calling $scope.action({name:'sid'}).

		See how the parameter name is passed on the action function invocation. Instead of directly passing name, it is wrapped inside an object.

### Creating the AJAX button directive

	When we save/update exercise, there is always a possibility of duplicate submission (duplicate POST requests).

	This ajax-button directive will create an isolated scope, with parameters onClick and submitting. Here we have it expounded:

	shared/directives.js

		angular.module('app').directive('ajaxButton', ['$compile', '$animate', function ($compile, $animate) {
		    return {
		        transclude: true,
		        restrict: 'E',
		         scope: { onClick: '&', submitting: '@' },
		        replace: true,
		        template: '<button ng-disabled="busy"><span class="glyphicon glyphicon-refresh spin" ng-show="busy"></span><span ng-transclude=""></span></button>',
		        link: function (scope, element, attr) {
		            if (attr.submitting !== undefined && 
						attr.submitting != null) {
		                attr.$observe("submitting", function (value) {
		                  if (value) scope.busy = JSON.parse(value); });
		            }
		            if (attr.onClick) {
		                element.on('click', function (event) {
		                    scope.$apply(function () {
		                        var result = scope.onClick();
		                        if (attr.submitting !== undefined && 
		                        attr.submitting != null) return; 
		                        if (result.finally) {
		                            scope.busy = true;
		                            result.finally(function () {
		                                scope.busy = false });
		                        }
		                    });
		                });
		            }
		        }
		    }
		}]);

		The first part of the function sets up a watch on the submitting attribute, if it is defined. Then an event handler for click event is attached to the button element.

		When the button is clicked, the event handler code invokes the onClick function, which internally executes the function save() in context of parent scope.

		If the submitting attribute is defined on the directive, the code returns. In such a case, showing/hiding the busy indicator is taken care of by the submitting interpolation and the attr.observe watch setup earlier in the function.

		If submitting is not defined and the onClick invocation returns a promise, the directive set the busy flag and wait for the response using the Promise API finally function, where it resets the busy flag.

		The complete event handler code is wrapped inside scope.$apply, as the context in which the click event is fired is outside of Angular.

		This is how we implement a fully functional ajax-button directive that can show a progress indicator and stop duplicate submission.

	workout.html

		<ajax-button ... on-click="save()" ... >Save</ajax-button>

	One of the oddities of isolated scopes is that two directives declared on the same element cannot both ask for an isolated scope. Isolated scopes are there to support truly reusable components, which mostly come with their own template and scope and can be use anywhere, hence it makes sense that they control the DOM element that they are applied to.

	To break this stalemate, we can move the popover directive inside the ajax-button directive; with transclusion enabled, the popover works inside the ajax-button directive. Change the ajax-button html to make popover directive a child of ajax-button:

	<ajax-button class="btn pull-right has-spinner active" 
		ng-class= "{'btn-default':formWorkout.$valid,'btn-warning':!formWorkout.$valid}" on-click="save()">
		  <span popover="{{formWorkout.$invalid ? 'The form has errors.' 
		: null}}" popover-trigger="mouseenter">Save</span>
	</ajax-button>

	WorkoutDetailController:

		$scope.save = function () {
	    $scope.submitted = true; // Will force validations
	    if ($scope.formWorkout.$invalid) return;
	    WorkoutBuilderService.save().then(function (workout) {
	   ...
	            $scope.submitted = false;

	link function:

		attr.$observe("submitting", function (value) {
   			if (value) scope.busy = JSON.parse(value); });

   		The job of the busy flag is to control when the button is disabled and when the busy spinner is shown.

