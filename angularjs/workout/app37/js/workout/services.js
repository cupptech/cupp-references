'use strict';

/* services */

angular.module('workout')
	.factory('workoutHistoryTracker',['$rootScope', 'appEvents', 'localStorageService', 
			function($rootScope, appEvents, localStorageService){

		var storageKey = 'workouthistory';
		var maxHistoryItems = 20;
		var workoutHistory = localStorageService.get(storageKey) || [];
		var currentWorkoutLog = null;
		var service = {};

		service.startTracking = function(){
			currentWorkoutLog = {
				startedOn: new Date().toISOString(),
				completed: false,
				exercisesDone: 0
			};

			if (workoutHistory.length >= maxHistoryItems) {
				workoutHistory.shift();
			}

			workoutHistory.push(currentWorkoutLog);
			localStorageService.add(storageKey, workoutHistory);
		};

		service.endTracking = function(completed) {
			currentWorkoutLog.completed = completed;
			currentWorkoutLog.endedOn = new Date().toISOString();
			currentWorkoutLog = null;
			localStorageService.add(storageKey, workoutHistory);
		};

		service.getHistory = function(){
			return workoutHistory;
		};

		$rootScope.$on(appEvents.workout.exerciseStarted, function(e, args){
			currentWorkoutLog.lastExercise = args.title;
			++currentWorkoutLog.exercisesDone;
			localStorageService.add(storageKey, workoutHistory);
		});

		$rootScope.$on('$routeChangeSuccess', function(e, args){
			if (currentWorkoutLog) {
				service.endTracking(false); // End the current tracking if in progress the route changes.
			};
		});

		return service;

	}]);

angular.module('workout')
	.value('appEvents', {
		workout: {exerciseStarted: "event:workout:exerciseStarted" }
	});