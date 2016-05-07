
## Problem

	The break tags(<br>) were literally rendered in the browser. Angular did not render the interpolation as HTML; instead it escaped the HTML characters.

	In Angular, SCE does not allow us to render arbitrary HTML content using interpolation. This is done to save us from all sort of attacks that are possible with arbitrary HTML injection in a page such as cross-site scripting (XSS) and clickjacking. AngularJS is configured to be secure by default.

## Solution

### Understanding ng-bind-html 

As the name suggests, the ng-bind-html directive is used to bind model data as HTML.

Behind the scenes, ng-bind-html uses the $sanitize service to sanitize the HTML content. The $sanitize service parses the HTML tokens and only allows whitelisted tokens to be rendered and removes the others. This includes removal of embedded script content such as onclick="this.doSomethingEvil()" from the rendered HTML.

We can override this behavior if we trust the HTML source and want to add the HTML as it is to the document element. We do this by calling the $sce.trustAsHtml function in the controller and assigning the return value to a scope variable:

	$scope.trustedHtml=$sce.trustAsHtml('<div onclick="this.doSomethingGood() />');

And then bind it using ng-bind-html:

	<div ng-bind-html="trustedHtml"></div>

Summary:

    - When it comes to rendering random HTML, AngularJS is secure by default. It escapes HTML content by default.
    - If we want to include model content as HTML, we need to use the ng-bind-html directive. The directive too is restrictive in terms of how the HTML content is rendered and what is considered safe HTML.
    - If we trust the source of the HTML content completely, we can use the $sce service to establish explicit trust using the trustAsHtml function.	

### Using ng-bind-html with data of the exercise steps

description-panel.html

	<div class="panel-body" ng-bind-html="currentExercise.details.procedure">
	</div>

Since ng-bind-html uses the $sanitize service that is not part of the core Angular module but is part of the ngSanitize module, we need to include the new module dependency.

	angular.module('app', ['ngRoute', 'ngSanitize', '7minWorkout']).

Since we are not using the $sanitize service directly, we do not need to update our controller.



