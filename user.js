const express = require('express');
const router = new express.Router();
const path = require('path');
const ejs = require('ejs')

router.get('/login',function (req,res,next) {
res.sendFile(__dirname+'/Login.html')
})
module.exports = router;