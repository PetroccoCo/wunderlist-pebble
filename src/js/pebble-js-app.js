Pebble.addEventListener("ready",
    function(e) {
        console.log("Hello world! - Sent from your javascript application.");
    }
);
Pebble.addEventListener("showConfiguration",
    function(e) {
        console.log("showConfiguration called!");
        Pebble.openURL();
    }
);
Pebble.addEventListener("webviewclosed",
                         function(e) {
                             console.log("Configuration window returned: " + e.configurationData);
                           }
                       );
