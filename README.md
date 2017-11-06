# mongo-connection
An abstraction of a mongo connection using mongodb driver

## Installation
```
npm install --save mongo-connection
```

## Usage
Instance the connection class like so:

```javascript
/* 
The 'config' parameter can be null if you prefer to use the following node enviroment variables
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
You can set custom events for you mongo connection instance like so:

```javascript
// custom code that will run after the event triggers
let events = {
  disconnected: function(){
    
  },
  connecting: function(){
    
  },
  open: function(){
    
  },
  error: function(){
    
  },
  reconnected: function(){
    
  },
  close: function(){
    
  }
}

mongoInstance.setEvents(events)
```