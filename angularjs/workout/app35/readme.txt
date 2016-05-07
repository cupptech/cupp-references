## Problem

	Animations with AngularJS.

	HTML animations can either be done using css, or by using some JavaScript library such as jQuery. Given that CSS3 has inherited support for animation, using CSS is a preferred way of implementing animation in our apps. With the use of CSS3 transitions and animation constructs, we can achieve some impressive animation effects.

	Directives such as ng-repeat, ng-include, ng-view, ng-if, ng-switch, ng-class, and ng-show/ng-hide have build-in support for animation.

## Solution

### AngularJS CSS animation

CSS animation is all about animating from one style configuration to another using some animation effect. The animation effect can be achieved by using any of the following two mechanisms:

Transition: This is where we define a start CSS state, the end CSS state, and the transition effect (animation) to use. The effect is defined using the style property transition. The following CSS style is an example:

	.my-class {
	  -webkit-transition:0.5s linear all;
	  transition:0.5s linear all;
	  background:black;
	}
	.my-class:hover {
	   background:blue;
	}

When the preceding styles are applied to an HTML element, it changes the background color of the element from black to blue on hover with a transition effect defined by the transition property.

	.my-class.animate {
	   background:blue;
	}

When this style is added, a similar effect as demonstrated previously can be achieved by dynamically adding the animate class to an HTML element which already has my-class applied.

Animation: This is where we define the start CSS state, the keyframe configuration that defines the time duration of the animation, and other details about how the animation should progress. For example, these CSS styles have the same effect as a CSS transition:

	.my-class {
	  background:black;
	}
	.my-class:hover {
	   background:blue;
	   animation: color 1s linear;
	  -webkit-animation: color 1s linear;
	}
	@keyframes color {
	  from {
	    background: black;
	  }
	  to {
	    background: blue;
	  }
	}

The basic difference between transition and animation is that we do not need two CSS states defined in the case of animation. In the first example, transition happens when the CSS on the element changes from .my-class to .my-class:hover, whereas in the second example, animation starts when the CSS state is .my-class:hover, so there is no end CSS concept with animation.

The animation property on .my-class:hover allows us to configure the timing and duration of the animation but not the actual appearance. The appearance is controlled by @keyframes. In the preceding code, color is the name of the animation and @keyframes color defines the appearance.

To facilitate animations, AngularJS directives add some specific classes to the HTML element.

Another important aspect of animation that we should be aware of is that the start and end classes added are not permanent. These classes are added for the duration of the animation and removed thereafter. AngularJS respects the transition duration and removes the classes only after the animation is over.

### AngularJS JavaScript animation	

jQuery animation:

	$(".my-class").hover( function() {$(this).animate({backgroundColor:blue},1000,"linear");

To integrate script-based animation with Angular, the framework provides the Module API method animation:
	
	animation(name, animationFactory);

	<div ng-repeat="item in items" class='repeat-animation'>

	myApp.animation('.repeat-animation', function() {
	  return {
	    enter : function(element, done) { //ng-enter or element added
	    //Called when ng-enter is applied
	    jQuery(element).css({
	            opacity:0
	      });
	      jQuery(element).animate({
	  opacity:1
	      }, done);
	    }
	  }
	});

	Here, we animate when ng-enter is applied from the opacity value from 0 to 1. This happens when an element is added to the ng-repeat directive. Also, Angular uses the class name of the HTML element to match and run the animation. In the preceding example, any HTML element with the .repeat-animation class will trigger the previous animation when it is created.

	For the enter function, the element parameter contains the element on which the directive has been applied and done is a function that should be called to tell Angular that the animation is complete. Always remember to call this done function. The preceding jQuery animate function takes done as a parameter and calls it when the animation is complete.

### Adding animation to Workout	

The AngularJS ngAnimate module contains the support for Angular animation.

	angular.module('app', ['ngRoute', 'ngSanitize', 'workout', 'mediaPlayer', 'ui.bootstrap', 'ngAnimate']).

The first animation we are going to enable is the ng-view transition, sliding in from the right. Adding this animation is all about adding the appropriate CSS in our app.css file. Open it and add:

	div[ng-view] {
	    position: absolute;
	    width: 100%;
	    height: 100%;
	}
	div[ng-view].ng-enter,
	div[ng-view].ng-leave {
	    -webkit-transition: all 1s ease;
	    -moz-transition: all 1s ease;
	    -o-transition: all 1s ease;
	    transition: all 1s ease;
	}
	div[ng-view].ng-enter {
	    left: 100%;     /*initial css for view transition in*/
	}
	div[ng-view].ng-leave {
	    left: 0;        /*initial css for view transition out*/
	}
	div[ng-view].ng-enter-active {
	    left: 0;        /*final css for view transition in*/
	}
	div[ng-view].ng-leave-active {
	    left: -100%;    /*final css for view transition out*/
	}

	This basically is transition-based animation. We first define the common styles and then specific styles for the initial and final CSS states. It is important to realize that the div[ng-view].ng-enter class is applied for the new view being loaded and div[ng-view].ng-leave for the view being destroyed.

	For the loading view, we transition from 100% to 0% for the left parameter.

	For the view that is being removed, we start from left 0% and transition to left -100%

Let's add a keyframe-based animation for videos as it is using ng-repeat, which supports animation. This time we are going to use an excellent third-party CSS library animate.css (http://daneden.github.io/animate.css/) that defines some common CSS keyframe animations. Execute the following steps:

	1. <link href="//cdnjs.cloudflare.com/ajax/libs/animate.css/3.1.0/animate.min.css" rel="stylesheet" />
	2. Update the video-panel.html file and add a custom class video-image to the ng-repeat element:
		<div ng-repeat="video in currentExercise.details.related.videos" ng-click="playVideo(video)" class="row video-image">
	3. Update the app.css file to animate the ng-repeat directive:

		.video-image.ng-enter,
		.video-image.ng-move {
		    -webkit-animation: bounceIn 1s;
		    -moz-animation: bounceIn 1s;
		    -ms-animation: bounceIn 1s;
		    animation: bounceIn 1s;
		}
		.video-image.ng-leave {
		    -webkit-animation: bounceOut 1s;
		    -moz-animation: bounceOut 1s;
		    -ms-animation: bounceOut 1s;
		    animation: bounceOut 1s;
		}

	We define animation effect bounceIn for the ng-enter and ng-move states and bounceOut for the ng-leave state. Much cleaner and simpler!