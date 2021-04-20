const express = require('express');
const path =require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database')
const session= require('express-session')

console.log(config.databaseLocal)

mongoose.connect(config.databaseLocal,{ useNewUrlParser: true ,useUnifiedTopology: true })

mongoose.connection.on('connected', ()=>{
	console.log('Connected to database '+config.databaseLocal)
})

mongoose.connection.on('error', (err)=>{
	console.log('Connected to database '+err)
})

const app = express();

const usersRoute = require('./routes/user')
const mainRoute = require('./routes/main')
const profileRoute = require('./routes/profile')
const checkoutRoute = require('./routes/checkout')

const errorHandlerControllers = require('./controllers/errorHandlers')

const port= process.env.PORT || 3000;

app.use(cors())

app.set('views', path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const userAlreadyAuthenticated =(req,res,next)=>{
	if(req.session.user_id){
		res.redirect('/')
	}else{
		next()
	}
	
}

const userAuthenticate =(req,res,next)=>{
	if(!req.session.user_id){
		res.redirect('/')
	}else{
		next()
	}
	
}

app.use(session({
	secret:'ssshhhh',
	cookie:{
		sameSite:true,	
		maxAge:600000},
	resave:false,
	saveUninitialized:false
}));


app.get('/',mainRoute)

app.use('/users', userAlreadyAuthenticated,usersRoute)

app.use('/profile', userAuthenticate,profileRoute)

app.use('/checkout', userAuthenticate,checkoutRoute)

app.use(errorHandlerControllers.pageNotFound);

app.use(errorHandlerControllers.OtherErrors);

app.listen(port, function(){ 
	console.log("Server started on Port "+port)
})