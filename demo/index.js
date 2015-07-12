'use strict';

angular
  .module('demoApp', [
    'mcVideoThumbnail'
  ])
  .controller('demoMainController', function($scope) {
  })
  .directive('wrappingDirective', function() {
    return {
      restrict: 'EA',
      templateUrl: './tpl_wrapping_directive.html',
      scope: {},
      link: function(scope, element, attrs) {
      }
    };
  });
