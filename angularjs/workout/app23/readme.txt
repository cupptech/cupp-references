
## Problem

	Adding start and finish pages.

## Solution

### SPA

	Single page applications (SPAs) are browser-based apps devoid of any full page refresh. In such apps, once the initial HTML is loaded, any future page navigations are retrieved using AJAX as HTML fragments and injected into the already loaded view.

	View layouts for SPAs using ng-view:

		<div class="container body-content app-container">
	        <div ng-view></div>
		</div>
	
	HTML elements with this ng-view directive act as a container that hosts partial HTML templates received from the server.In our case, the content of the start, workout, and finish pages will be added as inner HTML to this div. This will happen when we navigate across these three pages.

	This $route service is responsible for providing routing and deep-linking capabilities in AngularJS.

### Defining routes

	angular.module('app', ['ngRoute', 'workout']);

	Add reference to the angular-route.js file after the reference to angular.js in index.html:

		<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.2/angular.js"></script>
		<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.2/angular-route.js"></script>

	In the AngularJS world, any configurations required before the app becomes usable are defined using the module API's config method. 

		angular.module('app', ['ngRoute', 'workout']).
		config(function ($routeProvider) {
		    $routeProvider.when('/start', {
		        templateUrl: 'partials/start.html'
		    });
		    $routeProvider.when('/workout', {
		        templateUrl: 'partials/workout.html',
		        controller: 'WorkoutController'
		    });
		    $routeProvider.when('/finish', {
		        templateUrl: 'partials/finish.html'
		    });
		    $routeProvider.otherwise({
		        redirectTo: '/start'
		    });
		});

	The config function just mentioned takes a callback function that gets called during the config stage. The function is called with the $routeProvider dependency. We define three main routes here and one fall back route using the $routeProvider API.

	We call the when function of $routeProvider that takes two arguments:
	path: This is a bookmarkable URL to a partial view.
	routeConfig: This parameter takes route configurations. 

	Note: If we specify the controller to load in the $routeProvider configuration and also apply the ng-controller directive on the related template HTML. Angular will create two controllers and you may experience all types of weird behaviors such as duplicate method calls, Ajax calls, and others.


### The config/run phase and module initialization
	Once the DOM is ready and the framework is loaded, it looks for the ng-app directive and starts module initialization. This module initialization process not only loads the module declared by ng-app but also all its dependent modules and any dependencies that the linked modules have, like a chain. Every module goes through two stages as it becomes available for consumption. 

	config: Services in modules that require initial setup are configured during this stage. We cannot inject services or filters as dependencies at the present time. $routeProvider injection works as it is a special class of services called providers. 

	run: At this stage, the application is fully configured and ready to be used. The DI framework can be completely utilized at this stage. 

### View navigation in the controller using $location

	The $location service parses the URL in the browser address bar (based on the window.location) and makes the URL available to your application. Changes to the URL in the address bar are reflected into $location service and changes to $location are reflected into the browser address bar.

		$location.path('/finish');

	Note: In the anchor (<a>) tag, we used href='#/wokout', whereas we are not using the # symbol with the $location.path function.

### Working with the $location service

	The $location service is responsible for providing client-side navigation for our app. If routes are configured for an app, the location service intercepts the browser address changes, hence stopping browser postbacks/refreshes.

		http://<hostname>/index.html#/start (or #/workout or #/finish)

	The $location service is using this bookmark-type URL to provide correct route information. This is called the hashbang mode of addressing.

	We can get rid of # if we enable HTML5 mode configuration. This setting change has to be done at the config stage using the html5Mode method of the $locationProvider API. 

		$locationProvider.html5Mode(true);

	The addresses will now look like:
		http://<hostname>/start (or /workout or /finish)

	Now we can see how easy it was to create an SPA using AngularJS. We get all the benefit of standard web apps: unique bookmarkable URLs for each view (page) and the ability to move back and forward using the browser's back and forward buttons but without those annoying page refreshes.

	