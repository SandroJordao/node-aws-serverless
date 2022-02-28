const AWS = require('aws-sdk');
let s3 = new AWS.S3();

initializeS3 = newS3 => {
    s3 = newS3;
};

getSignedUrl = (bucket, key, Expires) => {
    const paramsBucket = {
        Bucket: bucket,
        Key: key,
        Expires: Expires
    };
    console.log('Signing Url!');
    return s3.getSignedUrl('getObject', paramsBucket);
};

module.exports = {
	initializeS3,
	getSignedUrl
}