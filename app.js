const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');



const app = express();


// * config
dotenv.config({ path: 'config/.env' });



// * bodyparser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// * express session 
app.use(session({
    secret: "qwertyuioplkjbnhfadsctxwunakmdhaykloiy",
    resave: true,
    saveUninitialized: true
}));


// passport middleware
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);


// * connect flash
app.use(flash());


// * gloabl vars
app.use((req, res, next) => {

    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');

    next();
});


// * connect mongoose
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => {
    console.log("db connected");
});


// * EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');


// * routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server running on ${PORT}`));

