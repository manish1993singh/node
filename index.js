const express = require('express')
const app = new express()
var parseurl = require('parseurl')
var session = require('express-session')
const people = require("./people")
const test = require("./test")
const user = require("./user")
app.use(express.json());
const path = require('path')

const port = process.env.PORT||3000
app.listen(port,()=>console.log(`listning ${port}`))

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))
app.use(function (req, res, next) {
    if (!req.session.views) {
        req.session.views = {}
    }

    // get the url pathname
    var pathname = parseurl(req).pathname

    // count the views
    req.session.views[pathname] = (req.session.views[pathname] || 0) + 1;
    next()
})
app.get('/foo', function (req, res, next) {
    console.log(req.session)
    if(req.session.views['/foo'] > 5){

        req.session.destroy(function(err) {
            // cannot access session here
        })
        res.send("expired")
    }else {
        res.send('you viewed this page ' + req.session.views['/foo'] + ' times')
    }

})
app.use('/icon',express.static(__dirname+'/image/'))
app.use('/',express.static(path.join(__dirname+'/css/')));
app.use("/test",test)
app.use('/people',people)
app.use('/user',user)
