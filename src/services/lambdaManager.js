'use strict';

const { Lambda } = require('aws-sdk');
let lambda = new Lambda({ apiVersion: '2015-03-31' })

module.exports.initializeLambdaClient = newLambda => {
    lambda = newLambda;
};

module.exports.invokeFunction = async (functionName, paramsRequest) => {
    let req = {
        FunctionName: functionName,
        Payload: Buffer.from(JSON.stringify(paramsRequest, null, 2))
    }
    console.log('Invoke the function Lambda!');
    return await lambda.invoke(req).promise().then((data) => {
        console.log('Got a return of the function Lambda!');
        if (typeof data.Payload === 'string')
            data.Payload = JSON.parse(data.Payload);
        return data
    }).catch(err => {
        console.error('Error in invoke Function!');
        throw new Error(err.message);
    });
};