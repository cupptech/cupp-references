describe('Shared Services', function(){
	beforeEach(module('app'));

	describe('Workout Service', function(){
		var WorkoutService, $httpBackend;
		var collectionUrl = "https://api.mlab.com/api/1/databases/workoutdb/collections";
		var apiKey = 'testKey';

        beforeEach(module(function (WorkoutServiceProvider, ApiKeyAppenderInterceptorProvider) {
            WorkoutServiceProvider.configure("workoutdb");
            ApiKeyAppenderInterceptorProvider.setApiKey("testKey")
        }));

        beforeEach(inject(function (_WorkoutService_, _$httpBackend_) {
            WorkoutService = _WorkoutService_;
            $httpBackend = _$httpBackend_;
        }));

        it("should load Workout service", function () {
            expect(WorkoutService).toBeDefined();
        });

        it("should request all workouts endpoints", function () {
            $httpBackend.expectGET(collectionUrl + "/workouts?apiKey=" + "testKey").respond([]);
        	$httpBackend.expectGET('partials/workout/start.html').respond(200);
            WorkoutService.getWorkouts();
            $httpBackend.flush();
        });

	});
});