var express = require("express");
var router = express.Router();
const passport = require('passport');

/* GET home page. */
router.get('/', (req,res) => 
{
    res.json({
        status: 'success',
        payload: 'You can only see this if you are authenticated.',
        token: req.body.token  
    })
});

module.exports = router;
