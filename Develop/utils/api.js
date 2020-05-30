
const axios = require('axios');

const api = {
    getUser(username) {
        axios.get("https://api.github.com/users/" + username).then(function(response) {
            // console.log("User get.")
            return response;
        }).catch(function (error) {
            console.log("Error: User not found.")
            return null;
        });
    }
};

module.exports = api;
