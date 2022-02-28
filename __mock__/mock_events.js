module.exports = {
	mockEventListMessage: {
		"body": null,
		"queryStringParameters": {
			"client_key": "69zhxxOhPYSryL7eUKX6oPEMe4Gpw7JZ",
			"franchiseGroup": "10504",
			"type": "gera-nf",
			"start": "2021-11-05",
			"end": "2021-11-05",
			"limit": 100,
			"skip": 0
		}
	},
	mockEventGetMessage: {
		"body": null,
		"queryStringParameters": {
			"client_key": "69zhxxOhPYSryL7eUKX6oPEMe4Gpw7JZ"
		},
		"pathParameters": {
			"id": "0770ceac-e8e9-4026-84d1-e3ca6529f247-55877"
		}
	},
	mockEventSignUrlPost: {
		"body": '{' +
			'"client_key": "69zhxxOhPYSryL7eUKX6oPEMe4Gpw7JZ",' +
			'"uuid": "28b11ae9-aa6c-4be3-966b-a1ca35893060-1",' +
			'"bucketName": "api-node-file-tag-homologation",' + 
			'"objectKey": "gera-nf/v1/2021-08-31T17:17:02.194Z_28b11ae9-aa6c-4be3-966b-a1ca35893060-1.json"' +
		'}'
	},
}