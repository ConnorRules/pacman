'use strict';

var MongoClient = require('mongodb').MongoClient;
var config = require('./config');
var _db;
const opentelemetry = require('@opentelemetry/api');
const tracer = opentelemetry.trace.getTracer('pacman-mongodb');

function Database() {
    this.connect = function(app, callback) {
        const span = tracer.startSpan('mongodb_call', { 'kind':opentelemetry.SpanKind.CLIENT });
        span.addEvent('Connecting to DB');
        span.setAttribute('db.name',db.name);
        span.setAttribute('db.system',db.system);
	MongoClient.connect(config.database.url,
                                config.database.options,
                                function (err, db) {
                                    if (err) {
                                        console.log(err);
                                        console.log(config.database.url);
                                        console.log(config.database.options);
                                    } else {
                                        _db = db;
                                        app.locals.db = db;
                                    }
                                    callback(err);
                                });
	span.end();
    }

    this.getDb = function(app, callback) {
        if (!_db) {
            this.connect(app, function(err) {
		if (err) {
                    console.log('Failed to connect to database server');
                } else {
                    console.log('Connected to database server successfully');
                }

                callback(err, _db);
            });
        } else {
            callback(null, _db);
        }

    }
}

module.exports = exports = new Database(); // Singleton
