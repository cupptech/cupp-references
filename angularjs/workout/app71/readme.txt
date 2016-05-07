## Problem

	Testing in AngularJS
	Automate everything that can be automated.
	Unit testing

## Solution

    Unit testing: Unit testing is all about testing a component in isolation to verify the correctness of its behavior. Most of the dependencies of the component under test need to be replaced with mock implementations to make sure the unit tests do not fail due to failure in a dependent component.

    End-to-end testing: This type of testing is all about executing the application like a real end user and verifying the behavior of the application. Unlike unit testing, components are not tested in isolation. Tests are done against a running system in real browsers and assertions are done based on the state of the user interface and the content displayed.

    A good time to write E2E scenario tests is when the development is complete and ready to be deployed.

    The AngularJS testing ecosystem:

    As we can see, we write our tests using unit testing libraries such as Jasmine or Mocha. These tests are either executed by Karma or Protractor, depending upon whether we are writing unit or integration tests. These test runners in turn run these tests in a browser such as Chrome, Firefox, IE, or headless browsers such as PhantomJS. It is important to highlight that not only E2E but unit tests too are executed in a real browser.

    All the tests in this chapter are written using Jasmine (both unit and integration tests). Karma will be our test runner for unit tests and Protractor for E2E tests.

### Getting started with unit testing
	
	The ultimate aim of unit testing is to test a specific piece of code/component in isolation to make sure that components work according to specification.

		One unit should test one behavior. 
		
		Dependencies in a unit test should be mocked away. Unit testing, as the name suggests, should test the unit and not its dependencies.

		Unit tests should not change the state of the component being tested permanently. 

		The order of execution of unit tests should be immaterial. 

		Unit tests should be fast. If unit tests are not fast enough, developers will not run them. This is a good reason to mock all dependencies such as database access, remote web service call, and others in a unit tests.

		Unit tests should try to cover all code paths.

		Unit tests should test positive and negative scenarios. 

### Setting up Karma for unit testing

	Since the complete test automation infrastructure is supported using Node, this needs to be installed first.

	Install Karma:

		npm install karma --save-dev

	To use Karma from the command line, we need to install its command-line interface:

		npm install -g karma-cli


	Configuring Karma is all about setting up its configuration file that contains enough details for it to run our scripts and test them.

	Create a tests folder in the root (next to the app folder), navigate to it, and start the Karma configuration setup with the following command:

		karma init

	Once the wizard is complete, it generates a karma.config.js file.

	The Karma test runner by default uses Jasmine 1.3.x as the testing framework. We need to update it to v2.0, as we are going to use some features from v2.0. To update the Jasmine version used by Karma, update this package:

		npm install karma-jasmine@2_0 --save-dev

	Refer to the Karma documentation (http://karma-runner.github.io/0.8/config/configuration-file.html) to understand more about the various Karma configuration options.

	To unit test our app, the plan is to create one test (such as directives.spec.js) file for each JavaScript file that we have in our project. 

	Karma test runner will load these test scripts together with the standard app scripts. The files array configuration also contains a reference to the bower_components folder for all script files that were referenced through CDN, such as app/bower_components/angular/angular.js.

### Managing script dependencies with Bower

	Instead of downloading every CDN dependency manually and copying it to our app folder, we use Bower.

		npm install -g bower

	Copy the bower.json and .bowerrc files, download these dependencies:

		bower update

	Bower will download all the dependencies and add them to the bower_components folder inside the app folder. The download location (bower_components) has been configured in the .bowerrc file.

### Unit testing AngularJS components

Jasmine

	Look at the Jasmine framework documentation to understand how to write unit tests using Jasmine. We use Jasmine 2.0 for our unit tests (http://jasmine.github.io/2.0/introduction.html). Jasmine has one of the best documentations available and the overall framework is very intuitive to use. I strongly recommend you head over to the Jasmine site and get yourself familiar with the framework before you proceed.

Unit testing filters:

	filters.spec.js

		describe("Filters", function () {
		    beforeEach(module('7minWorkout'));
		    describe("secondsToTime filter", function () {
		       it('should convert integer to time format', 
		       inject(function ($filter) {
		            expect($filter("secondsToTime")(5)).toBe("00:00:05");
		            expect($filter("secondsToTime")(65)).toBe("00:01:05");
		    expect($filter("secondsToTime")(3610))
		    .toBe("01:00:10");
		        }));
		    });
		});	

		Module: This is an Angular library function exposed on the global level that allows us to create or load a module for unit tests. Since we are testing the secondsToTime filter defined in the workout module, we load this module using the module function in beforeEach.

		Inject: This complements module and is used to inject dependencies into a unit test.

	To run this test, start Karma from the command line with the following command:

		karma start tests/karma.config.js

	The module and inject functions are actually part of the ngMock module that is exclusively there to support unit testing. 


Unit testing using the ngMock module

	The ngMock module has been created specifically to support unit testing and it provides strong mocking capabilities.

	The reason behind creating mocks or mocking dependencies is to make sure that the component under the test does not fail due to the failure of any dependent component.

	The ngMock module itself comes with mock implementations for some of the standard AngularJS services such as $interval, $timeout, $httpBackend, and others.

Unit testing controllers
	
	Since unit testing is all about setting up the dependencies and then performing the actual tests, there is a decent amount of effort required to set up dependencies for controllers.

	Setting up controller dependencies, WorkoutController has a total of eight dependencies:

		'$scope', '$interval', '$location', 'workoutHistoryTracker', 'appEvents', 'WorkoutService', '$routeParams', 'Exercise'

	js/workout/workout.spec.js

		describe("Controllers", function () {
		    beforeEach(module('app'));

		    describe("WorkoutController", function () {
		        var ctrl, $scope;
		     beforeEach(inject(function ($rootScope, $controller, $interval, $location, workoutHistoryTracker, WorkoutService, appEvents, Exercise) {
		            $scope = $rootScope.$new();
		            $scope.carousel = {
		                next: function () {}
		            };
		            ctrl = $controller('WorkoutController', {
		                $scope: $scope,
		                $interval: $interval,
		                $location: $location,
		                workoutHistoryTracker: workoutHistoryTracker,
		                appEvents: appEvents,
		                WorkoutService: WorkoutService,
		                $routeParams: { id: "DummyWorkout" },
		                Exercise: Exercise
		            });
		        }));
		    });
		});			

	The app module initialization code, beforeEach(module('app'));, automatically initializes all dependent modules and hence does not require us to load dependent modules explicitly.

	The nested describe block (WorkoutController) is dedicated exclusively to test WorkoutController. The first beforeEach function inside this block is there to set up the controller dependencies.

	The beforeEach method takes the inject function that is used to inject a number of dependencies required to instantiate a controller. The first thing that the function does is to set up a new scope required for the controller by calling $rootScope.$new. This creates a new child scope. We keep the reference of this scope (in $scope) as we require it later.

	We use $controller to create a controller object during unit testing. The $controller service accepts the controller name and the required dependencies.

	Using the module function to mock two services: WorkoutHistoryTracker and WorkoutService:

		beforeEach(function () {
		  module(function ($provide) {
		    $provide.value("workoutHistoryTracker", {
		      startTracking: function () {}, endTracking: function () {}
		    });
		  });
		  });	

		beforeEach(module(function ($provide) {
		  $provide.factory("WorkoutService", function ($q, WorkoutPlan, ... Exercise) {
		     var mock = {};
		     mock.sampleWorkout = new WorkoutPlan({
		        name: "testworkout",
		        title: "Test Workout",
		        description: "This is a test workout",
		        restBetweenExercise: "40",
		        exercises: [ dummy exercise data]
		    });
		    mock.getWorkout = function (name) {
		        return $q.when(mock.sampleWorkout);
		    }
		    mock.totalWorkoutDuration = 180;
		    return mock;
		    });
		  }));

	The $provide service allows us to define services with the familiar service creation syntax that we have already seen in the Module API (such as module.factory and module.service). The $provide service supports all the service creation recipes, including constant, value, service, factory, and provider.

	As we can see, by registering the mock service implementation with the same name as the original services, we allow $provide to override/hide the original implementation from the two services.

	The mock implementation for WorkoutService is simple too. The only function that needs to be mocked is getWorkout, which returns a predefined workout. The $q.when function helps us to return the workout data as a promise.

	The $provide service provides a convenient mechanism to create mock and override dependencies. To know more about the $provide service, refer to the API documentation at https://code.angularjs.org/1.3.3/docs/api/auto/object/$provide.

Unit testing WorkoutController

	it("should start the workout", inject(function (WorkoutService) {
	expect($scope.workoutPlan)
	    .toEqual(WorkoutService.sampleWorkout);
	    expect($scope.workoutTimeRemaining)
	    .toEqual(WorkoutService.totalWorkoutDuration);
	expect($scope.workoutPaused).toBeFalsy();
	}));

	This test asserts that if the correct workout plan is loaded in the scope, the total duration of the workout is correct, and the workout is in the running state. Note how we use the mock properties: sampleWorkout and totalWorkoutDuration of WorkoutService to test the expectations.

Debugging unit tests in Karma

	When Karma starts, it opens the specific browser window to run the tests. To debug any test in Karma, we just need to click on the Debug button available on the top navigation in the browser window.

	Once we click on Debug, a new tab/window opens that has all the tests and other app scripts loaded for testing. These are scripts that were defined during Karma configuration setup in the karma.config.js files section.

	To debug the preceding failure, we need to add breakpoints at two locations. One should be added inside the test itself, and the second one inside WorkoutController where it loads the workout and assigns the data to appropriate scope variables.

	As the number of tests grows, unit testing may require us to concentrate on a specific test or a specific suite of tests. Karma allows us to target one or more tests by prepending i to existing it block, that is, it become iit. If Karma finds tests with iit, it only executes those tests. Similarly, a specific test suite can be targeted by prepending d to the existing describe block, ddescribe.

workout.spec.js

	it("should start the first exercise", inject(function (WorkoutService, appEvents) {
		expect($scope.currentExercise)
		.toEqual(WorkoutService.sampleWorkout.exercises[0]);
		expect($scope.currentExerciseIndex).toEqual(0);
	    expect($scope.$emit).toHaveBeenCalledWith(appEvents.workout.exerciseStarted, WorkoutService.sampleWorkout.exercises[0].details);
	}));	

Using Jasmine spies to verify dependencies

	In the Jasmine world, spies help us assert whether dependencies were invoked.

	A spy is an object that intercepts every call to the function it is spying on. Once the call is intercepted, it can either return fixed data or pass the call to the actual function being invoked. It also records the call invocation details that can be used later in expect as we did in the preceding test.

	If we look at the WorkoutController implementation, we emit a message with the details of the workout whenever the workout starts. WorkoutHistoryTracker subscribes to this message/event. The last expect function verifies that the $scope.$emit function was called when the workout started (toHaveBeenCalledWith). It is also asserting the correctness of the parameters passed to the $emit function.

	The last expect statement asserts the behavior on the spy, but we first need to set up the spy to make this assert work. Before the $scope.$digest(); statement, add the following line to the beforeEach block that has the controller creation code:

		spyOn($scope, "$emit");

	The spyOn function sets up the functions that Jasmine will spy on. It takes the object to target and the function to spy on as the first and second argument, respectively. With the preceding statement, every time we call $scope.$emit, the spy intercepts the call and records it. Run the test and it should pass.

		spyOn(workoutHistoryTracker, 'startTracking');

		it("should start history tracking", inject(function (workoutHistoryTracker) {
		  expect(workoutHistoryTracker.startTracking)
		  .toHaveBeenCalled();
		}));

Testing the $interval and $timeout implementations

	Unit testing code that uses $interval or $timeout is difficult. This is due to the asynchronous nature of the code and the actual time delay that is required. The Angular team realized this and created mocks for both $timeout and $interval. If we inject the ngMock module, then the original $timeout and $interval services are replaced by the mock ones.

		$interval.flush(5000);	 // flushes 5 second	

	Therefore, the following code outputs with intervals firing five times:

		$interval(function () { console.log("interval fired");}, 2000);
		$interval.flush(10000); // flushes 10 second

	WorkoutController:

		var startExerciseTimeTracking = function () {
		var promise = $interval(function () {
		     ++$scope.currentExerciseDuration;
		     --$scope.workoutTimeRemaining;}, 1000,
		$scope.currentExercise.duration - $scope.currentExerciseDuration);

	Add this test to the exiting WorkoutController test suite:

		it("should increase current exercise duration with time", inject(function ($interval) {
		expect($scope.currentExerciseDuration).toBe(0);
		   $interval.flush(1000);
		   expect($scope.currentExerciseDuration).toBe(1);
		   $interval.flush(1000);
		   expect($scope.currentExerciseDuration).toBe(2);
		   $interval.flush(8000);
		   expect($scope.currentExerciseDuration).toBe(10);
		}));

	Check whether exercise transitioning:

	it("should transition to next exercise on one exercise complete", inject(function (WorkoutService, $interval) { 
	  	$interval.flush(WorkoutService.sampleWorkout.exercises[0].duration * 1000);
		expect($scope.currentExercise.details.name).toBe('rest'); expect($scope.currentExercise.duration).
		    toBe(WorkoutService.sampleWorkout.restBetweenExercise);
	}));

Testing workout pause/resume:

	When we pause a workout, it should stop/cancel the running $interval service and the time counter should not lapse.

		it("should not update workoutTimeRemaining for paused workout on interval lapse", inject(function (WorkoutService, $interval) {
		  expect($scope.workoutPaused).toBeFalsy();
		  $interval.flush(1000);
		  expect($scope.workoutTimeRemaining).
		  toBe(WorkoutService.totalWorkoutDuration - 1);
		  $scope.pauseWorkout();
		  expect($scope.workoutPaused).toBe(true);
		  $interval.flush(5000);             
		  expect($scope.workoutTimeRemaining).
		    toBe(WorkoutService.totalWorkoutDuration - 1);
		}));	

Unit testing services

	We will target WorkoutService and write some unit tests for it. Since this service makes remote requests to load workout data, we will explore how to test such a service with a mock HTTP backend.

	AngularJS has a service for that: $httpBackend, which is again part of the ngMock module.

Mocking HTTP request/response with $httpBackend

	Using $httpBackend, we intercept HTTP requests, mock actual responses from the server, and assert endpoints invocation too. 

	The $httpBackend service has two sets of methods to mock the backend:

	Functions for Request Expectations: These methods start with the word expect, for example, expect, expectGET, expectPOST, expectHEAD, expectDELETE, expectPUT, and expectPATCH.

		it("it should get google home",function() {
		  $httpBackend.expectGET("http://www.google.com")
		  service.getData();
		  $httpBackend.flush();
		});	

		The test fails if getData does not make a request to www.google.com. We do not need to set up any Jasmine spy or explicitly assert using expect. Such a setup is useful if we want to assert whether an HTTP request was actually made.

	Functions for backend definitions: These methods start with the word when, for example, when, whenGET, whenPOST, whenHEAD, whenDELETE, whenPUT, and whenPATCH. Their primary aim is to provide a mock backend that responds with data when a request is made. These functions do not assert whether invocation actually happened or not. This setup helps when we want to just mock remote calls, but are not interested in whether a call was made or not.

	To provide a mock return value for an HTTP invocation, we need to call the respond function on the object returned by the expect* or when* function, such as:

		$httpBackend.whenGET("http://api.endpoint.com").respond(200, {data:'data'});

Testing WorkoutService

	js/shared/services.spec.js

		describe("Shared Services", function () {
		    beforeEach(module('app'));
		    describe("Workout Service", function () {
		        var WorkoutService, $httpBackend,
		        collectionUrl = "https://api.mongolab.com/api/1/databases/testdb/collections",
		        apiKey = "testKey";
		        beforeEach(module(function (WorkoutServiceProvider, 
		        ApiKeyAppenderInterceptorProvider) {
		           WorkoutServiceProvider.configure("testdb");
		        ApiKeyAppenderInterceptorProvider.setApiKey("testKey")
		    }));

		  beforeEach(inject(function (_WorkoutService_, _$httpBackend_) {
		     WorkoutService = _WorkoutService_;
		     $httpBackend = _$httpBackend_;
		    }));
		    });
		});

	The module function call is different this time; we are passing in a function instead of passing in a module name to load. We are passing in an anonymous module initialization function. The function gets called during the configuration stage of app bootstrapping (evident from the providers passed to it) and sets up the necessary dependencies.

	The second block also has something interesting: the prefix and suffix _ character in the inject function. They still represent the same WorkoutService and $httpBackend dependencies. Angular strips the _ character before searching for the actual dependency and injects the correct one. This syntax of dependency injection is useful when we want to use the same variable names as the dependency names, such as WorkoutService and $httpBackend that we declare at the top of the describe block.

	Make sure that the correct endpoint is hit when getWorkouts is invoked:	

		it("should request all workouts endpoints", function () {
		    $httpBackend.expectGET(collectionUrl + "/workouts?apiKey=" + 
		      "testKey").respond([]);
		    WorkoutService.getWorkouts();
		    $httpBackend.flush();
		});

	Write a test for the service function getWorkout that loads workouts with a specific name. We plan to check whether the data is being returned correctly and mapped to the correct WorkoutPlan model. 

		it("should return a workout plan with specific name",  inject(function (WorkoutPlan, $q) {
		    spyOn(WorkoutService.Exercises, "query").and.returnValue({
		      $promise: $q.when([{ name: "exercise1",title: "exercise 1"
		 }])
		    });
		    $httpBackend.expectGET(collectionUrl + 
		        "/workouts/testplan?apiKey=" + "testKey")
		    .respond({
		          name: "Workout1", title: "Workout 1",
		          restBetweenExercise: 30
		        });
		    var result = null;
		    WorkoutService.getWorkout("testplan")
		        .then(function (workout) { result = workout;});

		    $httpBackend.flush();
		    expect(result.name).toBe("Workout1");
		    expect(result instanceof WorkoutPlan).toBe(true);
		    expect(WorkoutService.Exercises.query).toHaveBeenCalled();
		}));	

	The flush function simulates the HTTP call, triggers the promise success callback, and result has some value. 

	One last thing that we should add when testing services that use $http or $resource service is the following code block:

		afterEach(function () {
		  $httpBackend.verifyNoOutstandingExpectation();
		    $httpBackend.verifyNoOutstandingRequest();
		});

Unit testing directives

	The pattern to follow while unit testing directives is as follows:
	1. Take an HTML fragment with the directive markup.
	2. Compile and link it to a specific scope.
	3. Verify that the generated HTML has the required attributes. This can be done using jQlite or jQuery library functions.
	4. If the directive creates scope and/or changes the state of the scope, verify the changes.

	js/shared/directives.spec.js

	Declared global services: $compile, $scope, and $rootScope, and set them up in beforeEach for our tests to follow.

		describe("Directives", function () {
		    var $compile, $rootScope, $scope;
		    beforeEach(module('app'));

		    beforeEach(inject(function (_$compile_, _$rootScope_) {
		        $compile = _$compile_;
		        $rootScope = _$rootScope_;
		        $scope = $rootScope.$new();
		    }));
		});

	Testing remote-validator

		remote-validator validates an input against remote rules. It does so by calling a function on the scope that returns a promise. If the promise is resolved with success, validation passes; otherwise, validation fails. The scope function invoked is linked to the directive through the remote-validator-function directive attribute.

			describe("remote validator", function () {
			var inputElement;
			beforeEach(inject(function () {
			  $scope.validate = function (value) {};
			     inputElement = "<form name='testForm'><input type='text' name='unique' ng-model='name' remote-validator='unique' remote-validator-function='validate(value)' /></form>";
			   }));

			it("should verify unique value when use input changes", 
			 inject(function ($q) {
			   spyOn($scope, "validate").and.returnValue($q.when(true));
			   	   $compile(inputElement)($scope);
			      $scope.testForm.unique.$setViewValue("dummy");
			      expect($scope.validate).toHaveBeenCalled();
			    }));
			   });
			});

		The remote-validator test suite (the describe block) first sets up the scope with a dummy validation function (validate) and the input markup that contains the directive declaration, as highlighted in the preceding code. The reason we have wrapped the input in the form tag is due to the fact we want to access NgModelController for input to perform our assertions.

		The unit first sets a spy on the validate function as the function is linked to remote-validator. The test then compiles the input element and links it to a scope. This results in the creation of a form (testForm) and a model (unique) controller on the scope.

		To simulate an actual input and verify whether the validation function is being invoked, the test uses $setViewValue available on the model controller (NgModelController). This internally triggers the parser pipeline, and hence our remote-validator parser function.

		For directives of Angular 1.3, $setViewValue triggers both the parser pipeline and all the validators attached to NgModelController. The validators are not part of the parser pipeline but do get evaluated.


	Verify some behavior of remote-validator when validation fails:

		it("verify failed 'unique' validation should set model controller 
		invalid.", inject(function ($q) {
		    spyOn($scope, "validate").and.returnValue($q.reject());
		    $compile(inputElement)($scope);
		    $scope.testForm.unique.$setViewValue("dummy");
		 expect($scope.validate).toHaveBeenCalled();
		    $scope.$digest();

		    expect($scope.testForm.$valid).toBe(false);
		    expect($scope.testForm.unique.$valid).toBe(false);
		    expect($scope.testForm.unique.$error.unique).toBe(true);
		}));	

		The next call to $scope.$digest() is required to sync the model as the validate call is asynchronous. Once the digest cycle is done, we can assert for the state of the form and model controllers and even confirm that the error object hash has the necessary failed validation.

Testing remote-validator and busy-indicator together

		describe("remote validator with busy indicator", function () {
		  var inputElement;
		  beforeEach(inject(function ($q) {
		$scope.validate = function (value) {};
		inputElement = "<form name='testForm'><div busy- indicator=''><input type='text' name='unique' ng-model='name' remote-validator='unique' remote-validator-function='validate(value)' /></div></form>";
		  }));

		  it("should show busy indicator when remote request is made 
		  and hide later", function () {
		   var defer = $q.defer(),
		       html = $compile(inputElement)($scope),
		       childElementScope = html.children().scope();

		   spyOn($scope, "validate").and.returnValue(defer.promise);

		   expect(childElementScope.busy).toBeUndefined();

		   $scope.testForm.unique.$setViewValue("dummy");
		   expect(childElementScope.busy).toBe(true);

		   defer.resolve(true);
		   $scope.$digest();

		   expect(childElementScope.busy).toBe(false);

		  }));
		});	

		At the start of the test, we create a custom promise using the defer API. This is the promise that the validate function returns in the spy setup.

		We compile and link the HTML file against the current $scope service. Since the busy indicator creates a child scope (as you can see in the definition, it has scope:true), we need to get hold of it for future asserting. The statement html.children().scope() does the magic and assigns it to childElementScope.

		https://code.angularjs.org/1.3.3/docs/api/ng/function/angular.element.

		Once everything is set up, we assert the state of the busy flag after firing $setViewValue. Calling $setViewValue triggers a call to the validate function. We immediately assert if the busy flag is set to true, as remote validation is in progress.

		We then resolve the custom promise (marking remote validation complete), run a digest cycle, and assert whether the busy indicator flipped back to false. All these assertions are done on the child scope (childElementScope).

Testing directives with templateUrl

	We can manually prep the $templateCache service. For this, we need to copy the HTML content from each template file, create a string representation, and then add it to $templateCache manually.

	Something like this can be used:

		$templateCache.put('/partials/workoutbuilder/workout-tile.html', '<div>templatehtml</div>');

	Karma has the concept of preprocessors. Preprocessors allow us to manipulate files before they are loaded in a browser for testing. There is a preprocessor that can help us here. The karma-ng-html2js-preprocessor plugin (https://github.com/karma-runner/karma-ng-html2js-preprocessor) converts HTML files into the JavaScript template and makes them available for testing.

		npm install karma-ng-html2js-preprocessor --save-dev

	update the karma.config.js:

		files: [
		  //existing file references
		  'app/partials/**/*.html', // Add this path reference.
		],
		  preprocessors: {
		  'app/partials/**/*.html': ['ng-html2js'] //add this
		},

		  // Add this new property
		  ngHtml2JsPreprocessor: {
		  // strip this from the file path
		  stripPrefix: 'app',
		},

	By adding the folder reference for HTML partials in the Karma files section ('app/partials/**/*.html'), we instruct Karma to load these partials before testing starts. This allows preprocessors to work on them.

	The ngHtml2JsPreprocessor property added later contains configurations specific to the preprocessor. The only configuration it has is stripPrefix. This setting strips away the app string from the template name (which is also the template path) before adding it to $templateCache. 

	Internally, the preceding preprocessor creates a script file for each HTML template. Each script file has one Angular module. The only thing the module does is to add the string representation of HTML to $templateCache. 

	directives.spec.js

		describe("Directives", function () {
		    var $compile, $rootScope, $scope;

		    beforeEach(module('app'));
		  beforeEach(module('/partials/workoutbuilder/workout-tile.html'));

		    beforeEach(inject(function (_$compile_, _$rootScope_) {
		        $compile = _$compile_;
		        $rootScope = _$rootScope_;
		        $scope = $rootScope.$new();
		    }));

		    describe("Workout tile", function () {
		      it("should load workout tile directive", 
		        inject(function ($templateCache) {
		         var e = $compile("<workout-tile></workout-tile")($scope);
		         $scope.$digest();
		         expect(e.html().indexOf('class="duration"') > 0);
		      }));
		    });

		});

	Testing the directive then becomes a simple affair. We compile and link the directive and assert whether the directive is loaded correctly, this time by verifying the HTML content. That is pretty much it.

Unit testing routes and resolve

	We can test the route configuration and make sure the correct path, route, and controller are set when the route changes. For routes with resolve, we can check if the associated resolve functions were actually invoked.

	config.spec.js

		describe("Trainer routes", function () {
		    beforeEach(module('app'));

		    it("should default to start workout route", 
		    inject(function($rootScope,$location,$route,$httpBackend) {
		      $httpBackend.whenGET("partials/workout/start.html")
		      .respond("<div/>");
		           $location.path("/");
		           $rootScope.$digest();
		           expect($location.path()).toBe("/start");
		           expect($route.current.templateUrl)
		           .toBe("partials/workout/start.html");
		            expect($route.current.controller).toBeUndefined();
		    }));
		});

	The next step uses location.path to navigate to the root. The expectation here is that, due to the following route setup, the route is automatically set to start route.

	The next line $rootScope.$digest is required. Without this call, the transition does not happen. Once the digest cycle is complete, we assert the correctness of the new path.

	Note the $route injection that we have used in the test. Without injecting $route, the actual transition does not happen. The $location service just triggers route transition. After the transition, we check location and the current route properties to confirm that the route change worked.

	Let's now try to test a route that has parameters:

		it("should load the workout.", inject(function ($rootScope, $location, $route, $httpBackend) {
		  $httpBackend.whenGET("partials/workout/workout.html")
		  .respond("<div/>");
		  $location.path("/workout/dummyWorkout");
		    $rootScope.$digest();
		    expect($location.path()).toBe("/workout/dummyWorkout");
		    expect($route.current.params.id).toBe('dummyWorkout');
		}));

		we assert that the location path is set correctly and the route parameters have been set correctly ($route.current.params.id).

	Test whether the resolved route is firing correctly and on the correct path:

		it("should start workout building when navigating to workout builder route.", inject(function ($rootScope, $location, $route, 
		  $httpBackend,WorkoutBuilderService) {
		    spyOn(WorkoutBuilderService, "startBuilding"); $httpBackend.whenGET("partials/workoutbuilder/workout.html")
		    .respond("<div/>");

		    $location.path("/builder/workouts/new");
		    $rootScope.$digest();
		    expect($location.path()).toBe("/builder/workouts/new");
		    expect(WorkoutBuilderService.startBuilding)
		    .toHaveBeenCalled(); expect(WorkoutBuilderService.startBuilding.calls.count())
		    .toBe(1);
		}));

	To verify that the route resolve was called, instead of creating a mock for WorkoutBuilderService, we inject the real service but set up a spy on it to make sure the startBuilding function is called inside resolve.


karma-spec-reporter

	npm install karma-spec-reporter --save-dev

	and adding this my karma.config.js

	reporters: ['spec'],

	According to karma documentation

	By default, Karma loads all NPM modules that are siblings to it and their name matches karma-*.
	but some users have had to add the following to their config

	plugins: ['karma-spec-reporter']	




