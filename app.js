const express = require('express');
const mongoose = require('mongoose')
const dotenv = require('dotenv');
const connectDB=require('./config/db');
const morgan = require('morgan');
const path= require('path');
const passport = require('passport');
const session = require('express-session')
const MongoStore = require('connect-mongo')

//store ssession is mongodb so that on refresh is does not gets kicked out



//load configuration
dotenv.config({path:'./config/config.env'})

//passport congif
require('./config/passport')(passport);


connectDB();

const app = express();

// body pareser and for json datad
app.use(express.urlencoded({extended: false}))
app.use(express.json());

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

//handlebars configuration

app.set('view engine', 'ejs');

//express session

app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      store:  MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    })
    })
)

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//set global variables


//static folders
app.use(express.static(path.join(__dirname, 'public')))


//routes
app.use('/',require('./routes/index'));
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/story'))






const PORT= process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`listening on port ${PORT} in ${process.env.NODE_ENV} mode`);
})

