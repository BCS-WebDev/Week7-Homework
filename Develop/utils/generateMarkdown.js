
function generateMarkdown(data) {
    // trim data here

    return `
        # ${data.title}

        ${data.badges.join('\n')}

        ## Description
        ${data.description}

        ## Contents
        ${data.contents}
        * [Installation](#installation)

        ## Installation
        ${data.installation}

        ## Usage
        ${data.usage}

        ## License
        ${data.license}

        ## Contributors
        ${data.contributor}

        ## Test
        ${data.test}

        ## Questions
        ![Profile Picture](${data.questions[0]})
        ${data.questions[1]}
        `;
}

module.exports = generateMarkdown;
