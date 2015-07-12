# mc-video-thumbnail

Uses canvas element to create thumbnails from broswer supported
HTML5 videos

## Usage
index.html
```html
<!-- The on-created-thumb will be available in the parent scope and function should be defined there -->
<mc-video-thumbnail on-created-thumb="getImage(img)">
  <!-- this content will be transcluded -->
  <video crossorigin="anonymous">
    <source src="yourpath/to/media.mp4" type="video/mp4"></source>
  </video>
</mc-video-thumbnail>
```
The on-created-thumb attribute is a callback and returns one argument: img.
The callback will be fired each time a thumbnail is created and will return a data/png dataURL.
Keep in mind that if you are trying to thumbnail a video that is not at the same origin
you will have to set up CORS on the server that is hosting the video or the thumbnailing process
will not work

app.js
include mcVideoThumbnail in your modules dependencies
```javascript
angular.module('yourModule', [mcVideoThumbnail])
  // Set the thumbnail_interval and max_thumbnails in your app config
  .config(['mcVideoThumbnailSettingsProvider', function(mcVideoThumbnailSettingsProvider) {
    mcVideoThumbnailSettingsProvider.set('max_thumbnails', 20); // takes integer
    mcVideoThumbnailSettingsProvider.set('thumbnail_interval', 200); // takes integer -- in milliseconds
  }])
  .controller('MyAppController', ['$scope',
    function($scope) {
      // This function will fire at each interval set in the settings
      // The default interval is 1000ms
      $scope.getImage = function(img) {
        // do something with the img
      }
    }
  ])
```

## Installation

```console
bower install jesseocon/mc-video-thumbnail --production
```

## Development

1. Clone the repo or [download]().
2. ``npm install && bower install``
3. Setup E2E testing environment: ``npm install -g protractor && webdriver-manager update --standalone``
4. Run ``gulp watch`` and open [http://localhost:8080/demo/index.html](http://localhost:8080/demo/index.html)
5. Use ``gulp test-unit`` or ``gulp test-e2e`` to execute your tests
6. Finally, be sure that selenium driver is up: ``webdriver-manager start`` and run ``gulp build``

## License

MIT
