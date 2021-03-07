const express = require('express');
const router = new express.Router();
const path = require('path');
const ejs = require('ejs')
// const mangoos = require('mangoos')
// const bcrypt = require('bcrypt')
const {MongoClient,ObjectId} = require('mongodb')

const client = new MongoClient(`mongodb+srv://manish1993singh:qazxsw@123@node-express-mongo.3ftjm.mongodb.net/people?retryWrites=true&w=majority`,{ useUnifiedTopology: true });
client.connect((e)=>console.log(e))

async  function compareUser(_userId,_password,next){
    console.log('jk',{userId:_userId})
    try{
        const userObject = await client.db('people').collection('user').findOne({userId:_userId})
        console.log('userObject',userObject)
        if(userObject){
            return {user:userObject.userId};
        }else {
            return false;
        }
    }catch (e) {
        next(e)
    }
}



router.get('/signup',function (req,res,next) {
    res.sendFile(path.resolve(__dirname+'/../html/Signup.html'))
})
router.post('/signup',async function (res,req,next) {
    try{
        const user = client.db('people').collection('user').insertOne(req.data)
        if(user){
            res.jsonp({success:true,message:'user created'})
        }
        else {
            res.jsonp({success:false,message:'user not created'})
            ejs.renderFile(__dirname+'/people.ejs',{},{},function (error,template) {
                if(error){
                    throw error
                }else {
                   res.send(template)
                }
            })
        }
    }catch (e) {
        next(e)
    }
})
router.get('/login',function (req,res,next) {
    console.log(req.session)
    if(req.session.user){
        res.redirect("/people")
    }
res.sendFile(path.resolve(__dirname+'/../html/Login.html'))
})
router.post('/login', function (req,res,next) {
    const data = {...req.body};
    console.log('here',data)
    const foundUser = compareUser(data.username,data.password,next)
    if(foundUser){

        req.session['user'] = foundUser;
        // res.jsonp({success:true})
        // res.setHeader("Content-Type", "text/html")
        // res.redirect("/people")
        res.send({success:true,...foundUser})
    }else {
       res.sendFile(__dirname+'/../html/Login.html')
    }
})
router.get('/logout',function (req,res,next) {
    req.session.destroy
    res.redirect('/user/login')
})
module.exports = router;