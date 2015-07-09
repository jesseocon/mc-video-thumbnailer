/**
 * mc-video-thumbnail v0.1.0 ()
 * Copyright 2015 Jesse Ocon
 * Licensed under MIT
 */
'use strict';

(function (window, angular, undefined) {
  'use strict';

  angular.module('mcVideoThumbnail.controllers', []).controller('TestController', ['$scope', function ($scope) {
    var message = 'Hello world!';
    $scope.message = message;
  }]);
})(window, window.angular);
'use strict';

(function (window, angular, undefined) {
  'use strict';
  // Need to expose an api here to communicate with the video
  // Should have something that passes a video and then returns a dataImageUrl
  angular.module('mcVideoThumbnail.mcVideoThumbnail', []).directive('testDirective', ['$timeout', function ($timeout) {
    return {
      restrict: 'E',
      transclude: true,
      scope: {},
      templateUrl: './tpl_thumbnailer.html',
      link: function link(scope, element) {
        // Locals
        var createScreenshot,
            setCanvasDims,
            createDummyVideo,
            video2,
            handleDummyVideoLoaded,
            handleDummyVideoEnded,
            startScreenshot,
            stopScreenshot,
            canvas = element.find('canvas')[0],
            video = element.find('video')[0],
            context = canvas.getContext('2d');

        scope.video = element.find('video')[0];
        scope.dummyVideo = undefined;
        scope.thumbs = [];
        scope.intervalID = undefined;

        // What if the height needs to be modified?
        // We should just pass in the dims
        setCanvasDims = function (vid) {
          canvas.width = vid.videoWidth;
          canvas.height = vid.videoHeight;
        };

        createScreenshot = function (vid) {
          context.drawImage(video, 0, 0, vid.videoWidth, vid.videoHeight);
          scope.$apply(function () {
            scope.thumbs.push({ data: canvas.toDataURL('image/png') });
          });
        };

        startScreenshot = function (vid) {
          var crS = createScreenshot;
          scope.intervalID = setInterval(function () {
            crS(vid);
          }, 1000);
        };

        stopScreenshot = function (nInt) {
          clearInterval(scope.intervalID);
        };

        handleDummyVideoLoaded = function () {
          createScreenshot(scope.dummyVideo);
          startScreenshot(scope.dummyVideo);
        };

        handleDummyVideoEnded = function () {
          stopScreenshot(scope.intervalID);
        };

        createDummyVideo = function (e) {
          setCanvasDims(e.currentTarget);

          scope.dummyVideo = e.currentTarget.cloneNode(true);
          element.append(scope.dummyVideo);

          scope.dummyVideo.addEventListener('loadeddata', handleDummyVideoLoaded);
          scope.dummyVideo.addEventListener('ended', handleDummyVideoEnded);
          scope.dummyVideo.play();
        };

        scope.init = function () {
          $timeout(function () {
            video.addEventListener('loadeddata', createDummyVideo);
            video.addEventListener('error', function () {
              console.log('the video errored out');
            });
          }, 0, false);
        };

        scope.init();
      }
    };
  }]);
})(window, window.angular);
"use strict";
'use strict';

(function (window, angular, undefined) {
  'use strict';

  angular.module('mcVideoThumbnail', ['mcVideoThumbnail.controllers', 'mcVideoThumbnail.mcVideoThumbnail']);
})(window, window.angular);