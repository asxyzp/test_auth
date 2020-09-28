/*
    Program : Testing redirection of fetch()
    Created by Aashish Loknath Panigrahi (@asxyzp)
*/

const path = require('path');           //Importing path module
const express = require('express');     //Importing express module

const app = express();                  //Creating an express application

//Route handling for /
app.get('/',(req,res)=>{
    res.redirect('/test1.html');
});

//Route handling for /test.js
app.get('/test.js',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','test.js'));
});

//Route handling for /test2.html
app.get('/test1.html',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','test1.html'));
});

//Route handling for /test2.html
app.get('/test2.html',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','test2.html'));
});

//Route handling for test2.html
app.get('/redirect',(req,res)=>{
    res.status(300).redirect('/test2.html');
});

const port = process.env.PORT || 5000;  //Assigning port
app.listen(port,()=>{                   //Application listening on assigned port
    console.log(`APP STARTED ON PORT ${port}`);
});