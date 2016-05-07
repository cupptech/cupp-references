## Problem
	
	Mapping server data to application models


## Solution

	Mapping server response to model data becomes imperative if:

	- Our model defines any functions
    - A stored model stored is different from its representation in code
    - The same model class is used to represent data from different sources (this can happen for mashups where we pull data from disparate sources)

    The two major differences between a model and server data are as follows:

    - The model defines the totalWorkoutDuration function.
    - The exercises array representation also differs. The exercises array of a model contains the Exercise object (the details property) whereas the server data stores just the exercise identifier or name.

    Change the getExercises implementation in WorkoutService to this:

		service.getExercises = function () {
		    return $http.get(collectionsUrl + "/exercises", {
		        params: { apiKey: apiKey}
		    }).then(function (response) {
		        return response.data.map(function (exercise) {
		            return new Exercise(exercise);
		        })});
		};    

	And since the return value for the getExercises function now is not a promise object returned by $http (see the following discussion) but a standard promise, we need to use the then function instead of the success function wherever we are calling getExercises.

	promise chaining: In future, when the first $http.get promise is resolved, the then callback is invoked with the exercise list from the server. The then callback processes the response and returns a new array of the Exercise objects.This return value feeds into the promise resolution for the next callback in the line defined in ExerciseListController.

	Promise chaining acts like a pipeline for response flow.

	Since we are using then instead of success, the callback function receives a single object with all four properties config, data, header, and status.

### Understanding promise chaining

	Promise chaining is about feeding the result of one promise resolution into another promise. Since promises wrap asynchronous operations, this chaining allows us to organize asynchronous code in a chained manner instead of nested callbacks.

	Such chaining allows us to create chains of any length as long as the methods involved in the chain return a promise. In this case, both the $http.get and then functions return a promise.

		var promise = $q.when(1);
		var result = promise
		.then(function (i) { return i + 1;})
		   .then(function (i) { return i + 1;})
		   .then(function (i) { return i + 1;});
		   .then(function (i) { console.log("Value of i:" + i);});

	The preceding code uses promise chaining, and every chained function increments the value passed to it and passes it along to the next promise in the chain. The final value of i in the last then function is 4.

	The $q.when function returns a promise that resolves to a value 1.

	Example of reject a promise:

		var errorPromise = $q.reject("error");

		var resultError = errorPromise.then(function (data) {
		    return "success";
		}, function (e) {
		    return "error";
		});
		resultError.then(function (data) {
		    console.log("In success with data:" + data);
		}, function (e) {
		    console.log("In error with error:" + e);
		});	

	The $q.reject function creates a promise that is rejected with the value as error. Hence, the resultError promise is resolved with the return value error (return error).

	The question now is, "What should the resultError.then callback print?" Well, it prints In success with data: error, since the success callback is invoked not error. This happened because we used a standard return call in both the success and error callbacks for errorPromise.then (or resultError).

	If we want the promise chain to fail all along, we need to reject the promise in every error callback. Change the resultError promise to this:

		var resultError = errorPromise.then(function (data) {
		    return "success";
		}, function (e) {
		    return $q.reject(e);
		});

	The correct error callback in the next chained then is called, and the console logs In error with error: error.

	By returning $q.reject(e) in the error callback, the resolved value of the resultError promise will be a rejected promise ( $q.reject returns a promise that is always rejected).			

### Loading exercise and workout data from the server

	services.js

		service.getWorkout = function (name) {
		  return $q.all([service.getExercises(), $http.get(collectionsUrl
		    + "/workouts/" + name, { params: { apiKey: apiKey } })])
		    .then(function (response) {
		        var allExercises = response[0];
		        var workout = new WorkoutPlan(response[1].data);
		        angular.forEach(response[1].data.exercises,
		          function (exercise) {
		            exercise.details = allExercises.filter(function (e) {
		            return e.name === exercise.name; })[0];
		          });
		       return workout;
		    });
		};

### Fixing workout and exercise detail pages	

	WorkoutDetailController does not load workout details directly but is dependent on the resolve route (see route configuration in config.js) invocation; when the route changes, this injects the selected workout (selectedWorkout) into the controller. The resolve selectedWorkout function in turn is dependent upon WorkoutBuilderService to load the workout, new or existing. Therefore the first fix should be WorkoutBuilderService.

	The function that pulls workout details is startBuilding. Update the startBuilding implementation to the following code:

		service.startBuilding = function (name) {
		    var defer = $q.defer();
		    if (name) {
		        WorkoutService.getWorkout(name).then(function (workout) {
		            buildingWorkout = workout;
		            newWorkout = false;
		            defer.resolve(buildingWorkout);
		        });
		    } else {
		        buildingWorkout = new WorkoutPlan({});
		        defer.resolve(buildingWorkout);
		        newWorkout = true;
		    }
		    return defer.promise;
		};

	In the preceding implementation, we use the $q service of the Promise API to create and resolve our own promise. The preceding scenario required us to create our own promise because creating new workouts and returning is a synchronous process, whereas loading the existing workout is not. To make the return value consistent, we return promises in both the new workout and edit workout cases.


	Route resolutions and promises:

		return WorkoutBuilderService.startBuilding($route.current.params.id);

		When a return value of a resolve function is promise, Angular routing infrastructure waits for this promise to resolve, before loading the corresponding route. Once the promise is resolved, the resolved data is injected into the controller as it happens with standard return values. In our implementation too, the selected workout is injected automatically into the WorkoutDetailController once the promise is resolved. We can verify this by double-clicking on the workout name tile on the list page; there is a visible delay before the Workout Builder page is loaded.

		The clear advantage with the $routeProvider.when resolve property is that we do not have to write asynchronous (then) callbacks in the controller as we did to load the workout list in WorkoutListController.


### Creating and resolving custom promises

	Creating and resolving a standard promise involves the following steps:

	1. Create a new defer object by calling the $q.defer() API function. The defer object is like an (conceptually) action that will complete some time in the future.

    2. Return the promise object by calling defer.promise at the end of the function call.

    3. Any time in the future, use a defer.resolve(data) function to resolve the promise with a specific data or defer.reject(error) object to reject the promise with the specific error function. The resolve and reject functions are part of the defer API. The resolve function implies work is complete whereas reject means there is an error.

    The ability to create and resolve our own custom promise is a powerful feature. Such an ability is very useful in scenarios that involve invocation and coordination of one or more asynchronous methods before a result can be delivered. 

		getProductPriceQuotes(productCode) {
		    var defer = $q.defer()
		    var promiseA = getQuotesAmazon(productCode);
		    var promiseB = getQuotesBestBuy(productCode);
		    var promiseE = getQuotesEbay(productCode);
		    $q.all([promiseA, promiseB, promiseE])
		      .then(function (response) {
		         defer.resolve([buildModel(response[0]),
		         buildModel(response[1]), buildModel(response[2])]);
		        });
		    defer.promise;
		}

	When it comes to creating and using the defer/Promise API there are some rules/guidance that come in handy. These include:

	    A promise once resolved cannot be changed. A promise is like a return statement that gets called in the future. But once a promise is resolved, the value cannot change.

    	We can call then of the exiting promise object any number of times, irrespective of whether the promise has been resolved or not.

    	Calling then on the existing resolved/rejected promise invokes the then callback immediately.

    $q.when 	
    	when(value);

    	The promise returned by when is resolved with the value if it is a simple JavaScript type or with the resolved promise value if value is a promise.

			service.startBuilding = function (name) {
			    if (name) {
			        return WorkoutService.getWorkout(name)
			         .then(function (workout) {
			            buildingWorkout = workout;
			            newWorkout = false;
			            return buildingWorkout;
			         });
			    } else {
			        buildingWorkout = new WorkoutPlan({});
			        newWorkout = true;
			        return $q.when(buildingWorkout);
			    }
			};


### Cross-domain access and AngularJS

Cross-domain requests are requests made for resources in a different domain. Such requests when originated from JavaScript have some restrictions imposed by the browser; these are termed as same-origin policy restrictions. This restriction stops the browser from making AJAX requests to domains that are different from the script's original source. The source match is done strictly based on a combination of protocol, host, and port.

Using JSONP to make cross-domain requests

	The JSONP mechanism of remote invocation relies on the fact that browsers can execute JavaScript files from any domain irrespective of the source of origin, as long as the script is included via the <script> tag. In fact, a number of framework files that we are loading in Personal Trainer come from a CDN source (ajax.googleapis.com) and are referenced using the script tag.

	In JSONP, instead of making a direct request to a server, a dynamic script tag is generated with the src attribute set to the server endpoint that needs to be invoked. This script tag, when appended to the browser's DOM, causes a request to be made to the target server.

	The server then needs to send a response in a specific format wrapping the response content inside a function invocation code (this extra padding around response data gives this technique the name JSONP).

Cross-origin resource sharing

 	Cross-origin resource sharing (CORS) provides a mechanism for the web server to support cross-site access control, allowing browsers to make cross-domain requests from scripts. With this standard, the consumer application (such as Personal Trainer) is allowed to make some types of requests termed as simple requests without any special setup requirements. These simple requests are limited to GET, POST (with specific MIME types), and HEAD. All other types of requests are termed as complex requests.

	For complex requests, CORS mandates that the request should be preceded with a HTTP OPTIONS request (also called a preflight request), that queries the server for HTTP methods allowed for cross-domain requests. And only on successful probing is the actual request made.

	The best part about CORS is that the client does not have to make any adjustment as in the case of JSONP. The complete handshake mechanism is transparent to calling code and our AngularJS AJAX calls work without any hitch.

	CORS requires configurations to be made on the server, and the MongoLab servers have already been configured to allow cross-domain requests. The preceding POST request to MongoLab caused the preflight OPTIONS request.
