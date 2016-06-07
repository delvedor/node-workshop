'use strict'

const test = require('tape')
const point = require('./point')
const mongojs = require('mongojs')
const db = mongojs('test', ['timeseries'])
const mongoClean = require('mongo-clean')
mongoClean('mongodb://localhost:27017/test', function () {})

test('insert', function (t) {
  t.plan(6)
  t.is(typeof point.insert, 'function')
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
  // Wrong insert
  point.insert({
    category: 42,
    time: new Date(),
    data: {}
  }, function callback (err, value) {
    if (err) {
      t.pass('ok!')
    } else {
      t.fail('insert error 2')
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
  t.plan(3)
  t.is(typeof point.fetch, 'function')
  let obj = {
    category: 'prova',
    time: new Date(),
    data: {}
  }
  let find = {
    category: 'prova',
    from: obj.time,
    to: obj.time
  }
  let findFalse = {
    category: 'nope',
    from: new Date(),
    to: new Date()
  }
  point.insert(obj, function callback (err, value) {
    if (err) console.log(err)
    point.fetch(find, function (err1, documents) {
      if (err1) {
        t.fail('fetch fails')
      } else {
        t.pass('fetch ok!')
      }
    })
  })
  point.fetch(findFalse, function (err1, documents) {
    if (err1) {
      t.fail('fetch fail')
    } else {
      t.deepEqual(documents, [])
    }
  })
})

test.onFinish(function () {
  mongoClean('mongodb://localhost:27017/test', function () {})
})
