// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {

        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);


        document.getElementById("btnPhoto").addEventListener("click", function () {
            navigator.camera.getPicture(onSuccess, onFail, {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI
            });
        });

        document.getElementById("btnLocation").addEventListener("click", function () {
            navigator.geolocation.getCurrentPosition(onGPSSuccess, onGPSError);
        });
    };

    var onGPSSuccess = function (position) {
        document.getElementById("locationDiv").innerHTML = 'Latitude: ' + position.coords.latitude + '\n' +
              'Longitude: ' + position.coords.longitude + '\n';
    };

    // onError Callback receives a PositionError object
    //
    function onGPSError(error) {
        alert('code: ' + error.code + '\n' +
              'message: ' + error.message + '\n');
    }



    function onSuccess(imageURI) {
        var image = document.getElementById('lastPhotoDiv');
        image.src = imageURI;
    }

    function onFail(message) {
        alert('Failed because: ' + message);
    }
    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
})();