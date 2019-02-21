import fetch, {Headers} from 'node-fetch'
import 'babel-polyfill'
import Web3Data from  '../index'
import test from 'ava'
import dotenv from 'dotenv'
dotenv.load()

/* Setup the global window object to simulate running ky in a browser*/
global.window = {};
global.window.fetch = fetch;
global.window.Headers = Headers;

let API_KEY
if(process.env.API_KEY) {
  API_KEY = process.env.API_KEY
} else {
  console.warn("Must set API_KEY value in .env file, \n\
  Create an account on amberdata.io to obtain one")

  // Dumby key; won't work on live net
  API_KEY = 'lbK5e0cae7xf494P3c8Q1od19h41b3fa973'
}

/**********************************
 * -------- Tests Setup ---------- *
 **********************************/
const ADDRESS = '0x873029fead9cc9c05860557576ca1577f420a801'
const ADDRESS_XS = '0x595596f4fbb9fff1b610e5d67c41e8928244a622'
const TX_HASH = '0x7a3dbdc6f5b8b748d972ee9e35ecea6ff62a624816c944bf2419c430156c54ba'
const TOKEN_HASH = '0x744d70fdbe2ba4cf95131626614a1763df805b9e' /* Status Network Token */
const SLUG = ''
const BLOCKCHAIN_ID = '1c9c969065fcd1cf'/* Ethereum-mainnet */

const CONFIG = {
  'apiKey': API_KEY,
  'blockchainId':  BLOCKCHAIN_ID
}

test.beforeEach(t => {
  t.context.web3data = new Web3Data(CONFIG)
})

/**********************************
 * ----------- Tests  ----------- *
 **********************************/

/*********** Test web3data() ***********/
test('web3data should have object \'config\'', t => {
  t.truthy(t.context.web3data.config)
})

test('web3data should have the apikey set', t => {
  t.is(t.context.web3data.config['apiKey'], API_KEY)
})

test('web3data should have the correct blockchain id', t => {
  t.is(t.context.web3data.config['blockchainId'], BLOCKCHAIN_ID)
})

test('throws exception when no config object is supplied', t => {
  const error = t.throws(() => { new Web3Data() }, Error);
  t.is(error.message, "No configuration object supplied");
})

test('throws exception when no api key is supplied', t => {
  const error = t.throws(() => { new Web3Data({}) }, Error);
  t.is(error.message, "No api key supplied");
})

test('throws exception when no blockchainid is supplied', t => {
  const error = t.throws(() => { new Web3Data({'apiKey':'apikey'}) }, Error);
  t.is(error.message, "No Blockchain specified");
})

/**********************************
 * ------ Test addresses() ------ *
 **********************************/
test.skip('throws exception when calling \'addresses\' without hash', t => {
  const error = t.throws(() => { t.context.web3data.addresses() }, Error);
  t.is(error.message, 'No address hash provided');
})

/*********** Test info() ***********/
test.skip('Successfully gets address information', async t => {
  let addressInfo = await t.context.web3data.addresses(ADDRESS).info().retrieve()
  t.is(addressInfo.status, 200)
})

/*********** Test stats() ***********/
test.skip('gets address stats', async t => {
  let addressStats= await t.context.web3data.addresses(ADDRESS).stats().retrieve()
  t.is(addressStats.status, 200)
})

/*********** Test logs() ***********/
test.skip('gets address logs', async t => {
  let addressLogs = await t.context.web3data.addresses(ADDRESS).logs().retrieve()
  t.is(addressLogs.status, 200)
})

/*********** Test transactions() ***********/
test.skip('gets all transactions of the address', async t => {
  let addressTransactions = await t.context.web3data.addresses(ADDRESS_XS).transactions().retrieve()
  t.is(addressTransactions.status, 200)
})
test.skip('<---PENDING IMPLEMENTION --->gets single transaction of the address', async t => {
  let addressTransaction = await t.context.web3data.addresses(ADDRESS_XS).transactions(TX_HASH).retrieve()
  t.is(addressTransaction.status, 200)
})


/*********** Test functions() ***********/
test.skip('gets all functions of the address', async t => {
  let addressFunctions = await t.context.web3data.addresses(ADDRESS_XS).functions().retrieve()
  t.is(addressFunctions.status, 200)
})
test.skip('<---PENDING IMPLEMENTION --->gets single functions of the address', async t => {
  let addressFunction = await t.context.web3data.addresses(ADDRESS_XS).functions(TX_HASH).retrieve()
  t.is(addressFunction.status, 200)
})

/*********** Test tokens() ***********/
test.skip('gets all tokens of the address', async t => {
  let addressTokens = await t.context.web3data.addresses(ADDRESS).tokens().retrieve()
  t.is(addressTokens.status, 200)
})
test.skip('<---PENDING IMPLEMENTION --->gets single token of the address', async t => {
  let addressToken = await t.context.web3data.addresses(ADDRESS).tokens(TOKEN_HASH).retrieve()
  t.is(addressToken.status, 200)
})

/**********************************
 * ------- Test Modifiers ------- *
 **********************************/

/*********** Test filters() ***********/

/* -== Test blockNumber ==- */
test.skip('<---PENDING IMPLEMENTION --->Filters properly -- blocknumber', async t => {
  const filterOpts = {'blockNumber':6237323}
  let addressLogs = await t.context.web3data.addresses(ADDRESS).logs().filter(filterOpts).retrieve()
  t.is(addressLogs.status, 200)
})

/* -== Test to address ==- */
test.skip('<---PENDING IMPLEMENTION --->Filters properly -- to address', async t => {
  const filterOpts = {'to': ADDRESS}
  let addressLogs = await t.context.web3data.addresses(ADDRESS).logs().filter(filterOpts).retrieve()
  t.is(addressLogs.status, 200)
})

/* -== Test from address ==- */
test.skip('<---PENDING IMPLEMENTION --->Filters properly -- from address', async t => {
  const filterOpts = {'from': ADDRESS}
  let addressLogs = await t.context.web3data.addresses(ADDRESS).logs().filter(filterOpts).retrieve()
  t.is(addressLogs.status, 200)
})

/*********** Test pagination ***********/

/* -== Test limit() offset() ==- */
test.skip('Test pagination: limit & offset', async t => {
  const PAGE_SIZE = 3
  const filterOpts = {
    'page': 0,
    'size': PAGE_SIZE
  }
  let addressTransactions = await t.context.web3data.addresses(ADDRESS).transactions().limit(PAGE_SIZE).offset(0).retrieve()
  t.is(addressTransactions.status, 200)
  t.is(addressTransactions.payload.records.length, PAGE_SIZE)
})

/* -== Test size() page() ==- */
test.skip('Test pagination: size & page', async t => {
  const PAGE_SIZE = 3
  const filterOpts = {
    'page': 0,
    'size': PAGE_SIZE
  }
  let addressTransactions = await t.context.web3data.addresses(ADDRESS).transactions().size(PAGE_SIZE).page(0).retrieve()
  t.is(addressTransactions.status, 200)
  t.is(addressTransactions.payload.records.length, PAGE_SIZE)
})

/* -== Test orderBy() ==- */
test.skip('<---PENDING IMPLEMENTION --->Orderby: timestamp', async t => {
  let addressLogs = await t.context.web3data.addresses(ADDRESS).logs().orderBy('timestamp').retrieve()
  t.is(addressLogs.status, 200)
})

/* -== Test dirction() ==- */
test.skip('<---PENDING IMPLEMENTION --->Dirction: asc|desc', async t => {
  let addressLogs = await t.context.web3data.addresses(ADDRESS).logs().direction('asc').retrieve()
  t.is(addressLogs.status, 200)
})
