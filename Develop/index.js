
const fs = require('fs');
const { exec } = require("child_process");

const inquirer = require('inquirer');
const choosealicense = require('choosealicense-list');

const githubAPI = require('./utils/api.js');
const markdown = require('./utils/generateMarkdown.js');

const questions = [
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
        type: "list",
        message: "Choose a license that best suits your project.",
        name: "license",
        choices: ["I need to work in a community.", "I want it simple and permissive.",  // use preferred community license, MIT
                    "I care about sharing and improvements.", "My project isn't software.", // GPL-3.0,  Unlicense
                    "Choose my own license."]  // default
    },
    {
        type: "input",
        message: "Enter your contributor covenant or enter 'default'.",
        name: "contributor"
    },
    {
        type: "input",
        message: "Enter info on testing.",
        name: "test"
    }
];

const badgePrompt = [
    {
        type: "input",
        message: "Enter a badge label.",
        name: "label"
    },
    {
        type: "input",
        message: "Enter the badge message.",
        name: "message"
    },
    {
        type: "list",
        message: "Choose a badge color.",
        name: "color",
        choices: ["green", "yellow", "orange", "red", "blue", "blueviolet", "lightgrey"]
    }
];

function getUser(user, userInfo) {
    inquirer.prompt({
        type: "input",
        message: "Enter your GitHub username.",
        name: "username"
    }).then(function(response) {
        user = githubAPI.getUser(response.username);
    }).then(function() {
        if (user) {
            userInfo.push(user.avatar_url);
            userInfo.push(user.email);
        } else {
            getUser(user, userInfo);
        }
    });
}

function addBadges(badges) {
    inquirer.prompt(badgePrompt).then(function(response) {
        if (response.label === "" || response.message === "") {
            console.log("Error: Label or message missing.");
        } else {
            badges.push(`[![${response.label}](https://img.shields.io/static/v1?label=
                            ${response.label}&message=${response.message}&color=${response.color})]`);
        }
    }).then(function() {
        if (badges.length > 0) {
            inquirer.prompt({
                type: "Confirm",
                message: "Add another badge?",
                name: "answer"
            }).then(function(response) {
                if (response.answer === "true") {
                    addBadges(badges);
                } else {
                    return;
                }
            });
        } else {
            console.log("Add at least one badge.");
            addBadges(badges);
        }
    });
}

function getLicense(badges, license) {
    switch(license) {
        case "I need to work in a community.":
            fs.writeFile("LICENSE.txt", 
                "Use the license preferred by the community you’re contributing to or depending on at https://choosealicense.com.",
                (err) => {
                    if (err) throw err;
                }
            );

            break;

        case "I want it simple and permissive.":
            fs.writeFile("LICENSE.txt", choosealicense.MIT.body, (err) => {
                if (err) throw err;
            });
            
            badges.push(`[![License](https://img.shields.io/static/v1?label=license&message=MIT&color=green)](LICENSE.txt)`);
            break;

        case "I care about sharing and improvements.":
            fs.writeFile("LICENSE.txt", choosealicense["GPL-3.0"].body, (err) => {
                if (err) throw err;
            });
            
            badges.push(`[![License](https://img.shields.io/static/v1?label=license&message=GPL-3.0&color=green)](LICENSE.txt)`);
            break;

        case "My project isn't software.":
            fs.writeFile("LICENSE.txt", choosealicense.Unlicense.body, (err) => {
                if (err) throw err;
            });
            
            badges.push(`[![License](https://img.shields.io/static/v1?label=license&message=Unlicense&color=green)](LICENSE.txt)`);
            break;

        default:
            fs.writeFile("LICENSE.txt",
                "Visit https://choosealicense.com to add a license.",
                (err) => {
                    if (err) throw err;
                }
            );
    }
}

function writeToFile(fileName, data) {
    const markdownToAppend = markdown(data);

    fs.writeFile(fileName, markdownToAppend, function(err) {
        if (err) { console.log("Error."); }
        else { console.log("README.md generated."); }
    });
}

function init() {
    var user;
    const userInfo = [];
    getUser(user, userInfo);
    
    const badges = [];
    addBadges(badges);

    inquirer.prompt(questions).then(function(response) {
        getLicense(badges, response.license);

        if (response.contributor === "default") {
            exec(`covgen ${userInfo[1]} CODE_OF_CONDUCT.MD`, (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }

                console.log(`stdout: ${stdout}`);
                console.log("Fetching contributor covenant.");

                badges.push(`[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)](CODE_OF_CONDUCT.md)`); 
                
                response["questions"] = userInfo;
                response["badges"] = badges;

                writeToFile("README.md", response);
            });
        }
    });
}

init();