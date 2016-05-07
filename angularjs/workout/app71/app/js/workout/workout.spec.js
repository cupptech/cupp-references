describe('Controllers', function(){

	beforeEach(module('app'));
	beforeEach(module('workout'));

	beforeEach(module(function($provide){
		$provide.factory('WorkoutService', function($q, WorkoutPlan, Exercise){
			var mock = {};
			mock.sampleWorkout = new WorkoutPlan({
				name: 'testworkout',
				title: 'Test Workout',
				description: 'This is a test workout',
				restBetweenExercise: '40',
                exercises: [{ details: new Exercise({ name: "exercise1", title: "Exercise 1", description: "Exercise 1 description", image: "/image1/path", nameSound: "audio1/path" }), duration: 50 },
                            { details: new Exercise({ name: "exercise2", title: "Exercise 2", description: "Exercise 2 description", image: "/image2/path", nameSound: "audio2/path" }), duration: 30 },
                            { details: new Exercise({ name: "exercise3", title: "Exercise 3", description: "Exercise 3 description", image: "/image3/path", nameSound: "audio3/path" }), duration: 20 }, ]
			});
			mock.getWorkout = function(name) {
				return $q.when(mock.sampleWorkout);
			};
			mock.totalWorkoutDuration = 180;
			return mock;
		});
	}));

	describe('WorkoutController', function(){
		var ctrl, $scope;

		beforeEach(function(){
			module(function($provide){
				$provide.value('workoutHistoryTracker', {startTracking: function(){}, endTracking: function(){} });
			});
		});

		beforeEach(inject(function($rootScope, $controller, $interval, $location, $timeout, workoutHistoryTracker, WorkoutService, appEvents, Exercise){
			$scope = $rootScope.$new();
			$scope.carousel = { next: function(){} };
			ctrl = $controller('WorkoutController', {
				$scope: $scope,
				$interval: $interval,
				$timeout: $timeout,
				workoutHistoryTracker: workoutHistoryTracker,
				appEvents: appEvents,
				WorkoutService: WorkoutService,
				$routeParams: { id: 'DummyWorkout' },
				Exercise: Exercise
			});

			spyOn(workoutHistoryTracker, 'startTracking');
			spyOn(workoutHistoryTracker, 'endTracking');
			spyOn($scope, '$emit');
			spyOn($scope.carousel, 'next');

			$scope.$digest();

		}));

		it('Should load the WorkoutController', function(){
			expect(ctrl).toBeDefined();
		});

		it('Should start the workout', inject(function(WorkoutService){
			expect($scope.workoutPlan).toEqual(WorkoutService.sampleWorkout);
			expect($scope.workoutTimeRemaining).toEqual(WorkoutService.totalWorkoutDuration);
			expect($scope.workoutPaused).toBeFalsy();
		}));

		it('should start the first exercise', inject(function(WorkoutService, appEvents){
			expect($scope.currentExercise).toEqual(WorkoutService.sampleWorkout.exercises[0]);
			expect($scope.currentExerciseIndex).toEqual(0);
			expect($scope.$emit).toHaveBeenCalledWith(appEvents.workout.exerciseStarted, 
				WorkoutService.sampleWorkout.exercises[0].details);
		}));

		it('should start history tracking', inject(function(workoutHistoryTracker){
			expect(workoutHistoryTracker.startTracking).toHaveBeenCalled();
		}));

		it('should increase current exercise duration with time', inject(function($interval, $httpBackend){
			$httpBackend.expectGET('partials/workout/start.html').respond(200);
			expect($scope.currentExerciseDuration).toBe(0);
			$interval.flush(1000);

			expect($scope.currentExerciseDuration).toBe(1);
			$interval.flush(1000);
			expect($scope.currentExerciseDuration).toBe(2);
			$interval.flush(8000);
			expect($scope.currentExerciseDuration).toBe(10);
		}));

        it("should decrease total workout duration with time", inject(function (WorkoutService, $interval, $httpBackend) {
			$httpBackend.expectGET('partials/workout/start.html').respond(200);
            expect($scope.workoutTimeRemaining).toBe(WorkoutService.totalWorkoutDuration);
            $interval.flush(1000);
            expect($scope.workoutTimeRemaining).toBe(WorkoutService.totalWorkoutDuration - 1);
            $interval.flush(1000);
            expect($scope.workoutTimeRemaining).toBe(WorkoutService.totalWorkoutDuration - 2);
        }));

	});


});