'use strict';

angular.module('app', ['ngRoute', 'ngSanitize', 'workout', 'WorkoutBuilder', 'mediaPlayer', 
    'ui.bootstrap', 'ngAnimate', 'LocalStorageModule', 'ngMessages', 'ngResource', 'pascalprecht.translate']);
angular.module('workout', []);
angular.module('WorkoutBuilder', []);
