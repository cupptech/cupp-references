## Problem

	Model update on blur:
		We want a directive that updates the underlying model only when the input loses focus.

	Implementing a remote validation clues directive

## Solution

	shared/directives.js

		angular.module('app').directive('updateOnBlur', function () {
		    return {
		        restrict: 'A',
		        require: 'ngModel',
		        link: function (scope, elm, attr, ngModelCtrl) {
		            if (attr.type === 'radio' || attr.type === 'checkbox') 	return;
		            elm.unbind('input').unbind('keydown').unbind('change');
		            elm.bind('blur', function () {
		                scope.$apply(function () {
		                    ngModelCtrl.$setViewValue(elm.val());
		                });
		            });
		        }
		    };
		});	
	
	The link function basically unbinds all existing event handlers on the target input and rebinds only the blur event. The blur event handler updates the model by calling ngModelCtrl.$setViewValue, retrieving the actual view content from view using the elm.val() DOM function.

	Go ahead and refresh the new workout page and enter some data in the workout name field. This time validation only triggers on blur, and hence the remote calls are made once the focus is lost.

### Using priority to affect the order of execution of the compile and link functions

	Remote validation is a costly operation and we want to make sure remote validation only happens when deemed necessary. Since the workout name input has other validations too, remote validation should only trigger if there is no other validation error, but that is not the case at present.

	Remote validation is fired irrespective of whether other validations on input fail or not. Enter a workout name bigger than 15 characters and tab out. The remote-validator directive still fires the remote call (see the browser network log) in spite of the failure of regex pattern validation

	However, how do we affect the order of execution of link function? The answer is the property priority.

	The Angular 1.3 implementation of remote-validator does not suffer from this issue as validators are not part of parser/formatter pipelines in v1.3. Add to that, asynchronous validators in v1.3 always run after the synchronous validators. Hence v1.3 of the validator does not require the priority fix. The following content is a good read to understand the role of priority in directive execution.

	Go ahead and add the property priority on the remote-validator directive definition object, and set it any non-zero positive number (for example, priority: 5). Refresh the page and again enter a workout name bigger than 15 characters and tab out. This time the remote call is not fired, and we can confirm this in the network tab of the browser.

### Life cycle of a directive

	Directive setup starts when Angular compiles a view. View compilation can happen at different times during application execution. It can happen due to the following reasons:

	    When the application bootstraps (setting up ng-app) while loading the app for the first time

    	When a view template is loaded dynamically for the first time using directives such as ng-view and ng-include

    	When we use the $compile service to explicitly compile a view fragment (we will discuss more about the $compile service later in the chapter).

    This compilation process for a directive is broken down into two phases: the compile and the link phases. Since there are always multiple directives on the view, this phased execution is repeated for each of the directives.

    During the view compilation, Angular searches for directives defined on the view by traversing the DOM tree top down from parent to child. 

    Once Angular is able to determine the directive reference by a view fragment, it invokes the compile function for each of the matching directive. The compile function invocation in turns returns a link function. This is called the compile phase of the directive setup. At this time, view bindings are not set up; hence, we have a raw view template. Any template manipulation can be safely done at this stage.

    The resultant link function is used to set up the bindings between the view and a scope object. When traversing down the DOM tree, Angular keeps invoking the compile functions on the directives and keeps collecting the link functions.

	Once compilation is complete, it then invokes the link function in the reverse order with the child link function called before the parent link function (from children to parent DOM elements) to set up the scope and view binding. This phase is termed as the link phase.

	The resultant link function is used to set up the bindings between the view and a scope object. When traversing down the DOM tree, Angular keeps invoking the compile functions on the directives and keeps collecting the link functions.

	Once compilation is complete, it then invokes the link function in the reverse order with the child link function called before the parent link function (from children to parent DOM elements) to set up the scope and view binding. This phase is termed as the link phase.

	During the link phase Angular may have to create a new scope for some directives (for example, ng-view, ng-repeat, and ng-include), or bind an existing scope to the view (for example ng-click, ng-class, and ng-show). Then, Angular invokes the controller function, followed by the link function on the directive definition object passing in the appropriate scope and some other relevant parameters.

	The reason to break the overall process into compile and link phase is due to performance optimization. For directives such as ng-repeat, the inner HTML of the directive is compiled once. Linking happens for each ng-repeat iteration, where Angular clones the compiled view and attaches a new scope to it before injecting it into DOM.


		compile: function compile(tElement, tAttrs) {
		 return {
		   pre: function(scope, elmement, attr, ctrl) { ... },
		   post: function (scope, elmement, attr, ctrl) { ... }
		 };}

		compile: function compile(tElement, tAttrs) {
		  return function(scope, elmement, attr, ctrl) { ... }; //post link function
		}

	Instead of implementing the compile function and returning a link function, we can directly implement the link function:

		link:function(scope, elmement, attr, ctrl)  //post link function

		link: {
		  pre: function preLink(scope, elmement, attr, ctrl) { ... },
		  post: function postLink(scope, elmement, attr, ctrl) { ... }
		}	

	Stick to the postlink phase and use the link function. There is seldom a need to use the prelink phase.

### The priority and multiple directives on a single element

	The compile phase where Angular calls the compile function top-down, and the link phase where the link function is invoked bottom-up. 

	When multiple directives are defined on a single element, priority decides the execution order. The directives with higher priority are compiled first and linked last.	

	The default priority of a directive is 0.

	By setting the directive priority for remote-validator to a positive number, we force Angular to run the directive's link function at the last. This allows us to push our remote validator function at the end of parser pipeline, and it runs last during validation.

### Implementing a remote validation clues directive

	We can improve the overall user experience if we can show a busy/progress indicator every time remote validation happens. Let's build a busy-indicator directive.

	shared/directive.js

	busy-indicator (1)   

		angular.module('app').directive('busyIndicator', ['$compile', function ($compile) {
		   return {
		     scope: true,
		     link: function (scope, element, attr) {
		       var linkfn = $compile('<div><label ng-show="busy" 
		  			class="text-info glyphicon glyphicon-refresh spin"></label></div>');
		            element.append(linkfn(scope));
		     },
		     controller: ['$scope', function ($scope) {
		       this.show = function () { $scope.busy = true; }
		       this.hide = function () { $scope.busy = false; }
		     }]
		    }
		}]);	

		Setting scope:true on directive definition causes a new scope to be created when the directive is executed and link function is called. This scope inherits from its parent scope (prototypal inheritance).

		The reason we create a new scope for busy-indicator is because we want to support any number of busy indicators on the page. Look at the directive definition; it manipulates a busy flag in its controller function. If we do not create a new scope, the busy flag gets added to the parent scope (or container scope) of the directive. This limits our ability to add more than one busy variable as there is only one scope. With scope set to true, every directive reference in HTML creates a new scope and the busy flag is set on this child scope, hence avoiding any conflict.

		The link function here does some DOM manipulation and appends an HTML fragment (a spinner HTML) to the element using element.append.

		The busy-indicator function of link uses the $compile service to compile the HTML fragment before it injects the HTML fragment into the DOM.

### Angular $compile service

	The AngularJS $compile service is responsible for compiling the view and linking it to the appropriate scope.

	If we want to inject dynamic HTML into the view and expect interpolations and directives bindings for the injected HTML to work, we need to use $compile.

	The busy-indicator uses the $compile service first to compile the HTML fragment. This results in the creation of a link function (linkFn) for the HTML fragment (the compile phase). The link function is then linked to the directive scope by calling linkFn(scope) (the link phase).

	In this case, the directive scope is a new child scope as we have set scope:true. The linkFn function invocation returns a compiled + linked element that is finally appended to the directive element.

	We have manually compiled, linked, and injected a custom HTML fragment into DOM. Without compiling and linking, the ng-show binding will not work and we will end up with a busy indicator that is permanent visible.

	The $compile service function can take an HTML fragment string (as shown earlier) or a DOM element as input. We can convert the HTML fragment into DOM element using the angular.element helper function:

		var content = '<div ng-show="exp"></div>';
		var template = angular.element(content);
		var linkFn=$compile(template);

### Directive controller function

	The primary role of a directive controller function defined on a directive definition object is to support inter-directive communication and expose an API that can be used to control the directive from outside.

	The ng-model directive is an excellent example of a directive that exposes its controller (NgModelController). This controller has functions and properties to manage two-way data binding behavior. 

	The controller API for busy-indicator is pretty simple. A function show is used to start the indicator and hide is used to stop it.

### Inter-directive communication – integrating busy-indicator and remote-validator

	The integration approach here is to add the dependency of busy-indicator in the remote-validator directive. In the link function, use the busy-indicator controller to show or hide the indicator when remote validation happens.

### Fixing remote-validator – pre-Angular 1.3

		require: ['ngModel', '?^busyIndicator'],

	The ?^ symbol implies AngularJS should search for dependency on the parent HTML tree. If it is not found, Angular injects a null value in the link function for the busy-indicator controller. For this dependency to work, the busy-indicator directive should apply to the parent HTML of remote-validator.

	The link function of remote-validator needs to be updated as dependencies have changes. Update the link function implementation with the highlighted code:

		link: function (scope, elm, attr, ctrls) {
		    var expfn = $parse(attr["remoteValidatorFunction"]);
		    var validatorName = attr["remoteValidator"];
		    var modelCtrl = ctrls[0];
		    var busyIndicator = ctrls[1];
		    modelCtrl.$parsers.push(function (value) {
		      var result = expfn(scope, { 'value': value });
		      if (result.then) {
		          if (busyIndicator) busyIndicator.show();
		         result.then(function (data) { 	
		               if (busyIndicator) busyIndicator.hide();
		              modelCtrl.$setValidity(validatorName, true);
		         }, function (error) {
		                if (busyIndicator) busyIndicator.hide();
		                modelCtrl.$setValidity(validatorName, false);
		         });
		        }
		        return value;
		    });

	Add it to the parent form-group attribute of div:

		<div class="form-group row" ng-class="{'has-error':formWorkout.workoutName.$invalid}" busy-indicator="">

### Fixing remote-validator (Angular 1.3)

	require: ['ngModel', '?^busyIndicator'],

	link: function (scope, elm, attr, ctrls) {
	  var expfn = $parse(attr["remoteValidatorFunction"]);
	  var validatorName = attr["remoteValidator"];
	  var ngModelCtrl = ctrls[0];
	  var busyIndicator = ctrls[1];

	  ngModelCtrl.$asyncValidators[validatorName] = function (value) {
	        return expfn(scope, { 'value': value });
	  }

	    if (busyIndicator) {
	      scope.$watch(function () { return ngModelCtrl.$pending; },
	        function (newValue) { 
	        if (newValue && newValue[validatorName])
	        busyIndicator.show();
	        else busyIndicator.hide();});
	       }
	}

	With v1.3, we use a new ngModelController property $pending. This property reflects the state of asynchronous validators registered with $asyncValidators.

	The $pending property on ngModelController is an object hash having keys of all asynchronous validators that have a pending remote request. In the preceding implementation, when the $pending property has the validator function key (the same key that is used to register the validator function with the $asyncValidators object earlier), we show the busy indicator or we hide it. Remember Angular automatically adds this key when the asynchronous validation function is called, and removes it once the validation promise is resolved. To verify this, just add a break point inside the watch and look at the value of newValue.

### Injecting HTML in the directive compile function

	The first version of directive used the link function to add an HTML fragment to directive element. The link function first had to compile the HTML fragment before inserting it.

	We can avoid this extra compilation if we add the DOM during the compile phase, when the compile function is called. Let's confirm it by implementing the directive compile function for busy-indicator.

	Comment the link function implementation and add this compile function instead.	

		compile: function (element, attr) {
			var busyHtml = '<div><label ng-show="busy" class = "text-info 
			glyphicon glyphicon-refresh spin"></label></div>';
			element.append(busyHtml);
		},

	By moving the DOM manipulation code into the compile function, we have got rid of the manual compilation process. Angular will now take care of compiling and linking the dynamically injected content.

### Understanding directive templates and transclude

	Directive templates allow directives to embed their own markup as part of directive execution.

	Trasclusion is the process of extracting a part of DOM and making it available to a directive so that it can be inserted at some location within the directive template. Add a transclude property and update the property template on the directive definition object:

		transclude:true,
		template: '<div><div ng-transclude=""></div><label ng-show="busy" class="text-info glyphicon glyphicon-refresh spin"></label></div>',

	The transclude:true property tells Angular to extract the inner HTML of a directive declaration and make it available for injection. The injection location is decided by the ng-transclude directive (also show in preceding screenshot). When the busy-indicator directive executes, Angular pulls the inner HTML of the directive declaration and injects it into directive template HTML wherever ng-transclude is declared.