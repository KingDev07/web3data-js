import test from "ava"
import { TOKEN_ADDRESS, ADDRESS } from './constants'
import { ERROR_MESSAGE_TOKEN_NO_ADDRESS as NO_ADDRESS } from '../src/constants'
import { ERROR_MESSAGE_TOKEN_NO_HOLDER_ADDRESS as NO_HOLDER_ADDRESS } from '../src/constants'
import {setUpPolly, getNewWeb3DataInstance} from "./utils";

/**********************************
 * -------- Tests Setup ---------- *
 **********************************/
test.before(t => {
    t.context.polly = setUpPolly('token')
})

test.after(async t => {
    await t.context.polly.stop()
})

test.beforeEach(t => {
    t.context.web3data = getNewWeb3DataInstance()
})

/**
 * Test that method is called and returns successfully, i.e. a status of 200
 * @param t the test object
 * @param input the test input in the case the name of the method
 */
let  statusSuccess = async (t, { method, params = {} }) => {
    let response = await t.context.web3data.token[method](TOKEN_ADDRESS)
    t.is(response.status, 200)
}
/* Dynamically creates title based on input */
statusSuccess.title = (providedTitle = '', input) =>  `Successfully calls ${input.method} and returns status of 200`

/**
 * Test that method rejects the promise the proper params are not provided
 * @param t the test object
 * @param input the test input in the case the name of the method
 * @param errorMessage
 */
const rejectsPromise = async (t, { method, params = {} }, errorMessage) => {
        await t.throwsAsync(async () => {
        await t.context.web3data.token[method]()
    }, { instanceOf: Error, message: errorMessage })
}

/* Dynamically creates title based on input */
rejectsPromise.title = (providedTitle = '', input) => `throws exception when calling ${input.method} without hash`

/**
 * Checks that the response contains the specified field
 * @param t - the test context
 * @param blockchain - the blockchain namespace e.g. 'eth'
 * @param method - the RPC method
 * @param field - the field for which to check it's existence in the response
 * @param params - the RPC method parameters
 */
const returnsObjectWithField = async (t, {method, field, params = [] }) => {
    const resp = await t.context.web3data.token[method](params)

    t.true({}.hasOwnProperty.call(resp, 'payload'))

    /* If response is an array of objects, then we want to check for the field on one of the objects*/
    resp.result = Array.isArray(resp.payload) ? resp.payload[0] : resp.payload
    resp.result = resp.payload.data &&  Array.isArray(resp.payload.data) ? resp.payload.data[0] : resp.payload
    t.true({}.hasOwnProperty.call(resp.result, field))
}
returnsObjectWithField.title = (providedTitle = '', input) => `Successfully calls ${input.method} and returns valid object containing expected field`


/**********************************
 * -------- Test Tokens -------- *
 **********************************/

test([rejectsPromise], {method: 'getHolders' }, NO_ADDRESS)

test('Successfully gets address Token Holders Historical', async t => {
    const filters = {holderAddresses: '0xbbf0cc1c63f509d48a4674e270d26d80ccaf6022'}
    const holdersHistorical = await t.context.web3data.token.getHoldersHistorical(TOKEN_ADDRESS, filters);
    t.true({}.hasOwnProperty.call(holdersHistorical.data[0], 'timestamp'))
});

test('Rejects promise if no token address supplied', async t => {
    let filters = {holderAddresses: ADDRESS}
    await t.throwsAsync(async () => {
        await t.context.web3data.token.getHoldersHistorical('',filters);
    }, { instanceOf: Error, message: NO_ADDRESS })
});

test('Rejects promise if no holder address supplied', async t => {
    await t.throwsAsync(async () => {
        await t.context.web3data.token.getHoldersHistorical(TOKEN_ADDRESS);
    }, { instanceOf: Error, message: NO_HOLDER_ADDRESS })
});

test([rejectsPromise], {method: 'getVolume'}, NO_ADDRESS)
test([rejectsPromise], {method: 'getVelocity'}, NO_ADDRESS)
test([rejectsPromise], {method: 'getSupplies'}, NO_ADDRESS)
test([rejectsPromise], {method: 'getTransfers'}, NO_ADDRESS)

/*********** Test getRankings() ***********/
test('Successfully calls getRankings()', async t => {
    const {data: [rank1]} = await t.context.web3data.token.getRankings();
    t.true(rank1.hasProp('rank'))
    t.is(rank1.rank, '1')
});
test('Successfully calls getRankings() - with filters', async t => {
    const rankings = await t.context.web3data.token.getRankings({type: 'erc777'});
    t.true(rankings.hasProp('data'))
    t.is(rankings.metadata.totalRecords, 0)
});
