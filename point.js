'use strict'
const mongojs = require('mongojs')
const Joi = require('Joi')

const db = mongojs('test', ['timeseries'])
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
  Joi.vaidate(obj, fetchVal, function (err, value) {
    if (err) console.log(err)
    console.log(value)
  })
}

module.exports.insert = insert
module.exports.fetch = fetch

