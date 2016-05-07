
## Problem

	Tell what the next exercise, during the short rest period after each exercise.
	Adding the next exercise indicator using ng-if.

## Solution

	To implement this feature, we would simply output the title of the exercise from the first element in the workoutPlan.exercises array in a label during the rest stage. 

	Show the next exercise next to the Time Remaining countdown section.

		<div class="workout-display-div">
		  <!-- Exiting html -->
		  <div class="progress time-progress">
		     <!-- Exiting html -->
		  </div>
		  <div class="row">
		     <h3 class="col-sm-6 text-left">Time Remaining: <strong>{{currentExercise.duration-currentExerciseDuration
		}}</strong></h3>
		     <h3 class="col-sm-6 text-right" ng-if=
		"currentExercise.details.name=='rest'">Next up: <strong>{{workoutPlan.exercises[0].details.title}
		}</strong></h3>
		  </div>
		</div>

	The ng-if directive is used to add or remove a specific section of DOM based on whether the expression provided to it returns true or false. 

	The difference between ng-if and ng-show/ng-hide is that ng-if creates and destroys the DOM element, whereas ng-show/ng-hide achieves the same effect by just changing the display CSS property of the HTML element to none.

	With ng-if, whenever the expression changes from false to true, a complete re-initialization of the ng-if content happens. A new scope is created and watches are set up for data binding. If the inner HTML has ng-controller or directives defined, those are recreated and so are child scopes, as requested by these controllers and directives. The reverse happens when the expression changes from true to false. All this is destroyed. Therefore, using ng-if can sometimes become an expensive operation if it wraps a large chunk of content and the expression attached to ng-if changes very often.

	Replace all instances of workoutPlan with $scope.workoutPlan. And finally, remove the following line:

		var workoutPlan;
