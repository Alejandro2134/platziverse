'use strict'

const test = require('ava');
const request = require('supertest');
const util = require('util');
const sinon = require('sinon');
const proxiquire = require('proxyquire');

const agentFixtures = require('./fixtures/agent');
const auth = require('../auth');
const config = require('../config');
const sign = util.promisify(auth.sign);

let sandbox = null;
let server = null;
let token = null;
let dbStub = {};
let AgentStub = {};
let MetricStub = {};

test.beforeEach(async () => {
    sandbox = sinon.createSandbox();

    dbStub = sandbox.stub();
    dbStub.returns(Promise.resolve({
        Agent: AgentStub,
        Metric: MetricStub
    }))

    AgentStub.findConnected = sandbox.stub();
    AgentStub.findConnected.returns(Promise.resolve(agentFixtures.connected));
    
    token = await sign({ admin: true, username: 'platzi' }, config.auth.secret);

    const api = proxiquire('../api', {
        'platziverse-db': dbStub
    })

    server = proxiquire('../server', {
        './api': api
    })
})

test.afterEach(() => {
    sandbox && sinon.restore();
})

test.serial.cb('/api/agents', t => {
    request(server)
        .get('/api/agents')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
            t.falsy(err, 'should not return an error');
            let body = JSON.stringify(res.body);
            let expected = JSON.stringify(agentFixtures.connected);
            t.deepEqual(body, expected, 'response body should be the expected');
            t.end();
        })
})