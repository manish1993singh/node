const express  = require('express')
const router = new express.Router();
const path = require('path')

router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname,'../html/TakeCode.html'))
})
module.exports = router