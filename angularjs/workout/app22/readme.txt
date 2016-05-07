
## Problem

	Show Workout Exercise View.

## Solution

### Workout view

	For the view, we need to show the exercise name, exercise image, a progress indicator, and time remaining:

		<div class="container body-content app-container">
		  <div class="row">
		    <div id="exercise-pane" class="col-sm-8 col-sm-offset-2">
		       <div class="row workout-content">
		          <div class="workout-display-div">
		             <h1>{{currentExercise.details.title}}</h1>
		             <img class="img-responsive" ng-src="{{currentExercise.details.image}}" />
		             <div class="progress time-progress">
		             <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="{{currentExercise.duration}}" ng-style="{'width':(currentExerciseDuration/currentExercise.duration) * 100 + '%'}">
		             </div>
		         </div>
		         <h1>Time Remaining: {{currentExercise.duration-currentExerciseDuration}}</h1>
		      </div>
		    </div>
		  </div>
		</div>
		</div>

	Image path binding with ng-src: When we use ng-src, the framework delays the evaluation of the src attribute till the model data is available and hence none of the request fails. Therefore, it is always advisable to use ng-src with the <img> tag if the URL is dynamic and depends upon the model data.

	Using ng-style with the Bootstrap progress bar:
	We use the Bootstrap progress bar (http://getbootstrap.com/components/#progress) to provide visual clues about the exercise progress. The progress effect is achieved by changing the CSS width property of the progress bar like this: style="width: 60%;". AngularJS has a directive to manipulate the style of any HTML element and the directive is aptly named ng-style.

	The ng-style directive takes an expression that should evaluate to an object, where the key is the CSS style name and the value is the value assigned to the style. For our progress bar, we use this expression:

		"{'width':(currentExerciseDuration/currentExercise.duration) * 100 + '%'}"

	The width CSS property is set to the percentage time elapsed and converted into a string value by concatenating it with %.

	Remember we can achieve the same effect by using the standard style attribute and interpolation.

		"{{'width:' + (currentExerciseDuration/currentExercise.duration) * 100 + '%'}}"









