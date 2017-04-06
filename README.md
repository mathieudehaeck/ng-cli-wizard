![logo](https://github.com/MathieuDeHaeck/ng-cli-wizard/blob/master/assets/logo.png)

## ng-cli-wizard
![](https://img.shields.io/badge/build-stable-brightgreen.svg?maxAge=100000)
<a href="http://choosealicense.com/licenses/mit/"><img src="https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=10000" alt="MIT License"/></a>

> A wizard to quickly set up new projects, with the [Angular CLI](https://github.com/angular/angular-cli).

## Prerequisites

#### [NodeJS](https://nodejs.org/en/)
Both the CLI and generated project have dependencies that require Node 6.9.0 or higher, together
with NPM 3 or higher.

#### [Angular CLI](https://cli.angular.io/)
```bash
npm install -g @angular/cli
```

#### [Yarn](https://yarnpkg.com/en/)
```bash
npm install -g yarn
```

## Table of Contents

* [Installation](#installation)
* [Usage](#usage)
* [Questions](#questions)
* [License](#license)

## Installation

**BEFORE YOU INSTALL:** please read the [prerequisites](#prerequisites)
```bash
npm install -g ng-cli-wizard
```

## Usage

```bash
ngw
```

## Questions
* What would be the name for your new Angular project?
    > default: `my-new-app`
* What dependency manager would you like to use?
    * Yarn (default)
    * NPM, Because i have all the time in the world.
* Would you like to initialize a local git repository?
    * Yes (default)
    * No
* Would you like to use unit testing?
    * Yes (default)
    * No
* Which css preprocessor would you like to use?
    * scss (default)
    * sass
    * less
    * stylus
    * none, just plain css. (I'm talking old school style)
* Would you like to use Routing?
    * Yes
    * No (default)
* What would you like to use inline?
    * styles
    * templates
* Would you like to serve your new app in the browser when finished?
    * Yes (default)
    * No
    
## License
MIT
