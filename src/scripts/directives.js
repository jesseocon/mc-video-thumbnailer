(function(window, angular, undefined) {
  'use strict';
  // Need to expose an api here to communicate with the video
  // Should have something that passes a video and then returns a dataImageUrl
  angular
    .module('mcVideoThumbnail.mcVideoThumbnail', [])
    .directive('thumbnailer', ['$timeout',
      function($timeout) {
        return {
          restrict: 'E',
          transclude: true,
          scope: {},
          templateUrl: './tpl_thumbnailer.html',
          link: function(scope, element) {
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
                sourceEl = element.find('video').find('source')[0],
                context = canvas.getContext('2d');

            scope.video      = element.find('video')[0];
            scope.dummyVideo = undefined;
            scope.thumbs     = [];
            scope.intervalID = undefined;

            setCanvasDims = function(vid) {
              canvas.width  = vid.videoWidth;
              canvas.height = vid.videoHeight;
            };

            createScreenshot = function(vid) {
              context.drawImage(video, 0, 0, vid.videoWidth, vid.videoHeight);
              scope.$apply(function() {
                scope.thumbs.push({ data: canvas.toDataURL('image/png')});
              });
            };

            startScreenshot = function(vid) {
              var crS = createScreenshot;
              scope.intervalID = setInterval(function(){
                crS(vid);
              }, 1000);
            };

            stopScreenshot = function(nInt) {
              clearInterval(scope.intervalID)
            };

            handleDummyVideoLoaded = function() {
              createScreenshot(scope.dummyVideo);
              startScreenshot(scope.dummyVideo);
            };

            handleDummyVideoEnded = function() {
              stopScreenshot(scope.intervalID);
            };

            createDummyVideo = function(e) {
              setCanvasDims(e.currentTarget);

              scope.dummyVideo = e.currentTarget.cloneNode(true);
              element.append(scope.dummyVideo);

              scope.dummyVideo.addEventListener('loadeddata', handleDummyVideoLoaded);
              scope.dummyVideo.addEventListener('ended', handleDummyVideoEnded);
              scope.dummyVideo.play();
            };

            scope.init = function() {
              $timeout(function() {
                video.addEventListener('loadeddata', createDummyVideo);
                sourceEl.addEventListener('error', function(e) {
                  console.log('there was an error loading the video: ', e)
                })
                video.addEventListener('error', function() {
                  console.log('the video errored out');
                });
              }, 0, false);
            };

            scope.init();
          }
        };
      }
    ]);

})(window, window.angular);
