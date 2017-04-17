// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );
        
        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        var parentElement = document.getElementById('deviceready');
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        createClient();
    };

    function createClient() {
        client = new WindowsAzure.MobileServiceClient('https://diplomamobileapp.azurewebsites.net');

        if (useOfflineSync) {
            initializeStore().then(setup);
        } else {
            setup();
        }

        client.login('google').then(function () {
            // Create a table reference
            todoItemTable = client.getTable('todoitem');

            // Refresh the todoItems
            refreshDisplay();

            // Wire up the UI Event Handler for the Add Item
            $('#add-item').submit(addItemHandler);
            $('#refresh').on('click', refreshDisplay);

            // Added to register for push notifications.
            registerForPushNotifications();

        }, handleError);
    };

    function registerForPushNotifications() {
        // Register for Push Notifications. Requires that phonegap-plugin-push be installed.
        var pushRegistration = null;
        function registerForPushNotifications() {
            pushRegistration = PushNotification.init({
                android: { senderID: '554708347996' },
                ios: { alert: 'true', badge: 'true', sound: 'true' },
                wns: {}
            });

            // Handle the registration event.
            pushRegistration.on('registration', function (data) {
                // Get the native platform of the device.
                var platform = device.platform;
                // Get the handle returned during registration.
                var handle = data.registrationId;
                // Set the device-specific message template.
                if (platform === 'android' || platform === 'Android') {
                    // Register for GCM notifications.
                    client.push.register('gcm', handle, {
                        mytemplate: { body: { data: { message: "{$(messageParam)}" } } }
                    });
                } else if (device.platform === 'iOS') {
                    // Register for notifications.
                    client.push.register('apns', handle, {
                        mytemplate: { body: { aps: { alert: "{$(messageParam)}" } } }
                    });
                } else if (device.platform === 'windows') {
                    // Register for WNS notifications.
                    client.push.register('wns', handle, {
                        myTemplate: {
                            body: '<toast><visual><binding template="ToastText01"><text id="1">$(messageParam)</text></binding></visual></toast>',
                            headers: { 'X-WNS-Type': 'wns/toast' }
                        }
                    });
                }
            });

            pushRegistration.on('notification', function (data, d2) {
                alert('Push Received: ' + data.message);
            });

            pushRegistration.on('error', handleError);
        }
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
} )();