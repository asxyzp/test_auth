/*
    Program : Adding, removing & updating data of users from the database.
    Author : Aashish Loknath Panigrahi (@asxyzp)
*/
const path = require('path');
const pathToENV = path.join(__dirname.substr(0,__dirname.indexOf('/1')),'.env');
const dotenv =  require('dotenv').config({'path':pathToENV});
const project_key = dotenv['parsed']['PROJECT_KEY'];
const {Deta} = require('deta');         
const deta =  Deta(project_key);
const session = deta.Base('sessionDB');

/*
    TL;DR :
    session : Deta Base w/ name 'sessionDB' (not same as sessionDB object)
    sessiondb() : Function which creates sessionDB object
    sessionDB : Object which allows to access methods createSession(), getSession() & deleteSession()
*/

function sessiondb(){

    /*
        Function : createSession(sessionID,username)
        Functionality : Inserts a new session in the sessionDB
        Parameters : sessionID - UUID code
                     username - username of the user
        Return value : Y - On succesful insertion of sessionID:username pair
                       N - On unsuccesful insertion of sessionID:username pair
    */
    this.createSession = async function(sessionID,username){
        //Details of a new session
        const newSession = {'username':username,key:sessionID};
        //Inserting new session into the sessionDB
        const output = await session.insert(newSession)
        .then((data)=>{       //When the insertion is succesful
            console.log(`SESSION DETAIL INSRTED : ${JSON.stringify(data)}`);
            return 'Y';
        }) 
        .catch((err)=>{       //When the insertion is unsuccessful because sessionID already exists
            console.log(`SESSION COULDN'T BE INSRTED BECAUSE `);
            console.error(err);
            return 'N';
        });
        return output;
    };

    /*
        Function : getSession(sessionID)
        Functionality : Verification of whether the sessionID is in the sessionDB
        Parameter : sessionID - sessionID which is sent for verification
        Return : Y - sessionID is in the sessionDB
                 N - sessionID is not in the sessionDb
    */
   this.getSession = async function(sessionID){

        //Obtaining session data
        const output = await session.get(sessionID)
        .then((data)=>{     //When sessionID exists in sessionDB
            console.log(`SESSION DETAIL OBTAINED : ${JSON.stringify(data)}`);
            return 'Y';
        })      
        .catch((err)=>{     //When sessionID doesn't exists in sessionDB
            console.log(`SESSION COULDN'T BE INSRTED BECAUSE `);
            console.error(err);
            return 'N';
        });
        return output;
   };

   /*
        Function : deleteSession(sessionID)
        Functionality : Deletes session details from the sessionDB
        Parameter : sessionID - sessionID of the user
        Return value : Y - session detail has been deleted
                       N - session detail can't be deleted
   */
  this.deleteSession = async function(sessionID){
        //Deleting session data
        const output = await session.delete(sessionID)
        .then((data)=>{     //When session details are deleted from the sessionDB
            console.log(`SESSION DETAIL DELETED.`);
            return 'Y';
        })      
        .catch((err)=>{     //When session details can't be deleted from the sessionDB
            console.log(`SESSION DETAIL CAN'T DETAIL.`);
            console.error(err);
            return 'N';
        });
        return output;
  };
}
const sessionDB = new sessiondb();
module.exports = sessionDB;
