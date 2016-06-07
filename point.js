'use strict'
const mongojs = require('mongojs')
const Joi = require('Joi')

let db
const insertVal = Joi.object().keys({
  category: Joi.string().required(),
  time: Joi.date().required(),
  data: Joi.object().required()
})
const fetchVal = Joi.object().keys({
  category: Joi.string().required(),
  from: Joi.date().required(),
  to: Joi.date().required()
})

// Insert a key
function insert (obj, callback) {
  Joi.validate(obj, insertVal, function (err, value) {
    if (err) {
      callback(err, null)
    } else {
      db.timeseries.insert(obj, function (err) {
        callback(err || null, value || null)
      })
    }
  })
}

// Fetch keys
function fetch (obj, callback) {
  Joi.validate(obj, fetchVal, function (err, value) {
    if (err) {
      callback(err, null)
    } else {
      db.timeseries.find({
        category: obj.category,
        time: {
          '$lte': obj.to,
          '$gte': obj.from
        }
      }, function (err1, documents) {
        if (err1) {
          callback(err1, null)
        } else {
          callback(null, documents)
        }
      })
    }
  })
}

module.exports = function build (dbName) {
  dbName = dbName || 'test'
  db = mongojs(dbName, ['timeseries'])
  return {
    insert: insert,
    fetch: fetch
  }
}
