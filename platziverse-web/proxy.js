'use strict'

const express = require('express');
const request = require('request-promise-native');

const { endpoint, apiToken } = require('./config');

const api = express.Router();

api.get('/agents', async (req, res, next) => {
    const options = {
        method: 'GET',
        url: `${endpoint}/api/agents`,
        headers: {
            'Authorization': `Bearer ${apiToken}`
        },
        json: true
    }

    let result;
    try {
        result = await request(options);
    } catch (err) {
        return next(e);
    }

    res.send(result);
})

api.get('/agent/:uuid', (req, res) => {

})

api.get('/metrics/:uuid', (req, res) => {

})

api.get('/metrics/:uuid/:type', (req, res) => {

})

module.exports = api;