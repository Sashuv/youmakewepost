var express =   require("express");
var router = express.Router();
const multer  = require('multer');
const sharp = require('sharp');
const aws = require('aws-sdk');
aws.config.region = 'us-west-1';

const S3_BUCKET = process.env.S3_BUCKET;

const upload = multer({ 
  limits: { fileSize:4000000 }}).single('userImage');

router.get('/sign-s3', (req, res) => {
  const s3 = new aws.S3();
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  console.log(S3_BUCKET);
  
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
});

router.post('/image/', (req, res) => {
    upload(req, res, async function(err){
     // check for error thrown by multer- file size etc
     if( err|| req.file === undefined){
         res.send("error occured");
     }else{
        // everything worked fine // req.body has text fields, req.file has the file 
        let ext = req.file.originalname.split('.').pop();
        let fileName = "upload" + '-' + Date.now() + "." + ext;
        var image = await sharp(req.file.buffer) //.resize({ width: 400, height:400 }) Resize if you want
        .toFile('./uploads/' + fileName)
        .catch( err => { console.log('error: ', err) });
        res.send(fileName);
     }});
});

router.get('/', function(req, res, next){
  return res.json({"success": true});
});

module.exports = router;