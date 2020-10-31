const express = require('express')
const app = new express()

const people = require("./people")
const test = require("./test")
const icons = require("./icons")
app.use(express.json());
const port = process.env.PORT||3000
app.listen(port,()=>console.log(`listning ${port}`))

app.use('/icon',express.static(__dirname+'/image/'))
app.use("/test",test)
app.use('/people',people)
