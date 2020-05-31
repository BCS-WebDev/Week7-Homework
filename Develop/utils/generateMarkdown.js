
function generateMarkdown(data) {

    return `
        # ${data.title}

        ${data.badges.join('\n')}

        ## Description
        ${data.description}

        ## Contents
        * [Installation](#installation)
        * [Usage](#usage)
        * [License](#license)
        * [Contributors](#contributors)
        * [Test](#test)
        * [Questions](#questions)

        ## Installation
        ${data.installation}

        ## Usage
        ${data.usage}

        ## License
        See the license [here](LICENSE.txt).

        ## Contributors
        ${data.contributor}

        ## Test
        ${data.test}

        ## Questions
        ![Profile Picture](${data.questions[0]})
        Contact: ${data.questions[1]}
        `;
}

module.exports = generateMarkdown;
