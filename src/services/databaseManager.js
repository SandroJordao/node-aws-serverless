'use strict';

const AWS = require("aws-sdk");
let dynamoDb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

module.exports.initializeDynamoClient = newDynamo => {
    dynamoDb = newDynamo;
};

module.exports.dbListMessages = (tableName, event) => {
    const { type, start, end } = event.queryStringParameters;
    let newStart = new Date(start).setHours(0, 0, 0, 0);
    let newEnd = new Date(end).setHours(23, 59, 59, 999);
    let paramsDynamo = {
        TableName: tableName,
        IndexName: 'delivered-attributes.franchiseGroup-Index',
        KeyConditionExpression: '#delivered = :status AND #franchiseGroup = :fg',
        ExpressionAttributeNames: {
            "#clientkey": 'clientKey',
            "#delivered": 'delivered',
            "#franchiseGroup": 'attributes.franchiseGroup',
            "#type": 'type',
            "#dateTime": 'dateTime',
            "#uuid": 'uuid'
        },
        ExpressionAttributeValues: {
            ':cKey': event.queryStringParameters.client_key,
            ':fg': event.queryStringParameters.franchiseGroup,
            ':status': '0',
            ':t': type,
            ':ds': new Date(newStart).toISOString(),
            ':de': new Date(newEnd).toISOString()
        },
        FilterExpression: '#clientkey = :cKey AND #type = :t AND #dateTime between :ds and :de',
        ProjectionExpression: "#clientkey, #uuid, #dateTime, #type, #franchiseGroup, #delivered"
    };
    console.log('List Messages the DynamoDB!');
    return dynamoDb.query(paramsDynamo).promise().then(result => {
        console.log('Got the list messages of the DynamoDB!');
        return result;
    }).catch(function (error) {
        console.error('Error getting list messages DynamoDB!');
        throw error;
    });
};

module.exports.dbGetMessage = (tableName, data) => {
    let paramsDynamo = {
        TableName: tableName,
        KeyConditionExpression: '#id = :id AND #clientkey = :cKey',
        ExpressionAttributeNames: {
            "#id": 'uuid',
            "#clientkey": 'clientKey',
        },
        ExpressionAttributeValues: {
            ':id': data.pathParameters.id,
            ':cKey': data.queryStringParameters.client_key,
        },
    };
    console.log('Get Message Query the DynamoDB!');
    return dynamoDb.query(paramsDynamo).promise().then(result => {
        console.log('Got the message of the DynamoDB!');
        return result;
    }).catch(function (error) {
        console.error('Error getting message DynamoDB!');
        throw error;
    });
};

module.exports.dbSignUrl = (tableName, data) => {
    let paramsDynamo = {
        TableName: tableName,
        KeyConditionExpression: '#id = :id AND #clientkey = :cKey',
        ExpressionAttributeNames: {
            "#id": 'uuid',
            "#clientkey": 'clientKey',
        },
        ExpressionAttributeValues: {
            ':id': data.uuid,
            ':cKey': data.client_key,
        },
    };
    console.log('Sign URL Query the DynamoDB!');
    return dynamoDb.query(paramsDynamo).promise().then(result => {
        console.log('Got the message of the DynamoDB!');
        return result;
    }).catch(function (error) {
        console.error('Error getting message DynamoDB!');
        throw error;
    });
};