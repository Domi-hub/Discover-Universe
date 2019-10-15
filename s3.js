const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET
});

exports.upload = function(req, res, next) {
    if (!req.file) {
        res.sendStatus(500);
        return;
    }
    const { filename, mimetype, size, path } = req.file; //mimetype =content type,
    s3.putObject({
        Bucket: myBucketName, //bucket name from Amazon
        ACL: "public-read", // everybody who has url can see pictures
        Key: filename, // file/object name
        Body: fs.createReadStream(path),
        ContentType: mimetype,
        ContentLength: size
    })
        .promise()
        .then(() => {
            //it worked!!
            next();
        })
        .catch(err => {
            //uh oh
            console.log(err);
            res.sendStatus(500);
        });
};
