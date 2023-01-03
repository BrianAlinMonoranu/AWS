const im = require("imagemagick");
const fs = require("fs");
const os = require("os");
const uuidv4 = require("uuid/v4");
const {promisfy} = require("util")
const AWS = require("aws-sdk")

const resizeAsync = promisfy(im.resize);
const readFileAsync = promisify(fs.readFile);
const unlinkAsync = promisify(fs.unlink);

AWS.config.update({ region: 'eu-west-1' });
const s3 = new AWS.S3();

exports.handler = async (event) => {
    let fileProcessed = event.Records.map(async (record) => {
        let bucket = record.s3.bucket.name;
        let filename = record.s3.object.key

        //Get file from S3
        var params = {
            Bucket: bucket,
            Key: filename  
        };

        let inputData = await s3.getObject(params).promise()
        //promise gives us back if it fails or passes
        //await basically means that anything in front of it must get input first then we can go to other functions


        //Resize the file 
        let tempFile = os.tmpdir() + '/' + uuidv4() + '.jpg';
        let resizeArgs = {
            srcData: inputData.Body,
            dstPath: tempFile,
            width: 150
        };
        await resizeAsync(resizeArgs);

        
        //Read the resize file
        let resizedData = await readFileAsync(tempFile);
        
        //Upload the resize file to S3
        let targetFilename = filename.substring(0, filename.lastIndexOf('.')) + '-small.jpg';
        var params = {
            Bucket: bucket + '-dest',
            Key: targetFilename,
            Body: new Buffer(resizedData),
            ContentType: 'image/jpeg'
        };

        await s3.putObject(params).promise();
        return await unlinkAsync(tempFile);

    });
    
    await Promise.all(fileProcessed)
    console.log("Done")
    return "done"
}

