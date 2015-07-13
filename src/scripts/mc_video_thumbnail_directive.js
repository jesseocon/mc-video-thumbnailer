(function(window, angular, undefined) {
  'use strict';
  // Need to expose an api here to communicate with the video
  // Should have something that passes a video and then returns a dataImageUrl
  angular
    .module('mcVideoThumbnailDirective', [])
    .directive('mcVideoThumbnail', ['$timeout', 'mcVideoThumbnailSettings',
      function($timeout, mcVideoThumbnailSettings) {
        return {
          restrict: 'E',
          transclude: true,
          scope: {
            close: '&onClose',
            onCreatedThumb: '&', // Returns single thumb after each one
            onCreatedThumbs: '&',// Returns all thumbs at the end
            stopper: '=stopper'
          },
          template: '<canvas id="mc-thumbnailer-canvas"></canvas>' +
                    '<ng-transclude></ng-transclude>',
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
                removeDummyVideo,
                canvas = element.find('canvas')[0],
                video = element.find('video')[0],
                sourceEl = element.find('video').find('source')[0],
                context = canvas.getContext('2d'),
                max_thumbnails = mcVideoThumbnailSettings.max_thumbnails,
                thumbnail_interval = mcVideoThumbnailSettings.thumbnail_interval;

            scope.$on('mc.thumbnailer.stop', function(e, args) {
              stopScreenshot();
            });

            scope.video      = element.find('video')[0];
            scope.dummyVideo = undefined;
            scope.thumbs     = [];
            scope.intervalID = undefined;

            setCanvasDims = function(vid) {
              canvas.width  = vid.videoWidth;
              canvas.height = vid.videoHeight;
            };

            createScreenshot = function(vid) {
              var img;
              context.drawImage(vid, 0, 0, vid.videoWidth, vid.videoHeight);
              img = canvas.toDataURL('image/png')
              scope.$apply(function() {
                scope.thumbs.push({ data: img});
              });
              return img;
            };

            startScreenshot = function(vid) {
              var thumb, counter = 1;
              scope.intervalID = setInterval(function(){
                if (counter >= max_thumbnails) {
                  stopScreenshot();
                }
                thumb = createScreenshot(vid);
                scope.onCreatedThumb({img: thumb}); // Callback to the wrapping directive with the thumb
                counter++;
              }, thumbnail_interval);
            };

            stopScreenshot = function() {
              clearInterval(scope.intervalID);
              removeDummyVideo();
            };

            removeDummyVideo = function() {
              element[0].removeChild(scope.dummyVideo);
              scope.dummyVideo = null;
            };

            handleDummyVideoLoaded = function() {
              startScreenshot(scope.dummyVideo);
            };

            handleDummyVideoEnded = function() {
              stopScreenshot(scope.intervalID);
            };

            createDummyVideo = function(e) {
              setCanvasDims(e.currentTarget);

              // Add the element to the DOM
              scope.dummyVideo = e.currentTarget.cloneNode(true);
              element.append(scope.dummyVideo);
              scope.dummyVideo.muted = true;
              scope.dummyVideo.style.display = 'none';

              scope.dummyVideo.addEventListener('loadeddata', handleDummyVideoLoaded);
              scope.dummyVideo.addEventListener('ended', handleDummyVideoEnded);

              scope.dummyVideo.load();
              scope.dummyVideo.play();
            };

            scope.init = function() {
              $timeout(function() {
                // For some reason chrome will create a pending request
                // on the second video if the video isn't activated and paused
                video.addEventListener('loadeddata', function(e) {
                  this.play();
                  this.pause();
                  createDummyVideo(e);
                });
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
