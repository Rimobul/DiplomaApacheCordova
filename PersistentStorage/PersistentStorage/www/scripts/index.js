// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);


    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);

        var db = null;
        db = window.sqlitePlugin.openDatabase({ name: 'database.db', location: 'default' });

        document.getElementById("btnInsertNew").addEventListener("click", function () {
            var text = "A string with number ";
            var randomNumber = Math.floor((Math.random() * 100000) + 1);
            text += randomNumber;

            var randomFloat = Math.random();
            var date = new Date();
            var dateNow = date.getFullYear() + "/" + (date.getMonth() + 1).toString() + "/" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();


            var binary = '';
            var arrayBuffer = new Array();
            for (var i = 0; i < 10; i++) {
                var randomInt = Math.floor((Math.random() * 10) + 1);
                arrayBuffer.push(randomInt)
            }
            var bytes = new Uint8Array(arrayBuffer);
            var len = bytes.byteLength;
            for (var i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }

            db.transaction(function (tx) {
                tx.executeSql('CREATE TABLE IF NOT EXISTS dataRecord (id INTEGER primary key autoincrement, myString TEXT, number NUMERIC, myDate DATETIME, binary BLOB)');
            }, function (error) {
                console.log('Transaction ERROR: ' + error.message);
            }, function () {
                console.log('Populated database OK');
            });
            db.transaction(function (tx) {
                tx.executeSql('INSERT INTO dataRecord (myString, number, myDate, binary)  VALUES (?,?,?,?) ', [text, randomFloat, dateNow, window.btoa(binary)]);
            }, function (error) {
                console.log('Transaction ERROR: ' + error.message);
            }, function () {
                console.log('Populated database OK');
            });


        });


        document.getElementById("btnSelectAll").addEventListener("click", function () {
            db.transaction(function (tx) {
                tx.executeSql('SELECT * FROM dataRecord', [], function (tx, results) {
                    var len = results.rows.length;
                    var tmpText = "";
                    for (var i = 0; i < len; i++) {
                        tmpText += "<br/>ID:" + results.rows.item(i).id + "<br/> String: " + results.rows.item(i).myString + "<br/> Float: "
                                + results.rows.item(i).number + "<br/> DateTime: " + results.rows.item(i).myDate + "<br/> Binary:" + results.rows.item(i).binary + "<br/><br/>";
                    }
                    document.getElementById("result").innerHTML = tmpText;
                }, function (tx, error) {
                    console.log('SELECT error: ' + error.message);
                });
            });
        });

        document.getElementById("btnDeleteAll").addEventListener("click", function () {
            db.transaction(function (tx) {
                tx.executeSql('DELETE FROM dataRecord', [], function (tx, results) {
                }, function (tx, error) {
                    console.log('SELECT error: ' + error.message);
                });
            });
        });
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
})();