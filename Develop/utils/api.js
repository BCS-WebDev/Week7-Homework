const api = {
  getUser(username) {
    $.ajax({
        url: "https://api.github.com/users/" + username,
        type: 'GET',
        error: function() {
          console.log("Error: User not found.");
        }
    }).then(function(response) {
        return response;
    });
  }
};

module.exports = api;
