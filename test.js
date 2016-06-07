'use strict'

const test = require('tape')
const point = require('./point')
// const mongojs = require('mongojs')
// const db = mongojs('test', ['timeseries'])

test('insert', function (t) {
  t.plan(3)
  t.is(typeof point.insert, 'function')
  // Correct insert
  point.insert({
    category: 'prova',
    time: new Date(),
    data: {}
  }, function callback (err, value) {
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
})

test('fetch', function (t) {
  t.plan(1)
  t.is(typeof point.fetch, 'function')
})

