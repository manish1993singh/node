const express = require('express');
const router = new express.Router();
const ejs = require('ejs');
const {MongoClient} = require('mongodb')
const path = require('path')

const client = new MongoClient("mongodb://127.0.0.1:27017/",{ useUnifiedTopology: true });
let collection;
async function db(){
    console.log('here');

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Make the appropriate DB calls
        await  listDatabases(client);

    } catch (e) {
        console.error(e);
    } finally {
        // await client.close();
    }

}
async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
    // console.log("Databases:");
    // databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};
router.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, 'index.html'));
})
router.get('/db',async  function (req,res) {
    res.send(await  client.db('people').collection('people').find({}))

})
router.get('/req',(req,res)=>{
    res.send(req.url)
})
router.get('/name/:name',(req,res)=>{
    res.send(req.params.name+req.query.age)
})

router.get('/ayush',(re,res)=>{
    res.sendFile(path.join(__dirname, 'ayush.html'));
    ejs.renderFile(path.join(__dirname, 'ayush.ejs'),{},{},function (error,template) {
        if (error) {
            throw error;
        } else {
            res.send(template);
        }
    })
})
router.get('/image/ayush.jpeg',(req,res)=>{
    res.sendFile(path.join(__dirname, req.url))

})
router.get('/ayush/data',(req,res)=>{
    res.send({name:"ayush",age:15})
})
module.exports = router;