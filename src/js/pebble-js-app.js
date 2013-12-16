/* from wunderspy
 * tasks:
 *    "recurrence_count":0,
 *    "updated_at":"2013-03-03T19:36:28Z",
 *    "assignee_id":null,
 *    "completed_at":null,
 *    "updated_by_id":"owner",
 *    "recurrence_type":null,
 *    "deleted_at":null,
 *    "id":"id",
 *    "user_id":"owner",
 *    "title":"test",
 *    "recurring_parent_id":null,
 *    "note":null,
 *    "parent_id":null,
 *    "version":1,
 *    "list_id":"inbox",
 *    "type":"Task",
 *    "owner_id":"owner",
 *    "due_date":"2013-03-03",
 *    "created_by_id":"owner",
 *    "created_at":"2013-03-03T19:36:28Z",
 *    "local_identifier":null,
 *    "position":0.0,
 *    "starred":true
 **/

tasks = {};
lists = {};
lists.addTask = function (task) {
  if (lists[task.list_id] == null) {
    lists[task.list_id] = [task.id];
  } else {
    lists[task.list_id].push(task.id);
  }
};

//TODO reminders = {};

baseUrl = 'https://api.wunderlist.com';

function readyCallback(e) {
  if (!supports_html5_storage()) {
    console.log("localStorage not supported!");
    return;
  }
  var confString = localStorage.getItem("config");
  if (confString == null) {
    console.log("No saved configuration!");
    return;
  }
  console.log("Saved configuration:");
  console.log(confString);
  configuration = JSON.parse(confString);
  getTasks();

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
  if(e.payload["fetch"]) {
    readyCallback();
  }
}

/*
var transactionId = Pebble.sendAppMessage( 
                                          { "0": 42, "1": "String value" },
                                          function(e) {
                                            console.log("Successfully delivered message with transactionId="
                                                        + e.data.transactionId);
                                          },
                                          function(e) {
                                            console.log("Unable to deliver message with transactionId="
                                                        + e.data.transactionId
                                                        + " Error is: " + e.error.message);
                                          }
                                         );
*/
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

function getTasks() {
  url = baseUrl+"/me/tasks";
  sendGet(url, tasksCallback);
}

function tasksCallback(jsonResponse) {
  jsonResponse.forEach(function (entry){
  //TODO add a show completed and deleted option
    if (entry["deleted_at"] == null &&
        entry["completed_at"] == null) {
      console.log(entry.list_id + ": " + entry.title);
    tasks[entry.id] = entry;
    lists.addTask(entry);
    if(entry.list_id == "inbox") {
      Pebble.sendAppMessage({ "append": entry.title });
    }
    }
  });
}

function getLists() {
  url = baseUrl + "/me/lists";
  sendGet(url, listsCallback);
}

function listsCallback(jsonResponse) {
  
}

function sendGet(url, callback) {
  var client = new XMLHttpRequest();
  client.open('GET', url);
  client.setRequestHeader('Authorization', 'Bearer '+configuration.token);
  var target = this;
  client.onload  = function() {target.parseJSON(client, callback)};
  client.send();
}

function parseJSON(req, callback) {
  console.log("Got response code: " + req.status);
  if (req.status == 200) {
    var jsonResponse = JSON.parse(req.responseText);
    callback(jsonResponse);
  }
}
