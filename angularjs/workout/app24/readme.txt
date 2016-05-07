
## Problem

	Add the exercise description and instructions on the left panel and call it the description panel. 
	Add a reference to YouTube videos on the right panel, the video panel.

## Solution

	To make things more modular and learn some new concepts, we are going to create independent views for each description panel and YouTube video panel.

### Adding descriptions and video panels

	description-panel.html:

		<div>
		    <div class="panel panel-default">
		        <div class="panel-heading">
		            <h3 class="panel-title">Description</h3>
		        </div>
		        <div class="panel-body">
		            {{currentExercise.details.description}}
		        </div>
		    </div>
		    <div class="panel panel-default">
		        <div class="panel-heading">
		            <h3 class="panel-title">Steps</h3>
		        </div>
		        <div class="panel-body">
		            {{currentExercise.details.procedure}}
		        </div>
		    </div>
		</div>	

	workout.html

		<div id="description-panel" class="col-sm-2" ng-include = "'partials/description-panel.html'"> </div>
		<div id="exercise-pane" class="col-sm-7">
		   // Existing html
		</div>
		<div id="video-panel" class="col-sm-2" ng-include = "'video-panel.html'"></div>

	Add script section:

		<script type="text/ng-template" id="video-panel.html">
		 <div class="panel panel-default">
		    <div class="panel-heading">
		         <h3 class="panel-title">Videos</h3>
		    </div>
		    <div class="panel-body">
		        <div ng-repeat="video in currentExercise.details.related.videos">
		            <iframe width="330" height="220" src="{{video}}" frameborder="0" allowfullscreen></iframe>
		        </div>
		    </div>
		 </div>
		</script>

### Strict Contextual Escaping (SCE)

	This feature restricts the loading of contents/resources into the HTML view from untrusted sources. By default, only data from the same origin is trusted. The same origin is defined as the same domain, protocol, and port as the application document.

	To include video content from YouTube, we need to configure explicit trust for the http://www.youtube.com/ domain.

	This configuration has to be done at the config stage using $sceDelegateProvider:

		$sceDelegateProvider.resourceUrlWhitelist([
		      // Allow same origin resource loads.
		      'self',
		      'http://*.youtube.com/**']);
		});

		The self parameter refers to the same origin.	

		*: matches zero or more occurrences of any character other than one of the following 6 characters: ':', '/', '.', '?', '&' and ';'. It's a useful wildcard for use in a whitelist.

		**: matches zero or more occurrences of any character. As such, it's not not appropriate to use in for a scheme, domain, etc. as it would match too much. (e.g. http://**.example.com/ would match http://evil.com/?ignore=.example.com/ and that might not have been the intention.) Its usage at the very end of the path is ok. (e.g. http://foo.example.com/templates/**).

### Working with ng-include

	The ng-include directive is a perfect way to split a page into smaller, more manageable chunks of HTML content. By doing this, we can achieve some level of reusability as these chunks can be embedded across views or multiple times within a single view.

	AngularJS uses the $templateCache service to cache the partials that it loads during the lifetime of the application. All partials that we reference in ng-view and ng-include are cached for future use.

	In general, if the partial view is small, it is fine to include it in the parent view as a script block (the inline embedded approach). If the partial view code starts to grow, using a separate file makes more sense (the server view).

	Note that, in both ng-include directives, we have used quoted string values ('partials/description-panel.html' and 'video-panel.html'). This is required as ng-include expects an expression and as always expressions are evaluated in the context of the current scope. To provide a constant value, we need to quote it.

	The ng-include directive creates a new scope that inherits (prototypal inheritance) from its parent scope. This implies that the parent scope properties are visible to the child scope and hence the HTML templates can reference these properties seamlessly.

### Working with ng-repeat


	The ng-repeat directive, like ng-include, also creates a new scope. However, unlike ng-include, it creates it every time it renders a new element. So, for an array of n items, n scopes will get created. Just like ng-include, scopes created by ng-repeat also inherit from the parent scope.

	Use the Batarang chrome plugin to see the scope hierarchy.




