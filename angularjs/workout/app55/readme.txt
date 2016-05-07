## Problem
	
	Request/response interceptors


## Solution

	Request and response interceptors, as the names suggest, can intercept HTTP requests and responses to augment/alter them. The typical use cases for using such interceptors include authentication, global error handling, manipulating HTTP headers, altering endpoint URLs, global retry logic, and some other such scenarios.

	Interceptors are implemented as pipeline functions.

	Interceptions can happen at four places and hence there are four interceptor pipelines. This happens:

		- Before a request is sent.

	    - After there is a request error. A request error may sound strange but, in a pipeline mode when the request travels through the pipeline function and any one of them rejects the request (for reasons such as data validation), the request lands up on an error pipeline with the rejection reason.

	    - After receiving the response from the server.

	    - On receiving an error from the server, or from a response pipeline component that may still reject a successful response from the server due to some technicalities.

	Interceptors in Angular are mostly implemented as a service factory. They are then added to a collection of interceptors defined over $httpProvider during the configuration module stage.

		myModule.factory('myHttpInterceptor', function ($q, dependency1, dependency2) {
		    return {
		        'request': function (config) {},
		        'requestError': function (rejection) {},
		        'response': function (response) {},
		        'responseError': function (rejection) {}
		    };});	

	And this is how it is registered at the configuration stage:

		$httpProvider.interceptors.push('myHttpInterceptor');

	The request and requestError interceptors are invoked before a request is sent and the response and responseError interceptors are invoked after the response is received. It is not mandatory to implement all four interceptor functions. We can implement the ones that serve our purpose.

### Using an interceptor to pass the API key

	Every API request to MongoLab requires an API key to be appended to the query string. And, it is quite obvious that if we implement a request interceptor that appends this API key to every request made to MongoLab, we can get rid of this params assignment performed in every API call.

	shared/services.js

		angular.module('app').provider('ApiKeyAppenderInterceptor', function () {
		    var apiKey = null;
		    this.setApiKey = function (key) {
		        apiKey = key;
		    }
		    this.$get = ['$q', function ($q) {
		        return {
		          'request': function (config) {
		              if (apiKey && config && config.url.toLowerCase()
		              .indexOf("https://api.mongolab.com") >= 0) {
		                    config.params = config.params || {};
		                    config.params.apiKey = apiKey;
		                }
		                return config || $q.when(config);
		            }
		        }
		    }];
		});

	We create a 'ApiKeyAppenderInterceptor' provider service (not a factory). The provider function setApiKey is used to set up the API key before an interceptor is used.	

	The request interceptor function takes a single argument: config and has to return the config object or a promise that resolves to the config object. The same config object is used with the $http service.

	Config:

		ApiKeyAppenderInterceptorProvider.setApiKey("<mykey>");
		$httpProvider.interceptors.push('ApiKeyAppenderInterceptor');

	WorkoutServiceProvider:

		this.configure = function (dbName) {
			database = database;
		   	collectionsUrl = apiUrl + dbName + "/collections";
		}

	The last part is now to actually remove references to the API key from all $http and $resource calls.

		$resource(collectionsUrl + "/exercises/:id", {}, { update: { method: 'PUT' } });

	Interceptors work at a level where they can manipulate the complete request and response. These work from headers, to the endpoint, to the message itself! 


