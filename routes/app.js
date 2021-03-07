const expree = require('express')
const path = require('path')
const app = new expree()
app.get('/',(req,res)=>{
	res.send('hello popo')
})
app.get('/name/:name',(req,res)=>{
	res.send(req.params.name+req.query.age)
})
const port = process.env.PORT||3000
app.listen(port,()=>console.log(`listning ${port}`))

app.get('/ayush',(re,res)=>{
	res.sendFile(path.join(__dirname, 'index.html'));
})


const loop = ()=>{
	let d=0;
	for(let i= 0; i< 100000;i++){
		d += i;
	}
	return d;
}