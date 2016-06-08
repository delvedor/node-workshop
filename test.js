'use strict'

const tap = require('tap')
const test = tap.test
const mongojs = require('mongojs')
const db = mongojs('test', ['timeseries'])
const mongoClean = require('mongo-clean')

const point = require('./point')('test')

test('insert', (t) => {
  t.plan(5)
  t.is(typeof point.insert, 'function')
  // Correct insert
  let obj = {
    category: 'timetest',
    time: new Date(),
    data: {}
  }
  point.insert(obj, (err, value) => {
    err ? t.fail('insert error') : t.pass('insert ok!')
  })
  // Test the insert
  db.timeseries.findOne((err, value) => {
    if (err) {
      t.fail('find fails')
    } else {
      t.equal(obj.category, value.category)
      t.equal(obj.time.toISOString(), value.time.toISOString())
      t.deepEqual(obj.data, value.data)
    }
  })
})

test('fetch', (t) => {
  t.plan(3)
  t.is(typeof point.fetch, 'function')
  // Object to insert
  let obj = {
    category: 'timetest',
    time: new Date(),
    data: {}
  }
  // Object to find
  let find = {
    category: 'timetest',
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
  point.insert(obj, (err, value) => {
    if (err) {
      t.fail('fetch-test insert fails')
      return
    }
    // test fetch
    point.fetch(find, (err1, documents) => {
      err1 ? t.fail('fetch fails') : t.pass('fetch ok!')
    })
  })
  // test falsey
  point.fetch(findFalse, (err1, documents) => {
    err1 ? t.fail('fetch fails') : t.deepEqual(documents, [])
  })
})

// Clean the db every time
tap.beforeEach((done) => {
  mongoClean('mongodb://localhost:27017/test', (err, db) => {
    done(err)
    if (db) {
      db.close()
    }
  })
})

tap.tearDown(() => {
  db.close()
  mongoClean('mongodb://localhost:27017/test', (err, db) => {
    if (err) {
      throw err
    }
    point.close()
    db.close()
  })
})
