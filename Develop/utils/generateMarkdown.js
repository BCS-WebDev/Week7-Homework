function generateMarkdown(data) {
  return `
    # ${data.title}

    ## Badges
    ${data.badges}

    ## Description
    ${data.description}

    ## Contents
    ${data.contents}

    ## Installation
    ${data.installation}

    ## Usage
    ${data.usage}

    ## License
    ${data.license}

    ## Contributors
    ${data.contributors}

    ## Test
    ${data.test}

    ## Questions
    ${data.questions[0]}
    ${data.questions[1]}
    `;
}

module.exports = generateMarkdown;
