# README Generator
BootCampSpot Web Development - Week 7 Homework

![Preview](https://github.com/BCS-WebDev/Week7-Homework/blob/master/Assets/ReadmeGenerator-min.gif)

[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)](CODE_OF_CONDUCT.md)
[![License](https://img.shields.io/static/v1?label=license&message=Unlicense&color=green)](LICENSE.txt)

## Notes on README & CLI Applications
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; README's are vital to any project as they present the
project in a single view. They contain info about installation, usage, contact info, how to
contribute, and licenses, and most importantly the project's description. The description is
essentially a pitch for why someone should consider taking a look at the project because it
describes what the project does and why it is useful. Without README's, potential user will
have to look through the source code to figure out what the project is about.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; This particular project will generate a README via a 
command-line application. User interact with these programs entirely through their terminal
and shell, which was necessary since early days of computers when graphical interfaces were
not available. In our previous projects, we ran our javascript files through a web browser,
however, with node, we can run our javascript files via node. 

## Motive & Action
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; We will be creating this README generator with the help
of some node packages, namely: inquirer for prompting questions, axios for github ajax request,
choosealicense for getting a license, and covgen to fetch a contributor convenant. These
packages will be installed via the node package manager.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; All of these modules use asynchronous methods, which can
cause problems for an application that needs to be done sequentially. Although too much 
synchronizing may not be optimal in terms of performance, it is necessary here. So we will be
using nested async/await functions to implement a sequential flow.

## Installation
Install `node.js` and run `npm install` under the Develop directory to install the necessary node packages.

* Installs:
    - inquirer node package
    - axios node package 
    - choosealicense node package - https://choosealicense.com/
    - covgen node package - https://www.contributor-covenant.org/
* Using badges from https://shields.io/

## Usage
Run `node index.js` from the Develop directory and answer the following prompts.

* Generates:
    - READMD.md
    - LICENSE.txt
    - CODE_OF_CONDUCT.md (optional)
* Specific Tests are better filled out manually after the README.md is generated.

## Contributing
See the contributor covenant [here](CODE_OF_CONDUCT.md).

## License
See the license [here](LICENSE.txt).

## Questions
Contact: kevin1choi@gmail.com
