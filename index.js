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
  const pageCount = _.times(1, (n) => n)
  const query = {
    chkLicenseAll: 'y',
    chkAdvAll: 'y',
    set: undefined,
  }
  await async.eachSeries(pageCount, async (n) => {
    const page = (db.get('fetchedPage').value() || 0) + 1
    console.log(`Current page is : ${page}`)
    query.set = page
    const response = await axios({
      url: 'http://www.hottoys.com.hk/ajax/searchProductList.php',
      method: 'POST',
      data: qs.stringify(query),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    const $ = cheerio.load(response.data.txt)
    $('li').map(function () {
      const name = $(this).find('img').attr('title').replace(/\s\s+/g, ' ')
      const thumbnail = $(this).find('img').attr('src').replace(/\s\s+/g, ' ')
      const atag = $(this).find('a').attr('href')
      db.get('products')
        .push({
          id: +atag.replace('productDetail.php?productID=', ''),
          name,
          thumbnail: `${baseURL}${thumbnail}`,
        })
        .write()
      db.set('fetchedPage', page)
        .write()
    })
  })
}

run()
