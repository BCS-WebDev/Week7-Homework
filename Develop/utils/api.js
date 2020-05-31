
const axios = require('axios');   // load axios module

/* object method is used in an async function
    - does not have a 'then' function
    - errors caught by try-catch
*/
const api = {    // object
    getUser(username) {      // object method to get username 
        return axios.get("https://api.github.com/users/" + username);   // github api ajax request
    }
};

module.exports = api;    // export api object
