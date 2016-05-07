## Problem
	
	Building multilingual apps (internationalization)

## Solution

	Internationalization (I18n) is the process of making sure that the application has elements that can help it render locale-specific content, in other words, the application is adaptable to different locales.

	Localization (L10n) on the other hand, is the actual process of adapting parts of the application to specific locales. These could be the text shown, the date, the time, the current formatting, and other such content that is affected by locale change.

	en-US, en-GB, and es-ES are ISO 639-1 language codes to denote a locale. Left part of - (the dash) signifies the language and the right part, the country.

### Angular I18n support

	AngularJS comes with support for I18n and L10n for date, number, and currency. No surprises here! Angular's filters currency, date, and number are locale-aware.

	To make these filters work according to a specific locale, we need to do some locale-specific configurations. AngularJS comes with more than 250 locale files that contain rules for formatting currency, dates, or numbers in specific locales. We need to include the locale-specific script file for every locale that we want to support.

	angular.module('app',['ngLocale'])

### Locale changes using angular-dynamic-locale
	
	To tackle the first limitation related to changing the locale on the fly, there is a community project angular-dynamic-locale (http://lgalfaso.github.io/angular-dynamic-locale/). This module allows us to dynamically change the locale once the application has been bootstrapped.

	Installing and using angular-dynamic-locale is easy. As with any third-party module, reference the script in index.html and add the module dependency tmh.dynamicLocale to the app's main module.

	It exposes two services: tmhDynamicLocale and tmhDynamicLocaleCache to manage dynamic locale changes. The only function available on the tmhDynamicLocale service is set(newLocale) that changes the actual locale (for example, tmhDynamicLocale.set('es-es')).

	The tmhDynamicLocaleCache function is used for caching the locale file and service downloads.

	Look at the documentation for angular-dynamic-locale to know more about the service and how it works. From a usage perspective the service is quite simple.	

### Using angular-translate for text translations

	The task of content/text translation begins with identifying what content should be translated. Such content can broadly be classified in two categories:

		Fixed string literals: In any HTML page, there are parts that are dynamic and parts that are fixed. If we hardcoded strings anywhere in the view, those are fixed-string literals and are potential candidates for localization.

    	Dynamic string literals: Any string/text fragments retrieved from the server and rendered in the view are dynamic string literals. The exercise name shown during workout execution is a good example of this.

    Angular-translate (http://angular-translate.github.io/) does a great job in supporting content/text localization. It has a number of features including asynchronous loading of I18n data, changing locale on the fly, filters, directives, and a service to localize content.

    To use angular-translate, the first thing that we do is look for all HTML elements in the page that have string literals. These string literals will be replaced with keys that angular-translate uses to localize the content.

    Once the string literals are identified and replaced with keys, translation mapping that maps keys to translated content is created. In angular-translate, this mapping is nothing more than a JavaScript object, with the name of the property as the key and the value as the localized content. For example, this is the German translation mapping for the Start page:

		var translations = {
		      "START": {
		        "HEADER":"Bereit für ein Workout?",
		        "SELECT":"Wählen Workout",
		        "WORKOUTS":"Workouts",
		        "SEARCH":"Suchen Sie nach dem Training"
		    }
		};    

	The translations object is then registered with the angular-translate $translate service during the configuration stage:

		$translateProvider.translations('de', translations);

	Once the translations are registered, we are ready to use these translations in our app. There are three ways to use them:

		Using the $translate service: We can retrieve a specific translation in the controller using the $translate service. Although not used much, it allows us to get the localized version of a translation key. For example:

			$translate('START.HEADER').then(function (header) {
				$scope.header = header;
			});

		Using the translate filter: Replace the literal string with a translation key and apply the translate filter; 

			<h1>Ready for a Workout?</h1> // Replace this 
			<h1>{{'START.HEADER'|translate}}</h1>  // With this

		Using the translate directive: 

			The directive replaces the inner content of HTML on which it is declared with the translated text. This is how we use directives for translations:

			<h2 translate>START.WORKOUTS</h2>
			<-- OR -->
			<h2 translate="START.WORKOUTS"></h2>

		The nice thing about the translate directive is that it supports interpolations too, allowing a dynamic translation key.

			<h2 translate>{{scopeVariable}}</h2>
			<h2 translate="{{scopeVariable}}"></h2>

		Prefer the directive version over filter version as the directive does not create a watch-like filter. But remember, the translate directive may not work everywhere and in such scenarios, the filter is the only choice. 

			<input type="text" placeholder="{{'START.SEARCH'|translate}}" />

		We can set the default locale during the configuration stage using this:	

			$translateProvider.preferredLanguage('en');

		To actually change the locale any time during the app execution, we can call the following code:

			$translate.use('de'); // Change locale to German

		


