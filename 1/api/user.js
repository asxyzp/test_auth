/*
    Program : Adding, removing & updating user data from the database.
    Author : Aashish Loknath Panigrahi (@asxyzp)
*/
const path = require('path');
const pathToENV = path.join(__dirname.substr(0,__dirname.indexOf('/1')),'.env');
const dotenv =  require('dotenv').config({'path':pathToENV});
const project_key = dotenv['parsed']['PROJECT_KEY'];
const {Deta} = require('deta');         
const deta =  Deta(project_key);
const user = deta.Base('userDB');

/*
    TL;DR
    user : Base object for userDB deta base (not same as userDB object)
    userdb : Function which creates userDB object through which createUser(), getUser()
    userDB : Object which helps in accessing createUser() & getUser()
*/

function userdb(){
    
    /*
        Function : createUser(username,password)
        Functionality : Inserts a new user 
        Parameters : username - username of the user
                     password - password of the user
        Return value : Y - User data was successfully inserted in the userDB
                       N - User data already exists in the userDB
    */
    this.createUser = async function(username,password){
        const newUser = {key: username,'password':password};
        const output  = await user.insert(newUser)
        .then((data)=>{
            console.log(`USER DETAIL INSRTED : ${JSON.stringify(data)}`);
            return 'Y';
        })
        .catch(()=>{
            console.log(`USER DETAIL COULDN'T BE INSRTED BECAUSE IT ALREADY EXISTS.`);
            return 'N';
        });
        return output;
    };

    /*
        Function : getUser(username)
        Functionality : gets user details from the userDB
        Parameters : username - username of the user
        Return Value : {key:username, password:password} - When correct username is obtained from the database
                     : 'N' - When incorrect username is sent
    */
    this.getUser = async function(username){
        const output = await user.get(username)
        .then((data)=>{
            console.log(`REQUESTED USER DETAIL : ${JSON.stringify(data)}`);
            return data;
        })
        .catch(()=>{
            console.log(`USER DETAIL COULDN'T BE FETCHED.`);
            return 'N';
        });
        return output;
    };
}

const userDB = new userdb();
module.exports = userDB;