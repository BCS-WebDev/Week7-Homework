
/* generate the template literal for the final markdown
    - no indentation due to string being template literal
    - join badges array to string with new line separators
    - table of contents built-in as fields are pre-defined
    - License and Contributor covenant, if any, are linked to respective files
    - tests are better entered manually after readme is generated
*/
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
* [Contributing](#contributing)
* [Test](#test)
* [Questions](#questions)

## Installation
${data.installation}

## Usage
${data.usage}

## License
See the license [here](LICENSE.txt).

## Contributing
${data.contributing}

## Tests
${data.tests}

1. \`enter test command here\`
    * Test results

## Questions
![Profile Picture](${data.questions[0]})
Contact: ${data.questions[1]}
    `;
}

module.exports = generateMarkdown;   // export funciton for use in index.js
