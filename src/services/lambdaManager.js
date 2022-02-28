'use strict';

const { Lambda } = require('aws-sdk');
let lambda = new Lambda({ apiVersion: '2015-03-31' })

module.exports.initializeLambdaClient = newLambda => {
    lambda = newLambda;
};
