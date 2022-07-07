// Initial commit for lab 17

const AWS = require('aws-sdk');

const s3 = new AWS.S3();

exports.handler = async (event) => {
    // TODO implement
   
//   let bucketName = 'lab17-image-bucket';
    if(!'image.json') {
        
        let bucketName = event.Records[0].s3.bucket.name;
        let key = event.Records[0].s3.object.key;
        
        let imageObj = await s3.getObject({Bucket: bucketName, Key: key}).promise();
        let imageData = JSON.parse(imageObj.Body.toString());
   
        let metaData = {
          name: fileName,
          size: fileSize,
          type: 'image'
        }
        imageData.push(metaData);
        
    }
   
   
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    console.log(event);
    return response;
};
