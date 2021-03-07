const express = require('express');
const router = new express.Router();
const path = require('path')


router.get('/icon/:name',function (req,res) {
    res.jsonp({message:'icon'})
    res.sendFile(path.join(__dirname, '/image/'+req.param.name))
})

module.exports = router;