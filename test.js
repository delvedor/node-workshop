'use strict'

const test = require('tape')
const mongojs = require('mongojs')
const db = mongojs('test', ['timeseries'])
const mongoClean = require('mongo-clean')
// Clean the db
mongoClean('mongodb://localhost:27017/test', function () {})

const point = require('./point')('test')

test('insert', function (t) {
  t.plan(6)
  t.is(typeof point.insert, 'function')
  // test the validator
  point.insert({
    category: 42,
    time: new Date(),
    data: {}
  }, function callback (err, value) {
    if (err) {
      t.pass('validator ok!')
    } else {
      t.fail('validator fails')
    }
  })
  // Correct insert
  let obj = {
    category: 'prova',
    time: new Date(),
    data: {}
  }
  point.insert(obj, function callback (err, value) {
    if (err) {
      t.fail('insert error 1')
    } else {
      t.pass('ok!')
    }
  })
  // Test the insert
  db.timeseries.findOne(function (err, value) {
    if (err) t.fail('find fails')
    t.equal(obj.category, value.category)
    t.equal(obj.time.toISOString(), value.time.toISOString())
    t.deepEqual(obj.data, value.data)
  })
})

test('fetch', function (t) {
  t.plan(4)
  t.is(typeof point.fetch, 'function')
  // Test the validator
  point.fetch({}, function callback (err, result) {
    err ? t.pass('validator ok!') : t.fail('vailidator fails')
  })
  // Object to insert
  let obj = {
    category: 'prova',
    time: new Date(),
    data: {}
  }
  // Object to find
  let find = {
    category: 'prova',
    from: obj.time,
    to: obj.time
  }
  // Falsey result
  let findFalse = {
    category: 'nope',
    from: new Date(),
    to: new Date()
  }
  // Insert the object
  point.insert(obj, function callback (err, value) {
    if (err) console.log(err)
    // test fetch
    point.fetch(find, function (err1, documents) {
      if (err1) {
        t.fail('fetch fails')
      } else {
        t.pass('fetch ok!')
      }
    })
  })
  // test falsey
  point.fetch(findFalse, function (err1, documents) {
    if (err1) {
      t.fail('fetch fail')
    } else {
      t.deepEqual(documents, [])
    }
  })
})

// Clean the db every time
test.onFinish(function () {
  mongoClean('mongodb://localhost:27017/test', function () {})
})
