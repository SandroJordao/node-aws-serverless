const AWS = require('aws-sdk');
const AWSMock = require('aws-sdk-mock');
const { validate } = require('../src/services/validation');
const { initializeS3 } = require('../src/services/bucketManager');
const { initializeLambdaClient } = require('../src/services/lambdaManager');
const { dbListMessages, dbGetMessage, dbSignUrl, initializeDynamoClient } = require("../src/services/databaseManager");
const { mockDataBodyListMessage, mockDataBodyGetMessage, mockDataBodySignUrl, mockDataListMessages, mockDataGetMessage, mockDataSignUrl, mockDataGetUrl } = require('../__mock__/mock_data');
const { mockEventListMessage, mockEventGetMessage, mockEventSignUrlPost } = require('../__mock__/mock_events');
const { listMessages, getMessage, signUrl } = require('../src');

// jest.mock('../src/services/validation');

beforeAll(() => {
    AWSMock.setSDKInstance(AWS);
});

afterAll(() => {
    const dynamo = new AWS.DynamoDB.DocumentClient();
    initializeDynamoClient(dynamo);
    const lambda = new AWS.Lambda();
    initializeLambdaClient(lambda);
    const s3 = new AWS.S3();
    initializeS3(s3);
});

describe("Unit testing validation", () => {
    describe('Should success in validate', () => {
        it("List message", async () => {
            let result = await validate(mockDataBodyListMessage, 'list');
            expect(result).toEqual(true);
        });

        it("Get message", async () => {
            let result = await validate(mockDataBodyGetMessage, 'get');
            expect(result).toEqual(true);
        });

        it("Signed url", async () => {
            let result = await validate(mockDataBodySignUrl, 'signUrl');
            expect(result).toEqual(true);
        });
    });

    describe('When get Error', () => {
        it('Should return error in fields not found', async () => {
            mockDataBodyListMessage.client_key = null;
            let result = await validate(mockDataBodyListMessage, 'list');
            expect(result.error).toEqual(
                expect.objectContaining({
                    message: "attributes not found: client_key",
                    statusCode: 400
                })
            );
        });
    });
});

describe('Unit testing database', () => {
    describe('Method list messages', () => {
        describe('Request response', () => {
            let mockReturn;
            let dynamo;
            beforeEach(() => {
                mockReturn = jest.fn();
                AWSMock.mock('DynamoDB.DocumentClient', 'query', function (_, callback) {
                    callback(null, mockReturn());
                });
                dynamo = new AWS.DynamoDB.DocumentClient();
                initializeDynamoClient(dynamo);
            });
            afterEach(() => {
                AWSMock.restore();
            });
            it('Should success in list messages', async () => {
                mockReturn.mockReturnValue(mockDataListMessages);
                let result = await dbListMessages('table_unit_test', mockEventListMessage);
                expect(result).toEqual(mockDataListMessages);
            });
        });
        describe('When get Error', () => {
            let mockReturn;
            let dynamo;
            beforeEach(() => {
                mockReturn = jest.fn();
                AWSMock.mock('DynamoDB.DocumentClient', 'query', function (_, callback) {
                    callback(null, mockReturn());
                });
                dynamo = new AWS.DynamoDB.DocumentClient()
                initializeDynamoClient(dynamo);
            });
            afterEach(() => {
                AWSMock.restore();
            });
            it('Should throw an error and handle in catch', async () => {
                mockReturn.mockReturnValue(new Error('Missing required key \'TableName\' in params'));
                await dbListMessages(null, mockEventListMessage).catch(result => {
                    expect(result.message).toEqual('Missing required key \'TableName\' in params');
                });
            });
            it('Should not list if the table name a non-existent table', async () => {
                await dbListMessages('invalid_table_name', mockEventListMessage).catch(result => {
                    expect(result.message).toEqual('Cannot do operations on a non-existent table');
                });
            });
        });
    });

    describe('Method get message', () => {
        describe('Request response', () => {
            let mockReturn;
            let dynamo;
            beforeEach(() => {
                mockReturn = jest.fn();
                AWSMock.mock('DynamoDB.DocumentClient', 'query', function (_, callback) {
                    callback(null, mockReturn());
                });
                dynamo = new AWS.DynamoDB.DocumentClient();
                initializeDynamoClient(dynamo);
            });
            afterEach(() => {
                AWSMock.restore();
            });
            it('Should success in get message', async () => {
                mockReturn.mockReturnValue(mockDataGetMessage);
                let result = await dbGetMessage('table_unit_test', mockEventGetMessage);
                expect(result).toEqual(mockDataGetMessage);
            });
        });
        describe('When get Error', () => {
            let mockReturn;
            let dynamo;
            beforeEach(() => {
                mockReturn = jest.fn();
                AWSMock.mock('DynamoDB.DocumentClient', 'query', function (_, callback) {
                    callback(null, mockReturn());
                });
                dynamo = new AWS.DynamoDB.DocumentClient()
                initializeDynamoClient(dynamo);
            });
            afterEach(() => {
                AWSMock.restore();
            });
            it('Should throw an error and handle in catch', async () => {
                mockReturn.mockReturnValue(new Error('Missing required key \'TableName\' in params'));
                await dbGetMessage(null, mockEventGetMessage).catch(result => {
                    expect(result.message).toEqual('Missing required key \'TableName\' in params');
                });
            });
            it('Should not get if the table name a non-existent table', async () => {
                await dbGetMessage('invalid_table_name', mockEventGetMessage).catch(result => {
                    expect(result.message).toEqual('Cannot do operations on a non-existent table');
                });
            });
        });
    });

    describe('Method signed url', () => {
        describe('Request response', () => {
            let mockReturn;
            let dynamo;
            beforeEach(() => {
                mockReturn = jest.fn();
                AWSMock.mock('DynamoDB.DocumentClient', 'query', function (_, callback) {
                    callback(null, mockReturn());
                });
                dynamo = new AWS.DynamoDB.DocumentClient();
                initializeDynamoClient(dynamo);
            });
            afterEach(() => {
                AWSMock.restore();
            });
            it('Should success in signed url', async () => {
                mockReturn.mockReturnValue(mockDataSignUrl);
                let result = await dbSignUrl('table_unit_test', mockEventSignUrlPost.body);
                expect(result).toEqual(mockDataSignUrl);
            });
        });
        describe('When get Error', () => {
            let mockReturn;
            let dynamo;
            beforeEach(() => {
                mockReturn = jest.fn();
                AWSMock.mock('DynamoDB.DocumentClient', 'query', function (_, callback) {
                    callback(null, mockReturn());
                });
                dynamo = new AWS.DynamoDB.DocumentClient()
                initializeDynamoClient(dynamo);
            });
            afterEach(() => {
                AWSMock.restore();
            });
            it('Should throw an error and handle in catch', async () => {
                mockReturn.mockReturnValue(new Error('Missing required key \'TableName\' in params'));
                await dbSignUrl(null, mockEventSignUrlPost.body).catch(result => {
                    expect(result.message).toEqual('Missing required key \'TableName\' in params');
                });
            });
            it('Should not get if the table name a non-existent table', async () => {
                await dbSignUrl('invalid_table_name', mockEventSignUrlPost.body).catch(result => {
                    expect(result.message).toEqual('Cannot do operations on a non-existent table');
                });
            });
        });
    });
});

describe('Unit testing index', () => {
    describe('Method list messages', () => {
        describe('Request response', () => {
            let mockDynamo;
            let mockLambda;
            let dynamo;
            let lambda;
            beforeEach(() => {
                mockDynamo = jest.fn();
                mockLambda = jest.fn();
                AWSMock.mock('DynamoDB.DocumentClient', 'query', function (_, callback) {
                    callback(null, mockDynamo());
                });
                AWSMock.mock('Lambda', 'invoke', function (_, callback) {
                    callback(null, mockLambda());
                });
                dynamo = new AWS.DynamoDB.DocumentClient();
                lambda = new AWS.Lambda();
                initializeDynamoClient(dynamo);
                initializeLambdaClient(lambda);
                jest.restoreAllMocks();
            });
            afterEach(() => {
                AWSMock.restore();
            });
            it('Should success in list messages', async () => {
                mockDynamo.mockReturnValue(mockDataListMessages);
                mockLambda.mockReturnValue({ 
                    StatusCode: 200, 
                    Payload: { body: JSON.stringify(mockDataListMessages) } 
                });
                let result = await listMessages(mockEventListMessage);
                expect(result.statusCode).toEqual(200);
                expect(result.body).toEqual(JSON.stringify({ 
                    "Items": mockDataListMessages.Items, 
                    "Count": mockDataListMessages.Count, 
                    "Limit": mockEventListMessage.queryStringParameters.limit 
                }));
            });
        });
    });

    describe('Method get message', () => {
        describe('Request response', () => {
            let mockReturn;
            let dynamo;
            beforeEach(() => {
                mockReturn = jest.fn();
                AWSMock.mock('DynamoDB.DocumentClient', 'query', function (_, callback) {
                    callback(null, mockReturn());
                });
                dynamo = new AWS.DynamoDB.DocumentClient();
                initializeDynamoClient(dynamo);
            });
            afterEach(() => {
                AWSMock.restore();
            });
            it('Should success in get message', async () => {
                mockReturn.mockReturnValue(mockDataGetMessage);
                let result = await getMessage(mockEventGetMessage);
                expect(result.statusCode).toEqual(200);
            });
        });
    });

    describe('Method signed url', () => {
        describe('Request response', () => {
            let mockDynamo;
            let dynamo;
            let mockS3;
            let s3;
            beforeEach(() => {
                mockDynamo = jest.fn();
                AWSMock.mock('DynamoDB.DocumentClient', 'query', function (_, callback) {
                    callback(null, mockDynamo());
                });
                dynamo = new AWS.DynamoDB.DocumentClient();
                initializeDynamoClient(dynamo);

                mockS3 = jest.fn();
                AWSMock.mock('S3', 'getObject', function (operation, params, callback) {
                    callback(null, mockS3());
                });
                s3 = new AWS.S3();
                initializeS3(s3);

                jest.restoreAllMocks();
            });
            afterEach(() => {
                AWSMock.restore();
            });
            it('Should success in signUrl', async () => {
                mockDynamo.mockReturnValue(mockDataSignUrl);
                mockS3.mockReturnValue(mockDataGetUrl.url);
                let result = await signUrl(mockEventSignUrlPost);
                expect(result.statusCode).toEqual(200);
                expect(result.body).toEqual(JSON.stringify({ 
                    "url": 'https://s3.amazonaws.com/'
                }));
            });
        });
    });
});