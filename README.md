# mongo-connection
An abstraction of a mongo connection using mongodb driver

## Installation
```
npm install --save mongo-connection
```

## Usage
Create a instance of the connection class like so:

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

// custom code that will run after the event triggers (can be null)
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

let Db = require('mongo-connection')
let dbInstance = new Db(events, config)

dbInstance.connect()
.then(() => {
  let db = dbInstance.db //this is your mongo connection
  
  //now you can use it like so
  let collection = db.collection('<MY_COLLECTION>')  
  collection.find({})
  .toArray()
  .then(docs => {
    console.log(docs)
    //do something cool with query result
  })
})
.catch(err => {
  console.log(err)
})
```
