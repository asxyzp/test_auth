fetch('/redirect',{method:'GET'})
.then(res=>{
    //Redirecting request to another page
    if(res.redirected){
        window.location.href=res.url;
    }
    //Or showing the response in plain text form
    else{
        console.log(res.text());
    }
});