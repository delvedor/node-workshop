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
  db.timeseries.insert(obj, (err) => {
    callback(err || null)
  })
}

// Fetch keys
function fetch (obj, callback) {
  db.timeseries.find({
    category: obj.category,
    time: {
      '$lte': obj.to,
      '$gte': obj.from
    }
  }, (err, documents) => {
    callback(err || null, documents || null)
  })
}

module.exports = function build (dbName) {
  dbName = dbName || 'test'
  db = mongojs(dbName, ['timeseries'])
  return {
    insert: insert,
    fetch: fetch,
    close: db.close.bind(db),
    insertVal: insertVal,
    fetchVal: fetchVal
  }
}
