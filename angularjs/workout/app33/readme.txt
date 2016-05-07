
## Problem

	Pausing exercises

## Solution

	To pause the exercise, we need to stop the timer and stop all the sound components. Also, we need to add a button somewhere in the view that allows us to pause and resume the workout. We plan to do this by drawing a button overlay over the exercise area in the center of the page. When clicked, it will toggle the exercise state between paused and running. We will also add keyboard support to pause and resume the workout using the key binding p or P. Let's start with fixing our controller.

### Implementing pause/resume in WorkoutController

To pause a running exercise, we need to stop the interval callbacks that are occurring after every second. The $interval service provides a mechanism to cancel the $interval using the promise returned.

Add the startExerciseTimeTracking() method:

	var startExerciseTimeTracking = function () {
	    var promise = $interval(function () {
	        ++$scope.currentExerciseDuration;
	        --$scope.workoutTimeRemaining;
	    }, 1000, $scope.currentExercise.duration - $scope.currentExerciseDuration);

	    promise.then(function () {
	        var next = getNextExercise($scope.currentExercise);
	        if (next) {
	            startExercise(next);
	        } else {
	            $location.path('/finish');
	        }});
	    return promise;
	}

All the logic to support starting/resuming an exercise has now been moved into this method. The code looks similar to what was there in the startExercise function, except the $interval promise is returned from the function in this case.

Add methods for pausing and resuming:

	$scope.pauseWorkout = function () {
	    $interval.cancel(exerciseIntervalPromise);
	    $scope.workoutPaused = true;
	};
	$scope.resumeWorkout = function () {
	    exerciseIntervalPromise = startExerciseTimeTracking();
	    $scope.workoutPaused = false;
	};
	$scope.pauseResumeToggle = function () {
	    if ($scope.workoutPaused) {
	        $scope.resumeWorkout();
	    } else {
	        $scope.pauseWorkout();
	    }
	}

### Adding the view fragment for pausing/resuming

	We need to show a pause/resume overlay div when the mouse hovers over the central exercise area. 

	Pausing/resuming overlays using mouse events:

		<div id="exercise-pane" class="col-sm-7" ng-mouseenter = "showPauseOverlay=true" ng-mouseleave="showPauseOverlay=false">

	Inside the preceding div element and just before the WorkoutAudioController span, add this:

		<div id="pause-overlay" ng-click="pauseResumeToggle()" ng-show="showPauseOverlay" >
		  <span class="glyphicon glyphicon-pause pause absolute-center"
		     ng-class="{'glyphicon-pause' : !workoutPaused, 'glyphicon-play' : workoutPaused}"></span>
		</div>

	Update app.css with styles related to pause the overlay div element.

### Pausing/resuming overlays with plain CSS

	CSS has an inbuilt pseudo selector :hover for it, a far superior mechanism for showing overlays as compared to mouse-event bindings.

	CSS class manipulation using ng-class:	
	The ng-class directive allows us to dynamically set the class on an element based on some condition. 

		$scope.cls="class1 class2 class3"
		ng-class="cls" // Will apply the above three classes.

		$scope.cls=["class1", "class2", "class3"]
		ng-class="cls" // Will apply the above three classes. 

		ng-class="{'glyphicon-pause' : !workoutPaused, 'glyphicon-play' : workoutPaused}"

### Stopping audio on pause

Add a watch on the parent scope property workoutPaused inside WorkoutAudioController:

	$scope.$watch('workoutPaused', function (newValue, oldValue) {
	    if (newValue) {
	        $scope.ticksAudio.pause();
	        $scope.nextUpAudio.pause();
	        $scope.nextUpExerciseAudio.pause();
	        $scope.halfWayAudio.pause();
	        $scope.aboutToCompleteAudio.pause();
	    } else {
	        $scope.ticksAudio.play();
	        if ($scope.halfWayAudio.currentTime > 0 && 
	        	$scope.halfWayAudio.currentTime <  
	            $scope.halfWayAudio.duration) 
	   	  $scope.halfWayAudio.play();
	   	  if ($scope.aboutToCompleteAudio.currentTime > 0 && 
	        $scope.aboutToCompleteAudio.currentTime <   
	          $scope.aboutToCompleteAudio.duration) 
	        $scope.aboutToCompleteAudio.play();
	    }
	});

### Using the keyboard to pause/resume exercises

We plan to use the p or P key to toggle between the pause and resume state. If AngularJS has mouse-event support, then it will definitely have support for keyboard events too. Yes indeed and we are going to use the ng-keypress directive for this.

	<div class="row workout-app-container" tabindex="1" ng-keypress="onKeyPressed($event)">

The first thing that we have done here is add the tabindex attribute to the div element. This is required as keyboard events are captured by elements that can have focus. Focus for HTML input elements makes sense but for read-only elements such as div having keyboard focus requires tabindex to be set.

Secondly, we add the ng-keypress directive and in the expression, call the onKeyPress function, passing in a special object $event.

Open the workout.js file and add the method implementation for onKeyPressed:

	$scope.onKeyPressed = function (event) {
	   if (event.which == 80 || event.which == 112) { // 'p' or 'P'
	     $scope.pauseResumeToggle();
	   }
	};



