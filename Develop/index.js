
const inquirer = require('inquirer');
const githubAPI = require('./utils/api.js');
const markdown = require('./utils/generateMarkdown.js');
const fs = require('fs');

const questions = [
    {
        type: "input",
        message: "Add at least one badge & badge info.",
        name: "badges"
    },
    {
        type: "input",
        message: "Enter your project title.",
        name: "title"
    },
    {
        type: "input",
        message: "Enter a project description.",
        name: "description"
    },
    {
        type: "input",
        message: "Enter the table of contents.",
        name: "contents"
    },
    {
        type: "input",
        message: "Enter info about installation.",
        name: "installation"
    },
    {
        type: "input",
        message: "Enter usage info.",
        name: "usage"
    },
    {
        type: "input",
        message: "Add a license.",
        name: "license"
    },
    {
        type: "input",
        message: "Enter contributor info.",
        name: "contributors"
    },
    {
        type: "input",
        message: "Enter info on testing.",
        name: "test"
    }
];

function writeToFile(fileName, data) {
    const markdownToAppend = markdown(data);

    fs.appendFile(fileName, markdownToAppend, function(err) {
        if (err) { console.log("Error."); }
        else { console.log("README.md generated."); }
    });
}

function init() {
    let userGet = false;
    const userInfo = [];
    while (userGet === false) {
        inquirer.prompt({
            type: "input",
            message: "Enter your GitHub username.",
            name: "username"
        }).then(function(response) {
            const user = githubAPI.getUser(response.username);
            if (user) {
                userInfo.push(user.avatar_url);
                userInfo.push(user.email);

                userGet = true;
            }  
        });
    }

    inquirer.prompt(questions).then(function(response) {
        response["questions"] = userInfo;

        writeToFile("README.md", response);
    });
}

init();
