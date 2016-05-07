
## Problem

	Displaying the remaining workout time using filters
	Add a countdown timer somewhere in the exercise pane that shows the overall time remaining.

	The approach that we are going to take here is to define a scope variable workoutTimeRemaining. This variable will be initialized with the total time at the start of the workout and will reduce with every passing second till it reaches zero.

	Since workoutTimeRemaining is a numeric value but we want to display a timer in the format (hh:mm:ss), we need to do a conversion between the seconds data and the time format. AngularJS filters are a great option for implementing such features.

## Solution

### Creating a seconds-to-time filter

Instead of using a filter, we could implement the same logic in a method such as convertToTime(seconds) and bind this method to the UI using something like <h2>{{convertToTime(workoutTimeRemaining)}}</h2>; it would have worked perfectly. 

Understanding AngularJS filters

	The primary aim of an Angular filter is to format the value of an expression displayed to the user. Filters can be used across views, services, controllers, and directives. This is how we use a filter in a view:

		{{ expression | filterName : inputParam1 }}

	An expression is followed by the pipe symbol |, which is followed by the filter name and then an optional parameter (inputParam1) separated by a colon (:). Here are some examples of the date filter. Given this date 7 August 2014, 10:30:50 in the current time zone:

		$scope.myDate=new Date(2014,7,7,10,30,50);

		<br>{{myDate}} <!--2014-08-07T05:00:50.000Z-->
		<br>{{myDate | date}}  <!--Aug 7, 2014-->
		<br>{{myDate | date : 'medium'}}  <!--Aug 7, 2014 10:30:50 AM-->
		<br>{{myDate | date : 'short'}}  <!--8/7/14 10:30 AM-->
		<br>{{myDate | date : 'd-M-yy EEEE'}} <!--7-8-14 Thursday-->

	Use filters inside services, controllers, or directives:

		function MyController($scope, dateFilter)
		$scope.myDate1 = dateFilter(new Date(2014,8,7),"MMM d, yyyy"); 

	Use an inbuilt $filter service:

		function MyController($scope, $filter)
		$scope.myDate2 = $filter("date")(new Date(2014,8,7),"MMM d, yyyy");

### Implementing the secondsToTime filter

	Convert a numeric value into hh:mm:ss format. 

		angular.module('workout').filter('secondsToTime', function () {
		    return function (input) {
		        var sec = parseInt(input, 10);
		        if (isNaN(sec)) return "00:00:00";

		        var hours = Math.floor(sec / 3600);
		        var minutes = Math.floor((sec - (hours * 3600)) / 60);
		        var seconds = sec - (hours * 3600) - (minutes * 60);

		        return ("0" + hours).substr(-2) + ':'
		                + ("0" + minutes).substr(-2) + ':'
		                + ("0" + seconds).substr(-2);    
			}
		});	

	The function takes two arguments: the name of the filter and a filter function. Our filter function does not take any dependency but we have the capability to add dependencies to this function. The function should return a factory function that is called by the framework with the input value. This function (function (input)) in turn should return the transformed value.

	Implement the workout time remaining logic in our controller:

		function WorkoutPlan(args) {
		  //existing WorkoutPlan constructor function code
		  this.totalWorkoutDuration = function () {
		    if (this.exercises.length == 0) return 0;
		    var total = 0;
		    angular.forEach(this.exercises, function (exercise) {
		        total = total + exercise.duration;
		    });
		    return this.restBetweenExercise * (this.exercises.length - 1) + total;
		} 

	We assign totalWorkoutDuration for the workout plan to $scope.workoutTimeRemaining and at the end of the method before calling startExercise, we add another $interval service to decrement this value after every second, for a total of workoutTimeRemaining times:

		var startWorkout = function () {
		  workoutPlan = createWorkout();
		  $scope.workoutTimeRemaining = workoutPlan.totalWorkoutDuration();

		    // Existing code. Removed for clarity

		    $interval(function () {
		        $scope.workoutTimeRemaining = $scope.workoutTimeRemaining - 1;
		    }, 1000, $scope.workoutTimeRemaining);

		    startExercise(workoutPlan.exercises.shift());
		};

	workout.html

		<div class="workout-display-div">
  			<h4>Workout Remaining - {{workoutTimeRemaining | secondsToTime}}</h4>
  			<h1>{{currentExercise.details.title}}</h1>

  	Now, every time the expression workoutTimeRemaining changes, the filter will execute again and the view will get updated. 


  	
