/*
    Client-side script for dashboard
    Created by Aashish Loknath Panigrahi (@asxyzp)
*/

//Fetching the userName from the sessionDB using the sessionID
fetch('/userName')
.then(res=>res.text())
.then(data=>{
    console.log(`DATA RECEIVED : ${data}`);
    $('.hello').html(`👋 Hello, ${data}`);
});

$(document).ready(function(){
    $('.btn').click(function(){
        fetch('/signout')
        .then(res=>{
            if(res.redirected)
                window.location.href=res.url;
            else{
                console.log(res.text());
            }
        });
    });
});