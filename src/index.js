const logger = require("./services/logger");
const { validate } = require("./services/validation");
const { getSignedUrl } = require("./services/bucketManager");
const { dbListMessages, dbGetMessage, dbSignUrl } = require("./services/databaseManager");
const AWS = require("aws-sdk");

listMessages = async (event) => {
	let statusCode = 200;
	let body = {};
	let limit = parseInt(event.queryStringParameters.limit) || 100;
	let skip = parseInt(event.queryStringParameters.skip) || 0;
	try {
		const valid = await validate(event.queryStringParameters, 'list');
		if (valid.error) {
			statusCode = valid.error.statusCode;
			throw valid.error.message;
		}
		let tableName = process.env.AWS_DYNAMO_TABLE_LOGS;
		let result = await dbListMessages(tableName, event);
		statusCode = (result.Count > 0) ? 200 : 404;
		let total = skip + limit;
		body.Items = result.Items.slice(skip, total);
		body.Count = body.Items.length;
		body.Limit = limit;
	} catch (err) {
		logger.error(err.message);
		statusCode = 500;
		body = { error: err.message };
	} finally {
		body = JSON.stringify(body);
	}
	return {
		statusCode,
		body
	}
}

getMessage = async (event) => {
	let statusCode = 200;
	let body;
	try {
		const valid = await validate(event.queryStringParameters, 'get');
		if (valid.error) {
			statusCode = valid.error.statusCode;
			throw valid.error.message;
		}
		let tableName = process.env.AWS_DYNAMO_TABLE_LOGS;
		let result = await dbGetMessage(tableName, event);
		statusCode = (result.Count > 0) ? 200 : 404;
		body = result.Items
	} catch (err) {
		logger.error(err.message);
		statusCode = 500;
		body = { error: err.message };
	} finally {
		body = JSON.stringify(body);
	}
	return {
		statusCode,
		body
	}
}

signUrl = async (event) => {
	let statusCode = 200;
	let body;
	try {
		const data = JSON.parse(event.body);
		const valid = await validate(data, 'signUrl');
		if (valid.error) {
			statusCode = valid.error.statusCode;
			throw valid.error.message;
		}
		let tableName = process.env.AWS_DYNAMO_TABLE_LOGS;
		let result = await dbSignUrl(tableName, data);
		statusCode = (result.Count > 0) ? 200 : 404;
		if (result.Count > 0) {
			let signedUrl = await getSignedUrl(data.bucketName, data.objectKey, Number(process.env.AWS_S3_EXPIRES_URL));
			body = { url: signedUrl }
		}
	} catch (err) {
		logger.error(err.message);
		statusCode = 500;
		body = { error: err.message };
	} finally {
		body = JSON.stringify(body);
	}
	return {
		statusCode,
		body
	}
}

module.exports = {
	listMessages,
	getMessage,
	signUrl
}
