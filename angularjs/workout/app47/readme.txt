## Problem

	scope inheritance

## Solution

Scopes in Angular are created mostly as part of directive execution. Angular creates a new scope(s) whenever it encounters directives that request for a new scope. The ng-controller, ng-view, and ng-repeat directives are good examples of such directives.

In prototypal inheritance, the parent object and preceding prototypal chain are consulted for reads, but not for writes.

$scope.$new is a scope API function that creates the new child scope that inherits prototypically from the $scope object.

	$scope.myObject = { message: 'Hello Object World' };
	var childScope = $scope.$new(); //creates a child scope

	childScope.myObject= {message:'Hello Object World - Child'};
	console.log(childScope.myObject.message);
	console.log($scope.myObject.message);
	

$scope.myObject and childScope.myObject are two different objects and can be manipulated independently.

$parent is a special property on every $scope object that points to the parent scope from which the scope was created.

	ng-click="$parent.selectedExercise=exercise"

The correct way to fix this would be to create an object with a selected exercise property to track the exercise. In WorkoutDetailController, add a variable to track the selected exercise at the top:

	$scope.selected = {};

Change the interpolation for the description to this:

	{{selected.exercise.details.description}}

Change the ng-click expression to this:

	ng-click="selected.exercise=exercise"	

We have a perfectly working solution for our use case. This time, we track the selected exercise as a sub property (exercise) of selected object and hence things just work.

	