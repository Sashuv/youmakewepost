var express =   require("express");
var router = express.Router();
const multer  = require('multer');
const sharp = require('sharp');

const upload = multer({ 
  limits: { fileSize:4000000 }}).single('userImage');

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