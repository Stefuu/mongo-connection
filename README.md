# mongo-connection
An abstraction of a mongo connection using mongodb driver.

## GIT
https://github.com/Stefuu/mongo-connection

## Installation
```
npm install --save mongo-connection
```

## Usage
Instance the connection class like so:

```javascript
/* 
The 'config' parameter can be null if you prefer to
use the following node enviroment variables:
DATABASE_NAME=<NAME>
DATABASE_URI=<URI>
DATABASE_USER=<USER>
DATABASE_PASS=<PASS>
DATABASE_AUTH_MECHANISM=<AUTH>
DATABASE_REPLICASET=<REPLICASET>
*/
let config = {
  name: "<DATABASE_NAME>",
  user: "<DATABASE_USERNAME>",
  pass: "<DATABASE_PASSWORD>",
  auth_mechanism: "<DATABASE_AUTH_MECHANISM>",
  uri: "<DATABASE_URI>", //host and port -> "myhost.com:23691",
  replicaset: "<DATABASE_REPLICASET>"
}

// Mongo options (opitional)
config.options: {
  "readPreference": "ReadPreference.SECONDARY_PREFERRED",
  "keepAlive": 1000,
  "connectTimeoutMS": 30000,
  "poolSize": 5,
  "autoReconnect": true,
  "reconnectInterval": 30000,
  "reconnectTries": 240
}

let Db = require('mongo-connection')
let mongoInstance = new Db(config)

mongoInstance.connect()
.then(db => {  
  //now you can use it like so
  let collection = db.collection('<MY_COLLECTION>')  
  collection.find({})
  .toArray()
  .then(docs => {
    //do something cool with query result
  })
})
.catch(err => {
  console.log(err)
})
```

### Custom events
You can set custom events for your mongo connection instance like so:

```javascript
// custom code that will run after the event triggers
let events = {
  disconnected: function(){
    //some code
  },
  connecting: function(){
    //some code
  },
  open: function(){
    //some code
  },
  error: function(){
    //some code
  },
  reconnected: function(){
    //some code
  },
  close: function(){
    //some code
  }
}

mongoInstance.setEvents(events)
```