Show Workout Exercise JSON data transition.

## Problem

	7 Minute Workout is an exercise/workout plan that requires us to perform a set of twelve exercises in quick succession within the seven minute time span.

	We perform a set of twelve exercises, dedicating 30 seconds for each exercise. This is followed by a brief rest period before starting the next exercise. For the app we are building, we will be taking rest periods of 10 seconds each. 

	Functionalities:
	- Show workout remaining time
	- Show exercise description
	- Show exercise step-by-step instructions
	- Show exercise title and screenshot
	- Show exercise remaining time, progress bar 
	- Notifying the user when the workout is completed
	- Pause the current workout
	- Providing the information about the next exercise to follow
	- Providing audo clues:
		A timer click sound
		Details about the next exercise
		Signaling that the exercise is about to start
	- Showing related videos for the exercise in progress, and the ability to play with

## Solution

### Code Organization

	The basic folder structure for our web app look like this:

	app
		css
		img
		js
			workout 		// folder per feature
				workout.js	// controller, one controller per page/view
				directives.js
				filters.js
				services.js
		partials
		index.html: the start page for the app

### Workout model

	A workout is a set of exercises performed in a specific order for a particular duration.

	Exercise model:

	function Exercise(args) {
	    this.name = args.name;					// This should be unique
	    this.title = args.title;				// This is shown to the user
	    this.description = args.description;	// A description of the exercise
	    this.image = args.image;				// Screenshot image
	    this.related = {};							
	    this.related.videos = args.videos;		// Related videos
	    this.nameSound = args.nameSound;		// The name of the audio clip for the exercise
	    this.procedure=args.procedure;			// Instructions on how to perform the exercise
	}

	Workout model:

	function WorkoutPlan(args) {
	    this.name = args.name;					// This should be unique
	    this.title = args.title;				// This is shown to the user
	    this.exercises = [];					// Exercises that are part of the workout
	    this.restBetweenExercise = args.restBetweenExercise;
	};

	The exercises array will contain objects in the format {exercise: new Exercise({}), duration:30}.

### Adding app modules

	Add all module declarations in a separate file: app.js

		angular.module('app', []);

	Add a module for 'workout' feature:

		angular.module('workout', []);

### The app controller

	The behavior of the app:

	    1. Start the workout.
	    2. Show the workout in progress and show the progress indicator.
	    3. After the time elapses for an exercise, show the next exercise.
	    4. Repeat this process till all exercises are over.

	workout.js

		angular.module('workout').controller('WorkoutController', function($scope){
		});

	Dependency injection: allows us to manage dependencies between components in a loosely coupled manner.
	With such a framework in place, dependent objects are managed by a DI container.
	
	To resolve dependencies, AngularJS uses name matching. For each dependency (a parameter such as $scope) defined on the function, Angular tries to locate the dependency from a list of components that have already been registered.

	Minification in JavaScript is the process of removing extra characters for the source code with the aim to reduce the overall size of the codebase. This can lead to the removal of whitespaces/comments, shortening functions/variables, and other such changes. 

	A minifier will minify the input parameter names, rendering the AngularJS DI framework useless. 

	Dependency annotations: declare dependencies so that DI does not break after minification.

	The $inject annotation:

		function WorkoutController($scope) {
			// Controller implementation
		}
		// This property points to an array that contains all the dependencies annotated as string values.
		WorkoutController['$inject']  =  ['$scope'];		
		angular.module('app')
			.controller('WorkoutController', WorkoutController);

	The inline annotation:

		angular.module('workout')
		  .controller('WorkoutController', ['$scope', function($scope) {
		}]);

		The second argument to the controller function is now an array instead of a function. This array contains a list of dependencies annotated using string literals. The last element in the array is the actual controller function (function($scope)) with the injected dependencies. Like the $inject injection, this too happens based on the annotation order.

	ng-annotate

		If, on the NodeJS platform, we can use tools such as ng-annotate (https://github.com/olov/ng-annotate), allowing us to convert the standard declaration syntax to an inline annotation format. The tool takes the following code:

		.controller('WorkoutController', function($scope){

		Then, it is changed to the following:

		.controller('WorkoutController', ['$scope', function($scope) {

		Once ng-annotate is plugged into a build system, this process can be automated allowing us to use the less verbose syntax during development.

### Controller implementations

	Add initialization code:

		var init = function () {
			startWorkout();
		};
		init();

	The startWorkout method should load the workout data and start the first exercise:

		var startWorkout = function () {
		    workoutPlan = createWorkout();
		    restExercise = {
		        details: new Exercise({
		            name: "rest",
		            title: " Relax!",
		            description: " Relax a bit!",
		          image: "img/rest.png",

		        }),
		        duration: workoutPlan.restBetweenExercise
		    };
		    startExercise(workoutPlan.exercises.shift());	
		};

	The call to the createWorkout method sets up the initial 7 Minute Workout data. In this function, we first create a WorkoutPlan object and then push exercise-related data into its exercises array. 

		var createWorkout = function () {
		     var workout = new WorkoutPlan({
		         name: "7minWorkout",
		         title: "7 Minute Workout",
		         restBetweenExercise: 10
		     });

		     workout.exercises.push({
		         details: new Exercise({
		             name: "jumpingJacks",
		             title: "Jumping Jacks",
		             description: "Jumping Jacks.",
		             image: "img/JumpingJacks.png",
		             videos: [],
		             variations: [],
		             procedure: ""
		         }),
		         duration: 30
		     });
		    // (TRUNCATED) Other 11 workout exercise data.
		     return workout;
		}		

	The function 'startExercise' looks like this:

		var startExercise = function (exercisePlan) {
		    $scope.currentExercise = exercisePlan;
		    $scope.currentExerciseDuration = 0;
		    $interval(function () {
		        ++$scope.currentExerciseDuration;
		    }, 1000, $scope.currentExercise.duration);
		};

### Implementing exercise transitions

Implement a getNextExercise function to determine the next exercise to transition to. 

	var getNextExercise = function (currentExercisePlan) {
	     var nextExercise = null;
	     if (currentExercisePlan === restExercise) {
	         nextExercise = workoutPlan.exercises.shift();
	     } else {
	         if (workoutPlan.exercises.length != 0) {
	             nextExercise = restExercise;
	         }
	     }
	     return nextExercise;
	};

### Exploring $watch

	$watch function allows us to register a listener that gets called when the scope property changes:

		$scope.$watch(watchExpression, [listener], [objectEquality]);

	- The first parameter, watchExpression, can be either a string expression or a function. If the watchExpression value changes, the listener is invoked.
	- The second parameter listener takes a function. This function is invoked with three parameters namely newValue, oldValue, and the current scope. This is where we write logic to respond to the changes.
	- The third parameter is a Boolean argument objectEquality that determines how the inequality or change is detected. To start with, Angular not only allows us to watch primitive types such as strings, numeric, Boolean, and dates, but also objects. When objectEquality is false, strict comparison is done using the !== operator. For objects, this boils down to just reference matching.
	However, when objectEquality is set to true, AngularJS uses an angular.equals framework function to compare the old and new values. 


	To understand how objects are compared for inequality, it is best to look at some examples.

	This gives a watch expression:

		$scope.$watch('obj',function(n,o){console.log('Data changed!');});

	These changes to $scope.obj will trigger the watch listener:

		$scope.obj={};  // Logs 'Data changed!'
		$scope.obj=obj1; // Logs 'Data changed!'
		$scope.obj=null; // Logs 'Data changed!'

	Whereas these will not:

		$scope.obj.prop1=value; // Does not log 'Data changed!'
		$scope.obj.prop2={}; // Does not log 'Data changed!'
		$scope.obj=$scope.obj; // Does not log 'Data changed!'

	In the preceding scenarios, the framework is not tracking internal object changes.

	Instead, let's set the third parameter to true:

		$scope.$watch('obj', function(n,o){console.log('Data changed!'},true);

	All the previous changes will trigger the listener except the last one.

	If we watch an object with objectEquality set to true then keep in mind that the framework does not tell which property in the object has changed. To do this, we need to manually compare the new object (n) and the old object (o).

	Do these watches affect performance? Yes, a little. To perform comparison between the new and old values of a model property, Angular needs to track the last value of the model. This extra bookkeeping comes at a cost and each $watch instance that we add or is added by the framework does have a small impact on the overall performance. Add to that the fact that, if objectEquality is set to true, Angular has to now keep a copy of complete objects for the purpose of detecting model changes. This might not be a problem for standard pages, but for large pages containing a multitude of data-bound elements the performance can get affected. Therefore, minimize the use of object equality and keep the number of view bindings under control.

	$watchCollection

		$watchCollection(expression, listener);

	Here, an expression can be an object or array property on scope. For an object, the listener is fired whenever a new property is added or removed (remember JavaScript allows this). For an array, the listener is fired whenever elements are added, removed, and moved in the array.

### Transition: Using $watch to watch the models changes

	To make a transition to the next exercise, we need a way to monitor the value of currentExerciseDuration. Once this value reaches the planned exercise duration, transition to the next exercise is required.

	Implementing transitions using $watch: 

	$scope.$watch('currentExerciseDuration', function (nVal) {
	    if (nVal == $scope.currentExercise.duration) {
	        var next = getNextExercise($scope.currentExercise);
	        if (next) {
	            startExercise(next);
	        } else {
	            console.log("Workout complete!")
	        }
	    }
	});

	We add a watch on currentExerciseDuration and whenever it approaches the total duration of the current exercise (if (nVal == $scope.currentExercise.duration)), we retrieve the next exercise by calling the getNextExercise function and then start that exercise. If the next exercise retrieved is null, then the workout is complete.

### Transition: Using the AngularJS Promise API for exercise transitions

	AngularJS exposes the implementation over the $q service that allows us to create and interact with promises.

	The basics of promises:
	Browsers execute our JavaScript code on a single thread. This implies that we cannot have any blocking operation as it will freeze the browser and hence counts as a bad user experience. Due to this reason, a number of JavaScript API functions such as functions related to timing events (setTimeout and setInterval) and network operations (XMLHttpRequest) are asynchronous in nature. This asynchronous behavior requires us to use callbacks for every asynchronous call made.


	The problem with callbacks is that they can easily become unmanageable:

		step1(function (value1) {
		    step2(value1, function(value2) {
		        step3(value2, function(value3) {
		            step4(value3, function(value4) {
		                // Do something with value4
		            });
		        });
		    });
		});


	With a promise library, callbacks such as the one just mentioned can be converted into:

		Q.fcall(promisedStep1)
		.then(promisedStep2)
		.then(promisedStep3)
		.then(promisedStep4)
		.then(function (value4) {
		    // Do something with value4
		})
		.catch(function (error) {
		    // Handle any error from all above steps
		})
		.done();	

	The power of chaining instead of nesting allows us to keep code more organized.

	Technically speaking, a promise is an object that provides a value or exception in the future for an operation that it wraps. The Promise API is used to wrap execution of an asynchronous method. A promise-based asynchronous function hence does not take callbacks but instead returns a promise object. This promise object gets resolved some time in the future when the data or error from the asynchronous operation is received.

	To consume a promise, the promise API in AngularJS exposes three methods:

		then(successCallback, errorCallback, notifyCallback): This registers callbacks for success, failure, and notification. The following are the parameters:

	        successCallback: This is called when the promise is resolved successfully. The callback function is invoked with the resolved value.

	        errorCallback: This is called when the promise results in an error and contains the reason for the error.

	        notifyCallback: This is called to report the progress of a promise. This is useful for long-running asynchronous methods that can communicate their execution progress.

	    catch(errorCallback): This is shorthand for then(null, errorCallback).

	    finally(callback): This gets called irrespective of a promise resulting in success or failure.

	Chaining of promises is possible because the then method itself returns a promise.

	The $interval service returns a promise. This promise is resolved after the $interval service invokes the callback method (the first argument) for $scope.currentExercise.duration (the third argument) and in our case, 30 times is the value for a normal exercise. Therefore, we can use the then method of the Promise API to invoke our exercise transition logic in the promise success callback parameter. 

		var startExercise = function (exercisePlan) {
		     $scope.currentExercise = exercisePlan;
		     $scope.currentExerciseDuration = 0;
		     $interval(function () {
		         ++$scope.currentExerciseDuration;
		     }, 1000, $scope.currentExercise.duration)
		     .then(function () {
		         var next = getNextExercise(exercisePlan);
		         if (next) {
		             startExercise(next);
		         } else {
		             console.log("Workout complete!")
		         }
		     });
		};











