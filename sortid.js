const axios = require('axios')
const async = require('async')
const _ = require('lodash')
const qs = require('querystring')
const cheerio = require('cheerio')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const baseURL = 'http://www.hottoys.com.hk'

const adapter = new FileSync('db.json')
const db = low(adapter)
db.defaults({
  products: [],
  fetchedPage: 0,
}).write()

const run = async () => {
  const products = db.get('products')
    .sortBy('id')
    .value()
  db.set('products', products)
    .write()
}

run()
