#!/usr/bin/env node
'use strict';

const fullname = require('fullname'),
    chalk = require('chalk'),
    figlet = require('figlet'),
    inquirer = require('inquirer'),
    exec = require('child_process').exec,
    openurl = require('openurl');

/**
 * Start banner with a customized message
 * @param callback
 * @private
 */
const _start = (callback) => {
  fullname().then(name => {
    const hi = name ? `Hi ${name.split(' ')[0]}!` : '\'Hi!';
    console.log(
        chalk.magenta(
            figlet.textSync(' NG CLI WIZARD', {
              font: 'slant',
              horizontalLayout: 'default'
            }),
            `\n  ${hi} Welcome to the ng-cli wizard. \n  Let me be your guide on this magical journey.\n`
        )
    );
    return callback();
  });
};

/**
 * Create a new project
 * @private
 */
const _createNewProject = () => {
  const ngNewQuestions = [
    {
      type: 'input',
      name: 'projectName',
      message: 'What would be the name for your new Angular project?',
      default: 'my-new-app'
    },
    {
      type: 'list',
      name: 'dependencyManager',
      message: 'What dependency manager would you like to use?',
      choices: ['Default', 'Yarn', 'NPM'],
      filter: function (val) {
        return val.toLowerCase();
      }
    },
    {
      type: 'confirm',
      name: 'git',
      message: 'Would you like to initialize a local git repository?',
      default: true
    },
    {
      type: 'confirm',
      name: 'unitTesting',
      message: 'Would you like to use unit testing?',
      default: true
    },
    {
      type: 'list',
      name: 'cssPreprocessor',
      message: 'Which css preprocessor would you like to use?',
      choices: ['scss', 'sass', 'less', 'slylus', 'none, just plain css. (I\'m talking old school style)'],
    },
    {
      type: 'confirm',
      name: 'routing',
      message: 'Would you like to use Routing?',
      default: false
    },
    {
      type: 'checkbox',
      name: 'inlineOptions',
      message: 'What would you like to use inline?',
      choices: ['styles', 'templates']
    },
    {
      type: 'confirm',
      name: 'serve',
      message: 'Would you like to serve your new app in the browser when finished?',
      default: true
    },
    // {
    //   type: 'list',
    //   name: 'uiFramework',
    //   message: 'Would you like to use a ui framework?',
    //   choices: ['material2', 'ng-bootstrap', 'none'],
    //   default: ['none'],
    // },
    // {
    //   type: 'confirm',
    //   name: 'firebase',
    //   message: 'Would you like to use Firebase (angularfire2)?',
    //   default: false
    // },
  ];

  inquirer.prompt(ngNewQuestions).then((answers) => {
    const projectDir = answers.projectName;

    _setupProject(answers, () => {
      if(answers.dependencyManager === 'default') {
        _serveProject(projectDir);
      } else {
        _installPackages(answers.dependencyManager, projectDir, () => {
          _serveProject(projectDir);
        });
      }

    });
  });
};

/**
 * Setup a new ng-cli project
 * @param answers
 * @param callback
 * @private
 */
const _setupProject = (answers, callback) => {
  let execCmd = exec(`ng new ${_getNgNewOptions(answers)} --colors`, (error) => {
    if (error) {
      console.error(error);
      return;
    }
  });

  execCmd.stdout.on('data', function (data) {
    console.log(data.toString().replace(/\n$/, ''));
  });

  execCmd.stderr.on('data', function (data) {
    console.log(data.toString().replace(/\n$/, ''));
  });

  execCmd.on('exit', () => {
    callback();
  });
};

/**
 * install packages using yarn
 * @param projectDir
 * @param callback
 * @private
 */
const _installPackages = (dependencyManager, projectDir, callback) => {
  console.log(chalk.green(`Installing packages for tooling via ${dependencyManager}.`));

  let execCmd = exec(`${dependencyManager} install --colors`,
      {cwd: `./${projectDir}/`},
      (error) => {
        if (error) {
          console.error(error);
          return;
        }
      });

  execCmd.stderr.on('data', function (data) {
    console.log(data.toString().replace(/\n$/, ''));
  });

  execCmd.on('exit', () => {
    console.log(chalk.green('Installed packages for tooling via yarn.'));
    callback();
  });
};

/**
 * Serve the new project
 * @param projectDir
 * @private
 */
const _serveProject = (projectDir) => {
  let execCmd = exec(`ng serve --colors`, {
        cwd: `./${projectDir}/`,
        maxBuffer: 1024 * 500
      },
      (error, stdout) => {
        if (error) {
          console.error(error);
          return;
        }
        console.log(stdout);
      });

  openurl.open('http://localhost:4200/');

  execCmd.stderr.on('data', function (data) {
    console.log(data.toString());
  });

  execCmd.on('exit', () => {
    console.log(chalk.red('Something went wrong, server has stopped.'));
  });
};

/**
 * Get the options for generating a new project
 * @param answers
 * @returns {*}
 * @private
 */
const _getNgNewOptions = (answers) => {
  let options = answers.projectName;
  answers.dependencyManager !== 'default' ? options += ` -si` : null;
  answers.git === false ? options += ` -sg` : null;
  answers.unitTesting === false ? options += ` -st` : null;
  answers.cssPreprocessor === 'scss' || 'sass' || 'less' || 'stylus' ? options += ` --style=${answers.cssPreprocessor}` : null;
  answers.unitTesting === true ? options += ` --routing` : null;
  answers.inlineOptions.indexOf('style') ? options += ` -is` : null;
  answers.inlineOptions.indexOf('templates') ? options += ` -it` : null;
  return options;
};

/**
 * Run the CLI
 */
_start(() => {
  _createNewProject();
});
