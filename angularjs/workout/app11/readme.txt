## Problem

Guess a random number in as few as possible.
There is a input field, and 'Verfiy' and 'Restart' button.

## Solution

### Setup a development server.

1. Install node.js from http://nodejs.org
2. Install 'http-server' module: npm install http-server -g
3. Run the server: http-server 
4. The HTTP server running at: http://localhost:8080

### The app model

The model is the data that the view and controller work on.
It represents the state of the system projected on the view.
The model properties:
	original: the random number
	guess: the input value
	noOfTries: tracking the number of guesses already made
	deviation: giving hint message or success message

### Create html file: index.html

Reference the Twitter Bootstrap CSS in the <head> section:
	<link href="http://netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css" rel="stylesheet">
Reference the Angular framework inside the <body> tag:
	<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.2/angular.js"></script>

### The controller

In AngualarJS, the controller is a JavaScript class(a contructor function) that hosts the model and exposes same behavior that the view binds to.

Controller script:

	function GuessTheNumberController($scope) {
	    $scope.verifyGuess = function () {
	        $scope.deviation = $scope.original - $scope.guess;
	        $scope.noOfTries = $scope.noOfTries + 1;
	    }
	    $scope.initializeGame = function () {
	        $scope.noOfTries = 0;
	        $scope.original = Math.floor((Math.random() * 1000) + 1);
	        $scope.guess = null;
	        $scope.deviation = null;
	    }
	    $scope.initializeGame();
	}

### The app view

The view is a UI projection of model data.

	<div class="container">
	  <h2>Guess the Number !</h2>
	  <p class="well lead">Guess the computer generated random number between 1 and 1000.</p>
	  <label>Your Guess: </label><input type="number" ng-model="guess"/>
	  <button ng-click="verifyGuess()" class="btn btn-primary btn-sm">Verify</button>
	  <button ng-click="initializeGame()" class="btn btn-warning btn-sm">Restart</button>
	  <p>
	    <p ng-show="deviation<0" class="alert alert-warning">Your guess is higher.</p>
	    <p ng-show="deviation>0" class="alert alert-warning">Your guess is lower.</p>
	    <p ng-show="deviation===0" class="alert alert-success">Yes! That"s it.</p>
	  </p>
	  <p class="text-info">No of guesses : <span class="badge">{{noOfTries}}</span><p>
	</div>

The ng-app attribute tells Angular to treat everything defined inside the HTML tag (with ng-app attribute) as an angular app. The "app" value of the ng-app attribute tells Angular to search for a module named app and load it.

	<body ng-app="app">

### Angular Module

Modules in the Angular framework are containers that hold various artifacts that we create or are part of the framework.

Define a module and register a controller:

	angular.module('app',[])
		.controller('GuessTheNumberController', GuessTheNumberController);
	function GuessTheNumberController($scope) {...}

Link the controller and view:

	<div class="container" ng-controller="GuessTheNumberController">

### Interpolation

Interpolations are declared using the syntax {{expression}}. This expression looks similar to the JavaScript expression but is always evaluated in the context of the linked $scope object. 

	<p class="text-info">No of guesses : 
	<span class="badge">{{noOfTries}}</span><p>

Interpolations are flexible and can be placed almost anywhere in HTML:

- Inside a tag (<div>{{noOfTries}}</div>)
- As an attribute value (<div class='cls-{{noOfTries}}'>)
- As an attribute name (<input {{myAttributeName}}="">)

### Directives

In AngularJS, Directives allow us to extend the standard HTML vocabulary.
Directives are the way to create and package reusable components in the Angular framework.

ng-model: two-way binding between view and model

	<input type="number" ng-model="guess"/> {{guess}}

ng-click: evaluates the expression passed as an attribute value when the element is clicked. 

ng-show: shows or hides the element based on the expression's return value.

ng-controller: links the controller with the view. 

### Expression

Expressions in AngularJS are nothing but plain JavaScript code that are evaluated in the context of the current scope object with few limitations.


	Context: JavaScript expressions are evaluated against the global window. In Angular, expressions are evaluated against a scope object.

    Forgiving: In JavaScript, trying to evaluate undefined properties generates ReferenceError or TypeError. In Angular, expression evaluation is forgiving to undefined and null.

    No Control Flow Statements: You cannot use the following in an Angular expression: conditionals, loops, or exceptions.

    Filters: You can use filters within expressions to format data before displaying it.

Express examples:

	// outputs the value of property
	{{property}}

	//outputs the result of boolean comparison. Ternary operator
	{{property1 >=0?'positive': 'negative'}}

	//call testMethod and outputs the return value
	{{testMethod()}}

	// assign value returned by testMethod to x. Creates "x" on scope if not available. Empty output
	{{x=testMethod()}}

	// calls testMethod() and testMethod2() and assign return values to x and y. Empty output
	{{x=testMethod();y=testMethod2()}}

### Watch expression

- Open chrome console
- Put a breakpoint on the JavaScript code inside verifyGuess. 
- Setup watch expressions:
	$scope.deviation
	$scope.original
	$scope.guess
	$scope.noOfTries
- Enter a guess and click on Verify. The breakpoint will be hit.

### Scope

Scope is a JavaScript object that binds the model properties and behavior (functions) to the HTML view.
The scope object is not the model but it references our model.
Scope objects are always created in the context of a view element and hence follow a hierarchical arrangement similar to that of HTML elements.

Using chrome extension Batarang to dig into the available scopes:

1. Download and install this extension from the Chrome web store.
2. Navigate to the app page.
3. Open the Chrome developer console (F12).
4. Click on the AngularJS tab
5. In this tab, enable the the Enable checkbox and we are all set!

This extension does not work if the file is loaded from a local filesystem (file:///). Need to setup a local web server.
The child scope object inherits from the parent scope object (standard JavaScript prototypal inheritance).
$rootScope is the parent of all scope objects that are created during the lifetime of applications.

Summarize of scope:

- Scope objects bind the view and model together.
- Scope objects are almost always linked to a view element.
- There can be more than one scope object defined for an application. In fact, in any decent size app there are a number of scopes active during any given time.
- More often than not, child scopes inherit from their parent scope and can access parent scope data.

### App bootstraping 

The <body> tag defines an ng-app directive attribute. Wherever Angular encounters this directive, it starts the initialization process. Since we have added ng-app to the <body> tag, everything within the <body> tag becomes part of our AngularJS app.

	<body ng-app="app">

During this bootstrapping/initialization process Angular does the following:

- It loads the module for the application. 
- It sets up dependency injection (DI). For example: $scope
- It creates a $rootScope object, which is a scope object available at the global level and not tied to any specific HTML fragment.
- It compiles the DOM starting from where ng-app is declared. In this compilation process, the framework traverses the DOM, looks for all directives and interpolations, and sets up the binding between the view and model.
- Post compilation, it links the view and scope to produce a live view where changes are synced across the model and viewed in real time as we interact with the app.

This compilation and linking process can also lead to the creation of new scopes, all of which depend on the directive that is being applied to the HTML node.




