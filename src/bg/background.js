(function() {
    var Uid;
    var app = {}
    var sessId;


    app.getUID = function() {

        $.getJSON("http://localhost:32017/Spokes/DeviceServices/Info", function(data) {

            Uid = data.Result.Uid

        }).fail(function() {
            new Notification("Error: Unable to Connect to Hub App")
        })

    }

    app.getSession = function() {

        var sessUrl = "http://localhost:32017/Spokes/DeviceServices/Attach?uid=" + Uid;

        $.getJSON(sessUrl, function(data) {

            sessId = data.Result

        }).fail(function() {
            new Notification("Error: Unable to Get Session ID")

        })

    }

    app.getStatus = function() {

        var statusUrl = "http://localhost:32017/Spokes/DeviceServices/Events?sess=" + sessId + "&queue=0"

        $.getJSON(statusUrl, function(data) {

            if (!!data.Result) {

                if (data.Result[0]) {

                    if (data.Result[0].Event_Name == "PSTNIncomingCallRingOn" || data.Result[1].Event_Name == "PSTNIncomingCallRingOn") {

                        new Notification("Incoming Call")
                        var myAudio = new Audio();
                        myAudio.src = "src/bg/ringer.mp3";
                        myAudio.play();

                    }

                }

            }
            // If Session Key Expires
            if (!!data.isError) {
                app.init()
            }

        }).fail(function() {
            new Notification("Error: Unable to Get Status")
        })

    }

    app.init = function() {
        app.getUID();
        app.getSession()
        app.getStatus()
    }
    
    app.init();

    setInterval(function() {
        app.getStatus()
    }, 500);
})()