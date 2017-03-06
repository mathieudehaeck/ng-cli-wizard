#!/usr/bin/env node
'use strict';

const fullname = require('fullname'),
    chalk = require('chalk'),
    figlet = require('figlet'),
    inquirer = require('inquirer'),
    exec = require('child_process').exec,
    execSync = require('child_process').execSync,
    promise = require('es6-promise').Promise, state = {},
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
      choices: ['Yarn', 'NPM, Because i have all the time in the world.'],
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
      message: 'Would you like to serve your new app in the browser when finished ?',
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
    let projectDir = answers.projectName,
        serve = answers.serve;

    // todo: first touch projectname && cd projectname
    // run ng init

    new promise(function (resolve, reject) {
      _runCmd(`mkdir ${answers.projectName} && ls -la`, () => {
        resolve();
      });
    });
    //     .then(function () {
    //   return new promise(function (resolve, reject) {
    //     _runCmd(`yarn`, () => {
    //       resolve();
    //     });
    //   });
    // }).then(function () {
    //   return new promise(function (resolve, reject) {
    //     _runCmd(`yarn`, () => {
    //       resolve();
    //     });
    //   });
    // });



  });

    // _runCmd(`ng new ${_getNgNewOptions(answers)}`, () => {


    // sequence
    //     .then(function() {
    //       _runCmd(`ng new ${_getNgNewOptions(answers)}`, next)
    //     })
    //     .then(function(next, res) {
    //       console.log('>>>> done!');
    //     });


    //     cmdArray = [];
    //
    // cmdArray.push(`ng new ${_getNgNewOptions(answers)}`);
    // cmdArray.push(`cd ${projectDir}`);
    // cmdArray.push('yarn');
    //
    // // if (serve) {
    // //   cmdArray.push('ng serve');
    // // }
    //
    // let cmd = cmdArray.join('&&');
    //
    // _runCmd(cmd, () => {
    //   if (serve) {
    //     // openurl.open('http://localhost:4200/');
    //   }
    // });

};

/**
 * Get the options for generating a new project
 * @param answers
 * @returns {*}
 * @private
 */
const _getNgNewOptions = (answers) => {
  let options = answers.projectName;
  answers.dependencyManager == 'yarn' ? options += ` -sn` : null;
  answers.git == false ? options += ` -sg` : null;
  answers.unitTesting == false ? options += ` -st` : null;
  answers.cssPreprocessor == 'scss' || 'sass' || 'less' || 'stylus' ? options += ` --style=${answers.cssPreprocessor}` : null;
  answers.unitTesting == true ? options += ` --routing` : null;
  answers.inlineOptions.indexOf('style') ? options += ` -is` : null;
  answers.inlineOptions.indexOf('templates') ? options += ` -it` : null;
  return options;
};

/**
 * Get the options for serving the app
 * @param answers
 * @returns {*}
 * @private
 */
const _getNgServeOptions = (answers) => {
  let serve = answers.serve;
  return serve;
};

/**
 * Run a command with options
 * @param cmd
 * @param options
 * @private
 */
const _runCmd = (cmd, callback) => {
  // console.log(`Running: ${cmd}`);

  // let execCmd = exec('pwd', {
  //   cwd: '/home/user/directory'
  // }, function(error, stdout, stderr) {
  //   // work with result
  // });

 let path = cwd || '/';


  let execCmd = exec(`${cmd}`,{cwd: path}, (error, stdout, stderr) => {//--colors
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`${stdout}`);
    // console.log(`stderr: ${stderr}`);
  });

  execCmd.on('exit', () => {
    callback();
  })
};

/**
 * Run the CLI
 */
_start(() => {
  _createNewProject();
});

// Todo: Synchronous Exec in Node.js
// Todo: serve and open in browser separate from ng new