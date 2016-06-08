'use strict'
const mongojs = require('mongojs')
const Joi = require('Joi')

let db = null
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
  Joi.validate(obj, insertVal, (err, value) => {
    if (err) {
      callback(err, null)
    } else {
      db.timeseries.insert(obj, (err1) => {
        callback(err1 || null, value || null)
      })
    }
  })
}

// Fetch keys
function fetch (obj, callback) {
  Joi.validate(obj, fetchVal, (err, value) => {
    if (err) {
      callback(err, null)
    } else {
      db.timeseries.find({
        category: obj.category,
        time: {
          '$lte': obj.to,
          '$gte': obj.from
        }
      }, (err1, documents) => {
        callback(err1 || null, documents || null)
      })
    }
  })
}

module.exports = function build (dbName) {
  dbName = dbName || 'test'
  db = mongojs(dbName, ['timeseries'])
  return {
    insert: insert,
    fetch: fetch,
    close: db.close.bind(db)
  }
}
