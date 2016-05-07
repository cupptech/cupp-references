
## Problem

	Since we can now pause the workout, pausing the workout on video playback can be implemented. Regarding the size of the player and the general lag at the start of every exercise, we can fix it by showing the image thumbnail for the exercise video instead of loading the video player itself. When the user clicks on the thumbnail, we load a pop up/dialog that has a bigger size video player that plays the selected video.

## Solution

### Refactoring the video panel and controller

video-panel.html

	<div class="panel panel-info" ng-controller="WorkoutVideosController">

Thumbnail image

	<img height="220" ng-src="https://i.ytimg.com/vi/{{video}}/hqdefault.jpg" />

	We have referenced this Stack Overflow post http://stackoverflow.com/questions/2068344/how-do-i-get-a-youtube-video-thumbnail-from-the-youtube-api, to determine the thumbnail image URL for our videos.

video-panel.html also contains a view template embedded in script tag:
	<script type="text/ng-template" id="youtube-modal">…<script>

### Video playback in the pop-up dialog
	
	we have a very able and popular library to support modal pop-up dialogs in Angular, the ui.bootstrap dialog (http://angular-ui.github.io/bootstrap/). 

	ui.bootstrap too has a modal dialog and we are going to use it.

	To start with, we need to reference the ui.bootstrap library in our app. Go ahead and add the reference to ui.bootstrap in the index.html script section after the framework script declarations:

		<script src="//cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/0.10.0/ui-bootstrap-tpls.js"></script>

	Import the ui.bootstrap module in app.js:
		angular.module('app', ['ngRoute', 'ngSanitize', 'workout', 'mediaPlayer', 'ui.bootstrap']).

	workoutvideos.js

		angular.module('workout')
  			.controller('WorkoutVideosController', ['$scope', '$modal', function ($scope, $modal) {

  		$modal service, When invoked, it dynamically injects a directive (<div modal-window></div>) into the view HTML which finally shows up as popup.

  	In WorkoutVideosController, we define the playVideo method that uses the $modal service to load the video in the popup. The first thing we do in the playVideo method is to pause the workout. Then, we call the $modal.open method to open the popup.

		var dailog = $modal.open({
		    templateUrl: 'youtube-modal',
		    controller: VideoPlayerController,	// new controller for each dialog 
		    scope:$scope.$new(true),			// create a isolated scope
		    resolve: {
		        video: function () {
		            return '//www.youtube.com/embed/' + videoId;
		        }
		    },
		    size: 'lg'
		}).result['finally'](function () {
		    $scope.resumeWorkout();
		});
  	
  	Calling $new without an argument creates a new scope that inherits (prototypal inheritance) from the scope on which the function is invoked.

	Having the true parameter in $new instructs the scope API to create an isolated scope.

	resolve: Since we have declared our modal scope to be an isolated scope, we need a mechanism to pass the selected video from the parent scope to the isolated modal dialog scope. The resolve argument solves this parameter passing problem.

		For example, the resolve object has one property video that returns the concatenated value of the YouTube video URL with the video ID (passed to the playVideo function as videoId). We use the property name video and inject it into VideoPlayerController. Whenever the dialog is loaded, the video function is invoked and the return value is injected in the VideoPlayerController as the property name video itself.

	result: he result property on the returned object is a promise that gets resolved when the dialog closes. The finally function callback is invoked irrespective of whether the result promise is resolved or rejected and in the callback we just resume the workout.

	Refer to the documentation for ui.bootstrap.modal (http://angular-ui.github.io/bootstrap/#/modal) for more details.

	The implementation of VideoPlayerController is simple:

		var VideoPlayerController = function ($scope, $modalInstance, video) {
		    $scope.video = video;
		    $scope.ok = function () {
		        $modalInstance.close();
		    };
		};

	The $modalInstance service is used to control the opened instance of the dialog as we can see in the $scope.ok function. This is the same object that is returned when the $modal.open method is called.

	The video object is the YouTube link that we have injected using the video property of the resolve object while calling $modal.open. We assign the video link received to the modal scope and then the view template (youtube-modal) binds to this video link:

		<iframe width="100%" height="480" src="{{video}}" frameborder="0" allowfullscreen></iframe>

	Since we have defined the VideoPlayController as a normal function, we need to make sure it is minification-safe. 

		VideoPlayerController["$inject"] = ['$scope', '$modalInstance', 'video'];


	
