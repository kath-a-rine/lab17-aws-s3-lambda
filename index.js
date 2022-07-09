// Updated resubmit for lab 17 - completed after code review
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event) => {

    let bucketName = event.Records[0].s3.bucket.name;
    let fileName = event.Records[0].s3.object.key;
    let fileSize = event.Records[0].s3.object.size;
        
   console.log('event: ', bucketName, fileName, fileSize);
   
   const params = {
       Bucket: bucketName,
       Key: 'images.json',
   }
   
   try {
       const imageManifest = await s3.getObject(params).promise();
       
       let manifestData = JSON.parse(imageManifest.Body.toString());
       console.log('Did this work? Did we get manigestData?', manifestData);
       
       manifestData.push({
            name: fileName,
            size: fileSize,
            type: 'image'
       });
       
       let manifestBody = JSON.stringify(manifestData);
          
       const newManifest = await  s3.putObject({...params, Body: manifestBody,
       ContentType: 'application/json'}).promise();
       
       console.log('we got here');
       
   } catch(e) {
      console.log(e)
      
      if(e.message === 'The specified key does not exist.'){
          const newManifest = {
              Bucket: bucketName,
              Key: 'images.json',
              Body: JSON.stringify([{name: fileName, size: fileSize, type: 'image/jpg'}]),
              ContentType: 'application/json',
          };
          const manifest = await s3.putObject(newManifest).promise();
          console.log('JSON file created for bucket', manifest);
      }
      console.log('need to create images.json'); 
   }
   
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    console.log(event);
    return response;
};
