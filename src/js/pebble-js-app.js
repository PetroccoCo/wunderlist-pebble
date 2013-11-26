function readyCallback(e) {
  if (supports_html5_storage()) {
    var confString = localStorage.getItem("config");
    if (confString != null) {
      console.log(confString);
      configuration = JSON.parse(confString);
    } else {
      console.log("No saved configuration!");
    }
  } else {
    console.log("localStorage not supported!");
  }
}

function showConfigurationCallback(e) {
  var url = "http://basejumper9.github.io/wunderlist-pebble/index.html";
  Pebble.openURL(url);
}

function webviewclosedCallback(e) {
    console.log(e.response);
    if (supports_html5_storage()){
      localStorage.setItem('config', e.response);
    }
    configuration = JSON.parse(e.response);
    console.log("Configuration window returned: ", configuration);
}

function appmessageCallback(e) {
  console.log("message!");
  console.log("obj: " + e);
  console.log("type: " + e.type);
  console.log("payload: " + e.payload);
  console.log("payload pp: " + JSON.stringify(e.payload, null, 2));
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
  client.setRequestHeader('Authorization', 'Bearer '+configuration.token);
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
