function readyCallback(e) {
  console.log("Hello world! - Sent from your javascript application.");
}

function showConfigurationCallback(e) {
  console.log("showConfiguration called!");
  var url = "https://basejumper9.github.io/wunderlist-pebble/";
  Pebble.openURL(url);
}

function webviewclosedCallback(e) {
  try {
    var configuration = JSON.parse(e.response);
    console.log("Configuration window returned: ", configuration);
    console.log("Configuration window returned: " + e.configurationData);
    console.log("webview closed");
    console.log(e.type);
    console.log(e.response);
  } catch (ignored) {}
}

function appmessageCallback(e) {
  console.log(e.type);
  console.log(e.payload.temperature);
  console.log("message!");
}

Pebble.addEventListener("ready", readyCallback);
Pebble.addEventListener("showConfiguration", showConfigurationCallback);
Pebble.addEventListener("webviewclosed", webviewclosedCallback);
Pebble.addEventListener("appmessage", appmessageCallback);

function supports_html5_storage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}

function sendGet(url) {
  var client = new XMLHttpRequest();
  client.open('GET', url);
  client.setRequestHeader('X-Test', 'one');
  var target = this;
  client.onload  = function() {target.parseJSON(req, url)};
  client.send();
}

function parseJSON(req, url) {
  if (req.status == 200) {
    var jsonResponse = JSON.parse(req.responseText);
    console.log(jsonResponse);
  }
}
