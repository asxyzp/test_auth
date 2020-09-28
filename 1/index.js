/*
    Creating server program for authorization & authentication system w/ cookies
    Created by Aashish Loknath Panigrahi (@asxyzp)
*/

//Importing modules
const url = require('url');                    //Importing URL module                     
const uuid = require('uuid');                  //Importing UUID module
const path = require('path');                  //Importing path module
const express = require('express');            //Importing express module
const userDB = require('./api/user');          //Importing user module
const sessionDB = require('./api/session');    //Importing sessions module

//Creating an express application
const app = express();

//Route handling for /userName to fetch the username from the sessionID
app.get('/userName',(req,res)=>{
    async function execute(){

        //Extracting session from request header
        const sessionID = req.headers.cookie.substr(req.headers.cookie.indexOf('=')+1);
        
        //Checking whether the sessionID is in the sessionDB
        const output = await sessionDB.getSession(sessionID);

        //If user session data exists in the sessionDB then send the username for the particular session
        if(output!='N'){
            res.send(output['username']);
        }

        //If user session data does not exists in the sessionDB
        else{
            res.send(`User not found`);
        }
    }
    execute();
});

//Route handling for /signout
app.get('/signout',(req,res)=>{
    async function execute(){
        //Extracting session from request header
        const sessionID = req.headers.cookie.substr(req.headers.cookie.indexOf('=')+1);
        //Deleting session data from the sessionDB
        const output = await sessionDB.deleteSession(sessionID);
        
        //If the sessionID is deleted from the sessionDB then delete the cookie from the request header
        //And redirect the page to /
        if(output=='Y'){
            res.cookie('sessionID',sessionID,{'path':'/','maxAge':-1});
            res.redirect('/');
        }
        //Else send the message that the sessionID can't be deleted from the sessionDB
        else{
            res.send(`User details can't be deleted.`);
        }
    }
    execute();
});

//Route handling for /signup
app.get(/signup/,(req,res)=>{
    let url = 'http://localhost://5000'+req.url;
    if(req.url.indexOf('username=')!=-1&&req.url.indexOf('password=')!=-1){
        
        //Using URL module of NodeJS to obtain search parameters
        let newURL = new URL(url);
        let username = newURL.searchParams.get('username');
        let password = newURL.searchParams.get('password');
        if(username.length>0&&password.length>0){   //If username or password is not empty
            async function execute(){   //Now insert the username & password in the userDB
                const output = await userDB.createUser(username,password);
                if(output=='Y')         //If the user details doesn't exists in the userDB
                    res.send('Y');
                else if(output=='N')    //If the user details exists in the userDB
                    res.send('N');
            }
            execute();
        }
        else{                           //Else if the username or password is empty
            res.send('N');
        }
    }
    else{                               //If the search paramters aren't in a proper format
        res.send('N');
    }
});

//Route handling for /signin
app.get(/signin/,(req,res)=>{
    let url = 'http://localhost://5000'+req.url;
    if(req.url.indexOf('username=')!=-1&&req.url.indexOf('password=')!=-1){
        
        //Using URL module of NodeJS to obtain search parameters
        let newURL = new URL(url);
        let username = newURL.searchParams.get('username');
        let password = newURL.searchParams.get('password');
        if(username.length>0&&password.length>0){   //If username or password is not empty
            
            async function userExecute(){           
                const output = await userDB.getUser(username);     //Now get the username & password from the userDB
                if(output.password==password)                      //If the user password maches with sent password
                {
                    let sessionID = uuid.v4();          //New sessionID
                    async function sessionExecute(){    //Create a new session
                        const output = await sessionDB.createSession(sessionID,username);
                        //If session has been created successfully
                        if(output=='Y'){
                            res.cookie('sessionID',sessionID,{'path':'/'});
                            res.redirect('/dashboard');
                        }
                        //If session can't be created
                        else{
                            res.send('N');
                        }
                    }                    
                    sessionExecute();
                }
                else                                //If the user details doesn't exists in the userDB
                    res.send('N');
            }
            userExecute();
        }
        else{                           //Else if the username or password is empty
            res.send('N');
        }
    }
    else{                               //If the search paramters aren't in a proper format
        res.send('N');
    }
});

//Route handling for /
app.get('/',(req,res)=>{

    //If there are no cookies in the request header
    //Then send the home page
    if(req.headers.cookie==undefined){
        res.sendFile(path.join(__dirname,'public','home','home.html'));
    }
    
    //else if there are cookies in the request header
    else{

        //Then make sure that there's a cookie in the request header in the format sessionID=sessionIDValue
        if(req.headers.cookie.indexOf('sessionID=')!=-1){
            
            //Extracting sessionIDValue from the cookies
            const sessionID = req.headers.cookie.substr(req.headers.cookie.indexOf('=')+1);
            
            //Verify the obtained sessionIDValue against sessionDB 
            async function execute(){
                const output = await sessionDB.getSession(sessionID); 
                if(output!='N'){            //When the sessionID in the request header belongs to the sessionDB
                    res.redirect('/dashboard');
                }
                else if(output=='N'){       //When the sessionID in the request header is not in the sessionDB
                    res.sendFile(path.join(__dirname,'public','home','home.html'));
                }
            }
            execute();
        }

        //When cookie contains no sessionID in the format sessionID=sessionIDValue
        else{
            res.sendFile(path.join(__dirname,'public','home','home.html'));
        }
    }
});

//Route handling for /dashboard
app.get('/dashboard',(req,res)=>{
    
    //If there are no cookies in the request header
    if(req.headers.cookie==undefined){
        res.redirect('/');
    }
    
    //If there are cookies in the request header
    else{
        //Then make sure that there's a cookie in the request header in the format sessionID=sessionIDValue
        if(req.headers.cookie.indexOf('sessionID=')!=-1){
            
            //Extracting sessionIDValue from the cookies
            const sessionID = req.headers.cookie.substr(req.headers.cookie.indexOf('=')+1);
            
            //Verify the obtained sessionIDValue against sessionDB 
            async function execute(){
                const output = await sessionDB.getSession(sessionID); 
                if(output!='N'){            //When the sessionID in the request header belongs to the sessionDB
                    res.sendFile(path.join(__dirname,'public','dashboard','dashboard.html'));
                }
                else if(output=='N'){       //When the sessionID in the request header is not in the sessionDB
                    res.redirect('/');
                }
            }
            execute();
        }
        else{
            res.redirect('/');
        }
    }
});

//For handling home/landing page files (HTML+CSS+JS)
app.get('/home.html',(req,res)=>{res.sendFile(path.join(__dirname,'public','home','home.html'));});
app.get('/home.css',(req,res)=>{res.sendFile(path.join(__dirname,'public','home','home.css'));});
app.get('/home.js',(req,res)=>{res.sendFile(path.join(__dirname,'public','home','home.js'));});

//For handling dashboard files (HTML+CSS+JS)
app.get('/dashboard.html',(req,res)=>{res.sendFile(path.join(__dirname,'public','dashboard','dashboard.html'));});
app.get('/dashboard.css',(req,res)=>{res.sendFile(path.join(__dirname,'public','dashboard','dashboard.css'));});
app.get('/dashboard.js',(req,res)=>{res.sendFile(path.join(__dirname,'public','dashboard','dashboard.js'));});

//Handling 404 error
app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
});

//Setting port number & listening to the port
const port = process.env.PORT || 65535;
app.listen(port,(err)=>{    
    if (err){                   //If there's an error while listening to the requests at the port
        throw console.error(`ERROR : ${err}`);
    }
    else{                      //If there's no error while listening to the requests at the port
        console.log(`APP STARTED AT PORT ${port}.`);
    }
});