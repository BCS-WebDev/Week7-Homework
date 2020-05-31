
const fs = require('fs');   // load file system module for write to file
const { exec } = require("child_process");   // load exec function from child process module: to execute shell cmd (CovGen) from file 

const inquirer = require('inquirer');    // load inquirer module to prompt questions
const choosealicense = require('choosealicense-list');  // load choosealicense module to fetch license

const githubAPI = require('./utils/api.js');   // local dependency to fetch user via github api
const markdown = require('./utils/generateMarkdown.js');  // local dependency to generate final markdown

// questions for user input via inquirer module
const questions = [
    {   // project title
        type: "input",
        message: "Enter your project title:",
        name: "title"
    },
    {   // project description
        type: "input",
        message: "Enter a project description:",
        name: "description"
    },
    {   // installation
        type: "input",
        message: "Enter info about installation:",
        name: "installation"
    },
    {   // usage
        type: "input",
        message: "Enter usage info:",
        name: "usage"
    },
    {   // choosealicense prompt via list
        type: "list",
        message: "Choose a license that best suits your project:",
        name: "license",
        choices: ["I need to work in a community.", "I want it simple and permissive.",  // use preferred community license, MIT
                    "I care about sharing and improvements.", "My project isn't software.", // GPL-3.0,  Unlicense
                    "Choose my own license."]  // default creates file to direct user to choosealicense.com
    },
    {   // contributor covenant
        type: "input",
        message: "Enter your contributor covenant or enter 'default':", // 'default' fetches contributor covenant via CovGen
        name: "contributing"
    },
    {   // testing info - better to enter tests manually after readme is generated
        type: "input",
        message: "Enter a summary on testing:",
        name: "tests"
    }
];

// badge prompt
const badgePrompt = [
    {   // badge label
        type: "input",
        message: "Enter a badge label:",
        name: "label"
    },
    {   // badge message
        type: "input",
        message: "Enter the badge message:",
        name: "message"
    },
    {   // badge color prompt via list
        type: "list",
        message: "Choose a badge color:",
        name: "color",
        choices: ["green", "yellow", "orange", "red", "blue", "blueviolet", "lightgrey"]
    }
];

// async get User via github api
async function getUser(userInfo) {   // pass emtpy object to gather data 
    try {
        const {username} = await inquirer.prompt({  // await username input
            type: "input",
            message: "Enter your GitHub username.",
            name: "username"
        });

        const {data} = await githubAPI.getUser(username);   // get user via axios & github api

        if (data) {    // if success (data != null)
            userInfo.push(data.avatar_url);    // get user avatar
            userInfo.push(data.email);        // get user email
        }

    } catch (err) {    // catch if user not found
        console.log("Error: User not found.")
        await getUser(userInfo);    // await recur
    }
}

// async add badges
async function addBadges(badges) {  // pass badge array
    try { 
        const {label, message, color} = await inquirer.prompt(badgePrompt);  // prompt badge questions
        if (label === "" || message === "") {    // if any input is empty
            console.log("Error: Label or message missing.");  // dont push
        } else {    // else push badge
            badges.push(`[![${label}](https://img.shields.io/static/v1?label=${label}&message=${message}&color=${color})]`);
        }

        if (badges.length > 0) {     // if badge array has at least one element
            const {answer} = await inquirer.prompt({    // await prompt add another badge
                type: "confirm",
                message: "Add another badge?",
                name: "answer"
            });

            if (answer === true) {    // if yes
                await addBadges(badges);   // await recur
            } else {   // else return
                return;
            }

        } else {    // if badge array empty
            console.log("Add at least one badge.");
            await addBadges(badges);    // await recur
        }

    } catch (err) {
        console.log(err);   // log error if error caught
    }
}

// async get license via choosealicense
async function getLicense(badges, license) {   // pass badges array & license user response
    try {
        switch(license) {
            case "I need to work in a community.":   // choose a community license - redirect user
                fs.writeFileSync("LICENSE.txt", "Use the license preferred by the community you’re contributing to or depending on at https://choosealicense.com.");
                // use write file synce here for synchronous write and since no callback function needed
                break;
            case "I want it simple and permissive.":
                fs.writeFileSync("LICENSE.txt", choosealicense.MIT.body);  // get MIT liecnse & push badge
                badges.push(`[![License](https://img.shields.io/static/v1?label=license&message=MIT&color=green)](LICENSE.txt)`);
                
                break;
            case "I care about sharing and improvements.":
                fs.writeFileSync("LICENSE.txt", choosealicense["GPL-3.0"].body);  // get General public liecnse & push badge
                badges.push(`[![License](https://img.shields.io/static/v1?label=license&message=GPL-3.0&color=green)](LICENSE.txt)`);
                
                break;
            case "My project isn't software.":
                fs.writeFileSync("LICENSE.txt", choosealicense.Unlicense.body);    // get Unlicense liecnse & push badge
                badges.push(`[![License](https://img.shields.io/static/v1?label=license&message=Unlicense&color=green)](LICENSE.txt)`);
                
                break;
            default: // default - choose own license - redirect user
                fs.writeFileSync("LICENSE.txt","Visit https://choosealicense.com to add a license."); // default - choose your own

                break;
        }
    } catch (err) {
        console.log(err);   // log error if error caught
    }
}

// async get contributor covenant
async function getCovGen(badges, userEmail) {  // pass badge & github user email
    try {
        await exec(`covgen ${userEmail} CODE_OF_CONDUCT.md`);   // await fetch contributor convenant
        
        // push contributo covenant badge
        badges.push(`[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)](CODE_OF_CONDUCT.md)`); 
    } catch (err) {
        console.log(err);  // log error if error caught
    }
}

// write generated readme to file
function writeToFile(fileName, data) {
    const markdownToAppend = markdown(data);  // generate markdown

    fs.writeFile(fileName, markdownToAppend, function(err) {   // write markdown to file
        if (err) { console.log("Error."); }   // log error if error 
        else { console.log("README.md generated."); }   // log if success
    });
}

// async init
async function init() {
    const userInfo = [];   // user info array
    await getUser(userInfo);    // nested await get user
    
    const badges = [];     // badges array
    await addBadges(badges);   // nested await add badges

    const response = await inquirer.prompt(questions);   // nested await user response
    await getLicense(badges, response.license);         // nested await get license

    if (response.contributing === "default") {        // if contributing response is 'default'
        response.contributing = `See the contributor covenant [here](CODE_OF_CONDUCT.md).`;   // change response for markdown
        await getCovGen(badges, userInfo[1]);      // nested await cov gen
    }

    response["questions"] = userInfo;   // add userInfo property : value to user response
    response["badges"] = badges;       // add badges property : value to user response

    writeToFile("README.md", response);     // write response to file README.md
}

init();   // call init