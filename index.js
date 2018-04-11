require('dotenv').config();

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const students = require('./students.json')
const strategy = require(`${__dirname}/strategy`)

const app = express();
  
app.use(
    session({
        secret:process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        // cookie: {
        //     maxAge: 100000
        // }
    })
)
app.use( passport.initialize());
app.use( passport.session());
passport.use(strategy);

passport.serializeUser((user,done)=>{
    return done(null,{clientID: user.id, email: user._json.email, name:user._json.name});
});
passport.deserializeUser((obj,done)=> {
    return done(null,obj);
})


app.get('/login', passport.authenticate('auth0', {
    successRedirect: '/students',
    failureRedirect: '/login',
    connection: 'github'
    // failureFlash: true
}))
function authenticate(req,res,next){
    if(!req.user){
        res.status(401).json({message:'Unathorized'});
    } else {
        next()
    }
    // if(req.user){
    //     next()
    // } else {
    //     res.sendStatus(401)
    // }
}

app.get('/students', authenticate, (req,res,next)=> {
    // if(!req.user){
    //     res.status(401).json({message: "Unauthorized"});
    // } else {
        res.status(200).json(students);
    // }
})


const port = 3000;
app.listen( port, () => { console.log(`Server listening on port ${port}`); } );