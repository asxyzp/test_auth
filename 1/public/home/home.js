/*
    Client-side script to handle interactivity & do fetch requests
    Created by Aashish Loknath Panigrahi
*/

//Submit button will be clickable only when username & password texts are not empty
window.setInterval(function(){
        if($('.username').val().length !=0 &&  $('.password').val().length!=0){
            $('.btn').prop('disabled',false);    
        }
        else{
            $('.btn').prop('disabled',true);
        }
    },100);

$(document).ready(function(){
    
    //The button is disabled by default & will be enabled only if both signup & signin text aren't empty
    $('.btn').prop('disabled',true);

    //When signup radio button is clicked
    //Then change the attribute of form to /signup? & button value to sign-up
    $('.signup').click(function(){
        $("form").attr("action","/signup?");
        $(".btn").html('sign-up');
    });

    //When signin radio button is clicked
    //Then change the attribute of form to /signin? & button value to sign-in
    $('.signin').click(function(){
        $("form").attr("action","/signin?");
        $(".btn").html('sign-in');
    });
    
    //When button is clicked
    $(".btn").click(function(){
        let username = $(".username").val();    //Storing username
        let password = $(".password").val();    //Storing password
        //If radio button which has been clicked is signup
        if($("form").attr("action").indexOf('signup')!=-1){

            //URL : /signup?username=usernameVal&password=passwordVal
            let url = $("form").attr("action")+`username=${username}&password=${password}`;
            
            console.log('signup btn clicked');
            
            //Sending signup data to the server when the button is clicked
            /*
                Output sent from server :
                Y : Signup successful
                N : Signin successful
                Show appropriate dismissible alert on appropriate output
            */
            fetch(url)
            .then(res=>res.text())
            .then(data=>{
                console.log('data received');

                if(data=='Y'){
                    $(".signup-success").css("display","block");
                }
                else{
                    $(".signup-fail").css("display","block");
                }
            });
        }
        //If radio button which has been clicked is signin
        else{

            //URL : /signup?username=usernameVal&password=passwordVal
            let url = $("form").attr("action")+`username=${username}&password=${password}`;

            /*
                Output from the server :
                res.redirect('/dashboard') : if the username & password combination is correct
                N : if the username & password combination is incorrect
            */
            fetch(url)
            .then(res=>{
                //If there's  a redirection
                if(res.redirected){
                    window.location.href = res.url;
                }
                //Else show the error message
                else{
                    $(".signin-fail").css("display","block");
                }
            });
        }
    });
});