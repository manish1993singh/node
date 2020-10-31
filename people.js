var express = require('express')
const {MongoClient,ObjectID,ObjectId} = require('mongodb')
const ejs = require('ejs');
const path = require('path')

// const client = new MongoClient("mongodb://127.0.0.1:27017/",{ useUnifiedTopology: true });
const client = new MongoClient(`mongodb+srv://manish1993singh:qazxsw@123@node-express-mongo.3ftjm.mongodb.net/people?retryWrites=true&w=majority`,{ useUnifiedTopology: true });
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
    const data = {}
    ejs.renderFile(path.join(__dirname,'createPerson.ejs'),{data},{},function (error,template) {
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
router.get('/:_id',async function (req,res) {
res.send(await client.db('people').collection('people').find({"_id": new ObjectId(req.params._id)}).toArray())
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
            const result =  await client.db('people').collection('people').insertOne(req.body);
            console.log('writeResult',result.ops)
            res.jsonp({success:true,message:`user created`,result:result.ops})
        }
    }catch (e) {
        res.jsonp({success:false,message:`server error`,error:e.message})
    }
})
router.post('/delete/:_id', async function(req,res){
    try{
        const result = await client.db('people').collection('people').deleteOne({'_id':new ObjectId(req.params._id)});
        res.jsonp({...result,_id:req.params._id})
    }catch (e) {
        res.jsonp({success:false,message:`server error`,error:e,_id:new ObjectId(req.params._id)})
    }
})
router.get('/update/:_id', async function(req, res){

    try{
        const result = await client.db('people').collection('people').find({'_id':new ObjectId(req.params._id)}).toArray()

        if(result.length > 0){
            const data = result[0]
            ejs.renderFile(path.join(__dirname,'createPerson.ejs'),{data},{},function (error,template) {
                if (error) {
                    throw error;
                } else {
                    res.send(template);
                }
            })
        }else res.jsonp({success:false,message:`server error 1`,error:e,_id:new ObjectId(req.params._id)})

    }catch (e) {
        res.jsonp({success:false,message:`server error`,error:e.message,_id:new ObjectId(req.params._id)})
    }
})
router.post('/update-person', async function (req, res) {
    try{
        const data = {...req.body};
        delete data._id
        const result = await client.db('people').collection('people').updateOne({'_id':new ObjectId(req.body._id)},{$set:data})
        if(result.ok){
            res.jsonp({success:true,message:`user updated`,_id:req.body._id})
        }
        res.jsonp({success:true,message:`user updated`,_id:req.body._id,result:result})
    }catch (e) {
        res.jsonp({success:false,message:`server error`,error:e.message,_id:new ObjectId(req.params._id)})
    }
})
module.exports = router;