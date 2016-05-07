## Problem

	Workout history tracking using Angular services:

	What if we can track the workout history? When did we last exercise? Did we complete it? How much time did we spend?

## Solution

	Tracing workout history requires us to track workout progress. Somehow, we need to track when the workout starts and stops. This tracking data then needs to be persisted somewhere.

	Historical data tracking does not require a controller, so instead we will be using a service to track historical data and share it across all app controllers. 

### AngularJS services

	 Services in Angular are reusable (mostly non-UI) components that can be shared across controllers, directives, filters, and other services. 

	 - A reusable piece of code that is used across AngularJS constructs
	 - Singleton in nature
	 - Created on demand
	 - Can be used to share state across the application

### Creating AngularJS services

	Both the constant and value services are used to create values/objects in Angular. With the Module API, we can use the constant and value functions respectively to create a constant and value service. 

		angular.module('app').constant('myObject', {prop1:"val1", prop2:"val2"});
		angular.module('app').value('myObject', {prop1:"val1", prop2:"val2"});

	The one difference between the constant and value service is that the constant service can be injected at the configuration stage of the app whereas the value service cannot.

	Creating services using a service:

		angular.module('app').service('MyService1',['dep1',function(dep1) {
	      this.prop1="val1";
	      this.prop2="val2";
	      this.prop3=dep1.doWork();
	  	}]);

	The previous service is invoked like a constructor function by the framework and cached for the lifetime of the app.

	Creating services with a factory service:

	This mechanism of service creation uses a factory function. This function is responsible for creating the service and returning it. Angular invokes this factory function and caches the return value of this function as a service object:

		angular.module('app').factory('MyService2', ['dep1', function (dep1) {
		    var service = {
		        prop1: "val1",
		        prop2: "val2",
		        prop3: dep1.doWork()
		    };
		    return service;
		});

	Creating services with a provider service:

	The provider recipe gives us the maximum control over how a service is created and configured. 

	In this method, the framework first creates a custom object that we define. This object should have a property $get (which itself is injectable) that should be the factory function as mentioned earlier. The return value of the $get function is the service instance of the desired service. 

		angular.module('app').provider('myService3', function () {
		    var prop1;
		    this.setIntialProp1Value = function (value) {
		        prop1 = value; // some initialization if required
		    };
		    this.$get = function (dep1) {
		        var service = {
		            prop1: prop1,
		            prop2: dep1.doWork(),
		            prop3: function () {}
		        };
		        return service;
		    };
		});

	We define this piece of code as a provider service, myService3. Angular will create an object of this provider and call the $get factory function on it to create the actual service object. Note that we are injecting dependencies in the $get method, and not in the provider service declaration.

	The final outcome is the same as myService1 and myService2 except that the provider allows us to configure the service creation at the configuration stage. The following code shows how we can configure the initial value of the prop1 property of the myService3 service:

		angular.module('app').config(function (myService3Provider) {
		    myService3Provider.setIntialProp1Value("providerVal");
		});

	The name of the dependency we have passed; it is myService3Provider and not myService3.

	When should we use the provider recipe? Well, the provider syntax is useful only if we need to set up/initialize parts of the service before the service can be consumed. The $route service is a good example of it. We use the underlying $routeProvider to configure the routes before they can be used in the app.

### Implementing workout history tracking

	services.js

		angular.module('7minWorkout')
		    .factory('workoutHistoryTracker', ['$rootScope', function ($rootScope) {
		      var maxHistoryItems = 20;   //Track for last 20 exercise
		      var workoutHistory = [];
		      var currentWorkoutLog = null;
		      var service = {};
		      return service;
		}]);

	The only dependency injection allowed in a service from a scope perspective is $rootScope, which has a lifetime similar to the service lifetime.

	We now understand that injecting current scope ($scope) in a service is not allowed. Even calling a service method by passing the current $scope value as a parameter is a bad idea. Calls such as the following in controller should be avoided:

		myService.updateUser($scope);

	Instead, pass data explicitly, which conveys the intent better.

		myService.updateUser({first:$scope.first, last:$scope.last, age:$scope.age});

	If we pass the current controller scope to the service, there is always a possibility that the service keeps the reference to this scope. Since services are singleton, this can lead to memory leaks as a scope does not get disposed of due to its reference inside the service.

	Add two methods: startTracking and endTracking on the service object, as follows:

		service.startTracking = function () {
		    currentWorkoutLog = { startedOn: new Date().toISOString(), 
			completed: false, 
			exercisesDone: 0 };
			if (workoutHistory.length >= maxHistoryItems) {
			        workoutHistory.shift();
		    }
		    workoutHistory.push(currentWorkoutLog);
		};

		service.endTracking = function (completed) {
		    currentWorkoutLog.completed = completed;
		    currentWorkoutLog.endedOn = new Date().toISOString();
		    currentWorkoutLog = null;
		};

	Add another service function getHistory that returns the workoutHistory array:

		service.getHistory = function () {
		  return workoutHistory;
		}

	Add an event subscriber:

		$rootScope.$on("$routeChangeSuccess", function (e, args) {
		    if (currentWorkoutLog) {
		        service.endTracking(false); // End the current tracking if in progress the route changes.
		    }
		});

	Lastly, include the services.js reference in index.html after the filters.js reference.

		<script src="js/7MinWorkout/services.js"></script>

### Integrating the WorkoutHistoryTracker service with a controller

	Add this line inside the startWorkout function:

		workoutHistoryTracker.startTracking();
		$scope.currentExerciseIndex = -1;
		startExercise($scope.workoutPlan.exercises[0]);

	We now need to stop tracking at some point. Find the function startExerciseTimeTracking and replace $location.path('/finish'); with workoutComplete();. Then, go ahead and add the workoutComplete method:

		var workoutComplete = function () {
			workoutHistoryTracker.endTracking(true);
			$location.path('/finish');
		}

### Adding the workout history view

index.html

	<body ng-app="app" ng-controller="RootController">

	<ul class="nav navbar-nav navbar-right"> <li>
	  <a ng-click="showWorkoutHistory()" title="Workout History">History</a>
	</li></ul>

	As the previous declaration suggests, we need to add a new controller RootController to the app. Since it is declared alongside the ng-app directive, this controller will act as a parent controller for all the controllers in the app. The current implementation of RootController opens the modal dialog to show the workout history.

root.js

workout-history.html


