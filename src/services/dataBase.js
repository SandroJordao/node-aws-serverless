const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});
var allData = [];

exports.getAllData = async (params, limit) => {
	return processAllData(params, limit);
}

async function processAllData(params, limit){
    console.log("Querying Table");
    let data = await dynamoDb.query(params).promise();

    if(data['Items'].length > 0) {
        console.log(`Total: ${data['Items'].length}`);
        allData = [...allData, ...data['Items']];
    }

    if (data.LastEvaluatedKey && allData.length < limit) {
        params.ExclusiveStartKey = data.LastEvaluatedKey;
        return await processAllData(params, limit);

    } else {
        return allData;
    }
}