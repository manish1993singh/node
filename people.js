var express = require('express')
const {MongoClient} = require('mongodb')
const ejs = require('ejs');
const path = require('path')


const client = new MongoClient("mongodb://127.0.0.1:27017/",{ useUnifiedTopology: true });
async function db(){
    try {
        await client.connect();
        await  listDatabases(client);

    } catch (e) {
        console.error(e);
    } finally {
        // await client.close();
    }

}
db()
async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
    // console.log(databasesList)
};

var router = express.Router();

router.get('/dbs', async function (req,res) {
    res.send(await client.db().admin().listDatabases())
})
router.get('/', function (req,res) {
    ejs.renderFile(path.join(__dirname, 'people.ejs'),{},{},function (error,template) {
        if (error) {
            throw error;
        } else {
            res.send(template);
        }
    })
})

router.get('/html/:name', function (req,res) {
    ejs.renderFile(path.join(__dirname, 'person.ejs'),{},{},function (error,template) {
        if (error) {
            throw error;
        } else {
            res.send(template);
        }
    })
})
router.get('/create_html',function (req, res) {
    ejs.renderFile(path.join(__dirname,'createPerson.ejs'),{},{},function (error,template) {
        if (error) {
            throw error;
        } else {
            res.send(template);
        }
    })
})

router.get('/all',async function (req,res) {
    res.send(await client.db('people').collection('people').find().toArray())
})
router.get('/:name',async function (req,res) {
res.send(await client.db('people').collection('people').find({"name": req.params.name}).toArray())
})
router.get('/collections', function (req,res) {
    res.send('returning collections')
})
router.post('/create-person',async function(req, res){
    try{
        const result = await client.db('people').collection('people').find({"name": req.params.name}).toArray()
        if(result.length > 0){
            res.jsonp({success:false,message:`record already present with _id${result[0]._id}`})
            return
        }else {
            const writeResult =  await client.db('people').collection('people').insertOne(req.body);
            console.log('writeResult',writeResult.ops)
            res.jsonp({success:true,message:`user created`})
        }
    }catch (e) {
        res.jsonp({success:false,message:`server error`,error:e})
    }
})
router.post('/delete/:_id', async function(req,res){
    res.jsonp({success:true,message:`user deleted`})
})
module.exports = router;