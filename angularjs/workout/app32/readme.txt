
## Problem

	Tracking exercise progress with audio clips:

	A ticking clock sound tracks the progress during the exercise
    A half-way indicator sounds, indicating that the exercise is halfway through
    An exercise-completion audio clip plays when the exercise is about to end
    An audio clip plays during the rest phase and informs users about the next exercise

## Solution

	Modern browsers have good support for audio. The <audio> tag of HTML5 provides a mechanism to embed audio into our HTML content. We will use it to embed and play our audio clips during different times in the app.


### Implementing audio support
	
	Create a separate controller for audio and workout synchronization.
	The new controller will be responsible for tracking exercise progress and will play the appropriate audio clip during the exercise.

	angular-media-player (https://github.com/mrgamer/angular-media-player). 
	1. Download angular-media-player.js from https://github.com/mrgamer/angular-media-player/tree/master/dist.
	2. Create a 'vendor' folder inside 'js' folder
	3. <script src="js/vendor/angular-media-player.js"></script>
	4. angular.module('app', [..., 'workout', 'mediaPlayer']).

	Open workout.html and add this HTML fragment inside exercise div (id="exercise-pane") at the very top:

		<span ng-controller="WorkoutAudioController">
		  <audio media-player="ticksAudio" loop autoplay src="content/tick10s.mp3"></audio>
		  <audio media-player="nextUpAudio" src="content/nextup.mp3"></audio>
		  <audio media-player="nextUpExerciseAudio" playlist="exercisesAudio"></audio>
		  <audio media-player="halfWayAudio" src="content/15seconds.wav"></audio>
		  <audio media-player="aboutToCompleteAudio" src="content/321.wav"></audio>
		</span>	

	The media-player directive is added to each audio tag. This directive then adds a property with the same name as the one assigned to the media-player attribute on the current scope.

	We use these properties to manage the audio player in WorkoutAudioController.

### Implementing WorkoutAudioController

	Since WorkoutController is linked to ng-view, we have effectively nested WorkoutAudioController inside WorkoutController.

	This new scope inherits (prototypal inheritance) from the parent scope, and has access to the model state defined on parent $scope.

	As views and controllers start to become complex, there are always opportunities to split a large view into smaller manageable subviews that can have their own model and controller as we are doing with our workout audio view and controller.

	workout.js

		angular.module('workout')
		  .controller('WorkoutAudioController', ['$scope', '$timeout', function ($scope, $timeout)    {
		   $scope.exercisesAudio = [];  //  store all audio clips for each exercise defined in Exercise.nameSound
		   var init = function () {
		   }
		   init();
		}]);	

	Since the WorkoutAudioController scope has access to the workoutPlan property defined on the parent controller scope, it can watch the property for changes. 

	Add this code after the declaration of the exercisesAudio array in WorkoutAudioController:

		var workoutPlanwatch = $scope.$watch('workoutPlan', function (newValue, oldValue) {
		    if (newValue) {  // newValue==workoutPlan
		        angular.forEach( $scope.workoutPlan.exercises, 
		        function (exercise) {
		            $scope.exercisesAudio.push({
		                src: exercise.details.nameSound,
		                type: "audio/wav"
		            });
		        });
		        workoutPlanwatch(); //unbind the watch.
		    }
		});

	This watch loads all the exercise name audio clips into the exercisesAudio array once workoutPlan is loaded.

	Similarly, to track the progress of the exercise, we need to watch for the currentExercise and currentExerciseDuration properties. 

		$scope.$watch('currentExercise', function (newValue, oldValue) {
		  if (newValue && newValue !== oldValue) {
		    if ($scope.currentExercise.details.name == 'rest') {
		      $timeout(function () { $scope.nextUpAudio.play();}
				, 2000);
		      $timeout(function () { $scope.nextUpExerciseAudio.play($scope.currentExerciseIndex + 1, true);}
				, 3000);
			}
		  }
		});

		$scope.$watch('currentExerciseDuration', function (newValue, oldValue) {
		if (newValue) {
		if (newValue == Math.floor($scope.currentExercise.duration / 2) && $scope.currentExercise.details.name !== 'rest') {
		         $scope.halfWayAudio.play();
		        } 
		   else if (newValue == $scope.currentExercise.duration - 3) {
		            $scope.aboutToCompleteAudio.play();
		        }
		    }
		});

	The nextUpExerciseAudio value takes playlist, which is an array of audio sources. 

	The second watch on currentExerciseDuration gets invoked every second and plays specific audio elements at mid-time and before the exercise ends.

### currentExerciseIndex

 	It will be better if we do not alter the array once the exercise starts and instead use the currentExerciseIndex property with the exercises array to always locate the current exercise in progress.

 	There is a fix required in workout.html too.

 		<h3 class="col-sm-6 text-right" ng-if="currentExercise.details.name=='rest'">Next up: <strong>{{workoutPlan.exercises[currentExerciseIndex + 1].details.title}}</strong></h3>


### AngularJS dirty checking and digest cycles

	The properties that we watch in Angular are standard JavaScript objects/values and since JavaScript properties (at least till now) are not observable, there is no way for Angular to know when the model data changed.

	AngularJS detects changes only when the $scope.$apply(exp) function is invoked. This function can take an argument exp that it evaluates in the current scope context. Internally, $apply evaluates exp and then calls the $rootScope.$digest() function.

	The call to $digest() triggers the model change detection process. 

	The invoking of the $digest() function on $rootScope in the Angular world is called the digest cycle. It is termed as cycle because it is a repeating process. What happens during the digest loop is that Angular internally starts two smaller loops as follows:

	The $evalAsync loop: $evalAsync is a method on the $scope object that allows us to evaluate an expression in an asynchronous manner before the next digest loop runs. Whenever we register some work with $evalAsync, it goes into a list. During the $evalAsync loop, items in this list are evaluated till the list is empty and this ends the loop. We seldom need it; in fact I have never used it.

	The $watch list loop. All the watches that we register, or are registered by the framework directives and interpolations, are evaluated in this loop.

	To detect the model changes, Angular does something called as dirty checking. This involves comparing the old value of the model property with the current value to detect any changes. For this comparison to work, Angular needs to do some book keeping that involves keeping track of the model value during the last digest cycle.

	If the framework detects any model changes from the last digest cycle, the corresponding model watch is triggered. Interestingly, this watch triggering can lead to a change in model data again, hence triggering another watch.

	For example, if the $watch callback updates some model data on the scope that is being watched by another watch expression, another watch will get triggered.

	Angular keeps reevaluating the watch expression until no watch gets triggered or, in other words, the model becomes stable. At this moment, the watch list loop ends.

	When both the $evalAsync and $watch loops are complete, AngularJS updates the HTML DOM and the digest cycle itself ends.

	Angular made a very plausible assumption about when the model can change. It assumes model data can get updated on events such as user interaction (via the mouse and keyboard), form field updates, Ajax calls, or timer functions such as setTimeout and setInteval. It then provided a set of directives and services that wrap these events and internally call $scope.$apply when such events occur.

	Summary:

	- An Angular watch does not trigger as soon as a model being watched changes.
    - A watch is only triggered during a digest cycle. A digest cycle is in an iterative process during which Angular compares the old and new values of the watched expression for changes. If the value changes, the watch is triggered. Angular does this for all watches that we create and the ones created by the framework to support data binding.
    - A digest cycle is triggered by calling $scope.$apply. The framework calls $scope.$apply at various times during the app execution. For example, when a button is clicked, or when $interval lapses.


