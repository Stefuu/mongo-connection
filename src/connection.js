'use strict'

require('dotenv').config()
const mongodb = require('mongodb').MongoClient
const log = require('debug')('[mongo-connection]')
log.log = console.log.bind(console)
const error = require('debug')('[mongo-connection]:error')

/**/
class Db {
	
	constructor(events, config) {
		config = config || {}
		config.options = config.options || {}

		let dbUrl = 'mongodb://'
		dbUrl += process.env.DATABASE_USER || config.user
		dbUrl += ':'
		dbUrl += process.env.DATABASE_PASS || config.pass
		dbUrl += '@'
		dbUrl += process.env.DATABASE_URI || config.uri
		dbUrl += '/'
		dbUrl += process.env.DATABASE_NAME || config.name
		dbUrl += '?authMechanism='
		dbUrl += process.env.DATABASE_AUTH_MECHANISM || config.auth_mechanism

		if(process.env.DATABASE_REPLICASET || config.replicaset) {
			dbUrl += '&replicaSet=' + process.env.DATABASE_REPLICASET || config.replicaset  
		}

		this.db = undefined
		this.isConnected = false
		this.count = {
			error: 0,
			disconnected: 0,
			reconnected: 0
		}
		this.dbUrl = dbUrl
		this.config = config
		this.events = events || {}
	}

	connect() {
		return mongodb.connect(this.dbUrl, this.config.options)
		.then(res => {
			this.isConnected = true
			this.db = res
			this.binds()
			return Promise.resolve(this.db)
		})
		.catch(err => {
			error('Could not connect to mongo, retrying in 5s...')
			setTimeout(() => {
	        	this.connect()
	      	}, 5000)
			return Promise.reject(err)
		})
	}

	disconnect() {
		return this.db.close()
		.then(() => {
			this.isConnected = false
			return Promise.resolve()
		})
		.catch(err => {
			return Promise.reject(err)
		})
	}

	/*************************
  	* Default event handling *
  	**************************/
	binds() {
	    this.db.on('connecting', () => {
      		log('MongoDB connecting...')
      		this.connecting()
    	})

	    this.db.on('open', () => {
	    	this.isConnected = true
	      	log('MongoDB connection is established')
	      	this.open()
	    })

	    this.db.on('error', err => {
	      	this.isConnected = false
	      	this.count.error++
	        error('MongoDB connection error: ' + JSON.stringify(err))
	        this.error()
	    })

	    this.db.on('disconnected', () => {
	    	this.isConnected = false
	    	this.count.disconnected++
	      	error('MongoDB disconnected!')
	      	this.disconnected()
	    })

	    this.db.on('reconnected', () => {
	    	this.isConnected = true
	    	this.count.reconnected++
	      	log('MongoDB reconnected!')
	      	this.reconnected()
	    })

	    this.db.on('close', () => {
	    	this.isConnected = false
	    	this.count.error = 0
	    	this.count.disconnected = 0
	    	this.count.reconnected = 0
	      	log('MongoDB closed!')
	      	this.close()
	    })

	    // If the Node process ends, close the connection
	    process.on('SIGINT', function() {
	    	this.isConnected = false
	      	this.db.close(function () {
	        	log('Mongo default connection disconnected through app termination')
	        	process.exit(0)
	      	})
	    })
  	}

  	/**************************************
  	* Custom callbacks for event handling *
  	***************************************/
  	connecting() {
		if(typeof this.events.connecting == 'function'){
			this.events.connecting()
		}
	}

	open() {
		if(typeof this.events.open == 'function'){
			this.events.open()
		}
	}

	error() {
		if(typeof this.events.error == 'function'){
			this.events.error()
		}
	}

	disconnected() {
		if(typeof this.events.disconnected == 'function'){
			this.events.disconnected()
		}
	}

	reconnected() {
		if(typeof this.events.reconnected == 'function'){
			this.events.reconnected()
		}
	}

	close() {
		if(typeof this.events.close == 'function'){
			this.events.close()
		}
	}
}

module.exports = Db