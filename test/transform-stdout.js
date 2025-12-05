'use strict';
/*jshint asi: true */

var test = require('tap').test,
    fs = require('fs'),
    exec = require("child_process").exec;

test('\nshould print to stdout with --stdout option', function (t) {

    exec('node doctoc.js test/fixtures/readme-with-custom-title.md --stdout --loglevel=trace', function (error, stdout, stderr) {
      if (error) {
        console.error('exec error: ', error);
        return;
      }
      t.deepEqual(stdout
        , fs.readFileSync(__dirname + '/fixtures/stdout_trace.md', 'utf8')
        , 'spits out the correct table of contents')

      t.end()
    })
})

test('\nshould print to stdout with -s option', function (t) {

    exec('node doctoc.js test/fixtures/readme-with-custom-title.md -s --loglevel=trace', function (error, stdout, stderr) {
      if (error) {
        console.error('exec error: ', error);
        return;
      }
      t.deepEqual(stdout
        , fs.readFileSync(__dirname + '/fixtures/stdout_trace.md', 'utf8')
        , 'spits out the correct table of contents')

      t.end()
    })
})

test('\nshould print to stdout with --stdout option and default logging aka info', function (t) {

    exec('node doctoc.js test/fixtures/readme-with-custom-title.md --stdout', function (error, stdout, stderr) {
      if (error) {
        console.error('exec error: ', error);
        return;
      }
      t.deepEqual(stdout
        , fs.readFileSync(__dirname + '/fixtures/stdout_info.md', 'utf8')
        , 'spits out the correct table of contents')

      t.end()
    })
})
