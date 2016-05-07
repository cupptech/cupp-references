## Problem

	E2E testing

## Solution

	The process of E2E testing a web-based application is about running the application in a real browser and asserting the behavior of the application based on the user interface state. This is how an actual user does testing.

	Browser automation holds the key here and modern browsers have become smarter and more capable in terms of supporting automation. Selenium tools for browser automation are the most popular option out there. Selenium has the WebDriver (http://www.w3.org/TR/2013/WD-webdriver-20130117/) API that allows us to control the browser through automation API that modern browsers natively support.

	The reason behind bringing up Selenium WebDriver is due to the fact that the Angular E2E testing framework/runner Protractor also uses WebDriverJS, which is a JavaScript binding of WebDriver on Node.

### Introduction to Protractor

	Protractor is the de facto test runner for E2E testing in Angular. Protractor uses Selenium WebDriver to control a browser and simulate user actions.

	A typical Protractor setup has the following components:

    	A test runner (Protractor)

    	A Selenium Server

    	A browser	

	We write our test in Jasmine and use some objects exposed by Protractors (which is a wrapper over WebDriverJS) to control the browser.

	When these tests run, Protractor sends commands to the Selenium server. This interaction happens mostly over HTTP.

	The Selenium server, in turn, communicates with the browser using the WebDriver Wire Protocol and internally the browser interprets the action commands using the browser driver (such as ChromeDriver in the case of Chrome).

	It is not that important to understand the technicalities of this communication, but we should be aware of the E2E testing setup. Check the article from Protractor documentation at http://angular.github.io/protractor/#/infrastructure to learn more about this flow.

	Another important thing to realize when using Protractor is that the overall interaction with the browser or the browser control flow is asynchronous in nature and promise-based. Any HTML element action, be it sendKeys, getText, click, submit, or any other, does not execute at the time of invocation; instead the action is queued up in a control flow queue. For this precise reason, the return value of every action statement is a promise that gets resolved when the action completes.

	To handle this asynchronicity in Jasmine tests, Protractor patches Jasmine and therefore assertions like these work:

		expect(element(by.id("start")).getText()).toBe("Select Workout");

### Setting up Protractor for E2E testing
	
		npm install -g protractor@2

			You need protractor version 2.

			From https://github.com/angular/protractor#compatibility

	This installs two command-line tools: Protractor and webdriver-manager. Run the following command to make sure Protractor is set up correctly:

		protractor --version

	Webdriver-manager is a helper tool to easily get an instance of a running Selenium server. Before we start the Selenium server, we need to update the driver binaries with the following call:

		webdriver-manager update

	Finally, run this command to start the Selenium server:

		webdriver-manager start

	Protractor tests send requests to this server to control a local browser.

	Make sure that the Selenium server is running at all times during E2E testing. This can be verified by checking the status of the server at http://localhost:4444/wd/hub (default location).

	protractor.config.js
	The configuration file documentation on the Protractor website (https://github.com/angular/protractor/blob/master/docs/referenceConf.js) contains details on the other supported configurations.

### Writing E2E tests for the app

	http://localhost:8080/#/start
	http://localhost:8080/index.html#/start

	tests/e2e/workout-runner.spec.js

		describe("Workout Runner", function () {
		    describe("Start Page", function () {
		        beforeEach(function () {
		            browser.get("");
		        });
		        it("should load the start page.", function () {
		            expect(browser.getTitle()).toBe("Personal Trainer");
		            expect(element(by.id("start")).getText())
		       .toBe("Select Workout");
		        });
		    });
		});		

	Before we execute our first test, make sure the Selenium server is running (webdriver-manager start) and the app is running.

		protractor tests/protractor.conf.js

	Protractor will open the browser; navigate to the start page; wait for the page, the scripts, and the framework to load; and then perform the test. It finally logs the results of the test in the console.

### walk through this simple test.

	The first interesting piece is inside the beforeEach block. The browser object is a global object exposed by Protractor and is used to control the browser-level actions. Underneath, it is just a wrapper around WebDriver. The browser.get("") function navigates the browser to start the app page every time before the start of the test.

	element: This function returns an ElementFinder object. The primary job of ElementFinder is to interact with the selected element. We will be using the element function to select ElementFinder extensively in our tests.

	by: This object is there to locate elements. It has functions that create locators. In the preceding test, a locator is created to search for elements with id=start. There are a number of locators that can be used to search for a specific element. These include by class, by ID, by model (ng-model), by binding, and many more. Refer to the Protractor documentation on locators at http://angular.github.io/protractor/#/locators to learn about the supported locators.

	This simple test highlights another salient feature of Protractor. It automatically detects when the Angular app is loaded and when data is available for testing. 

	Remember, this is a SPA; full-page browser refresh does not happen, so it is not that simple to determine when the page is loaded and when data that is rendered for AJAX calls is available. Protractor makes it all possible.

	From an E2E test perspective, the workouts returned by a MongoLab instance should always be the same.

### Setting up backend data for E2E testing

	Setting up backend data for E2E testing is a challenge, irrespective of the E2E framework we employ for testing. The ultimate aim is to assert the behavior of an application against some data and unless the data is fixed, we cannot verify behavior that involves getting or setting data.	

	Mocking the server backend in E2E testing:

	If setting up a new data store is expensive and time-consuming and/or the backend API is well tested, there is at least an option to mock data. Another reason to use a mock backend is to learn about the mocking capabilities of Angular in the context of E2E testing.

	The service that is again going to help in this case is $httpBackend, but this time the service comes from the ngMockE2E module, instead of ngMock.

	Setting up the HTTP mock backend is an intrusive process and requires some changes to the existing application code. To plug in a mock backend we need to perform the following steps:

		1. Create a new module with dependency on the main app module (named app) and the ngMockeE2E module.

	    2. Add the mock HTTP implementation in this module using the $httpBackend.when* functions. These methods are similar to the ones we used in unit tests.

	    3. Rewire the ng-app declaration in index.html to use the new ngMockeE2E module instead of the existing app module. The app bootstrapping process will use ngMockeE2E now, and the mock backend setup in the ngMockeE2E module will override the standard HTTP requests that the app makes to get data.

	appe2e.js

	$http in Angular is used for all types of HTTP communication. This includes loading view partials too. We do not want to mock such requests to our backend. The good thing about the when API is that it does allow us to pass through any request to the real backend if desired, and the following command does just that:

		$httpBackend.whenGET(/^partials///).passThrough();

	Even the index.html file needs to change as we need to use the new module now. Update the existing ng-app declaration in index.html to:

		<body ng-app="appe2e" ng-controller="RootController">

		<script src="js/appe2e.js"></script>

		We add references to appe2e.js and angular-mocks.js that contain the ngMockE2E module definition.

### More E2E tests

		it("should search workout with specific name.", function () {
		var filteredWorkouts = element.all(by.repeater("workout in workouts"));
		expect(filteredWorkouts.count()).toEqual(2);

		var searchInput = element(by.model("workoutSearch"));
		   searchInput.sendKeys("test");

		   expect(filteredWorkouts.count()).toEqual(1);
		     expect(filteredWorkouts.first().element(by.css(".title")).getText()).toBe("A test Workout");
		});	

		The sendKeys function is used to simulate data entry in the search input.

### Testing Workout Runner

	Page objects to manage E2E testing:

	The concept of page objects is simple. Encapsulate the representation of page elements into an object so that we do not have to litter our E2E test code with ElementFinder and locators. If any page element moves, we just need to fix the page object.

		var WorkoutRunnerPage = function () {
		this.description = element(by.binding("currentExercise.details.description"));
		this.steps = element(by.binding("currentExercise.details.procedure"));
		this.videos = element.all(by.repeater("video in currentExercise.details.related.videos"));
		this.pauseResume = element(by.id("pause-overlay"));
		   this.exerciseHeading = element(by.binding("currentExercise.details.title"));
		this.workoutTimeRemaining = element(by.binding("workoutTimeRemaining"))
		this.exerciseTimeRemaining = element(by.binding("currentExercise.duration-currentExerciseDuration"));
		};

	This page object now encapsulates all the elements that we want to test. By organizing the element selection code in one place, we increase the readability and hence maintainability of E2E tests.

		describe("Workout Runner page", function () {
		     beforeEach(function () {
		         browser.get("#/workout/testworkout");
		     });

		     it("should load workout data", function () {
		         var page = new WorkoutRunnerPage();
		         expect(page.description.getText())
		    .toBe("The basic crunch is a abdominal exercise in a 
		     strength-training program.");
		         expect(page.exerciseHeading.getText())
		      .toBe("Abdominal Crunches");
		         expect(page.videos.count()).toBe(2);
		     });
		 });

 	Testing code based on $interval or $timeout:

		it("should transition exercise when time lapses.", function () {
		     var page = new WorkoutRunnerPage();
		     browser.sleep(5000);
		     page.pauseResume.click();
		     expect(page.videos.count()).toBe(0);
		     expect(page.description.getText()).toBe("Relax a bit!");
		     expect(page.exerciseHeading.getText()).toBe("Relax!");
		 });

	This test checks whether the exercise transition happened. It does so by adding a browser.sleep function for 5 seconds, and then verifying from the UI state whether exercise-related content of Rest is visible. The problem with this test is that it is not very accurate. It can confirm the transition is happening but cannot confirm it happened at the right time.

