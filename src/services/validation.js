const logger = require("./logger");

exports.validate = async (data, type) => {
	const error = []
	let structure = [];

	switch (type) {
		case 'list':
			structure.push("client_key", "franchiseGroup", "type", "start", "end")
			break;
		case 'get':
			structure.push("client_key")
			break;
		case 'signUrl':
			structure.push("client_key", "uuid", "bucketName", "objectKey")
			break;
	}

	for (const att of structure) {
		if (!data[att])
			error.push(att)
	}

	if (error.length > 0)
		return { error: { message: `attributes not found: ${error}`, statusCode: 400 } }

	logger.info(`Validated attributes!`);

	return true;
}