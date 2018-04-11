// server.js
// Module 3 Lab Tutorial
// Introduction to nodejs: Microsoft

// GET /accounts
// POST /accounts
// PUT /accounts/:id
// DELETE /accounts/:id

// morgan
// body-parser
// errorhandler
// mongodb: for course it's ok 2.x version, but there is new version 3.x

// npm install <module> -E

const express = require('express')
const logger = require('morgan')
const errorhandler = require('errorhandler')
const mongodb = require('mongodb')
const bodyParser = require('body-parser')

const url = 'mongodb://localhost:27017/edx-course-db'
const port = 3000
let app = express()
app.use(logger('dev'))
app.use(bodyParser.json())

mongodb.MongoClient.connect(url, (error, client) => {
	if (error) return process.exit(1)
	var db = client.db('edx-course-db')
	console.log('Connected successfully to server')
	
	app.get('/accounts', (req, res) => {
		db.collection('accounts')
			.find({}, {sort: {_id: -1}})
			.toArray((error, accounts) => {
				if (error) return next(error)
				res.send(accounts)
			})
	})

	app.get('/accounts/:id', (req, res) => {
		db.collection('accounts')
			.find({ _id: mongodb.ObjectID(req.params.id)}, {sort: { _id: -1}})
			.toArray((error, accounts) => {
				if (error) return next(error)
				res.send(accounts)
			})
	})

	app.post('/accounts', (req, res) => {
		let newAccount = req.body
		db.collection('accounts').insert(newAccount, (error, results) => {
			if (error) return next(error)
			res.send(results)
		})
	})

	app.put('/accounts/:id', (req, res) => {
		db.collection('accounts')
			.update({_id: mongodb.ObjectID(req.params.id)},
				{$set: req.body},
				(error, results) => {
					if (error) return next(error)
					res.send(results)
				})
	})

	app.delete('/accounts/:id', (req, res) => {
		db.collection('accounts')
			.remove({_id: mongodb.ObjectID( req.params.id )}, (error, results) => {
				if (error) return next(error)
				res.send(results)
			})
	})

	app.use(errorhandler())
	app.listen(port)
})