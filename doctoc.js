#!/usr/bin/env node

"use strict";

var path = require("path"),
  fs = require("fs"),
  os = require("os"),
  minimist = require("minimist"),
  file = require("./lib/file"),
  transform = require("./lib/transform"),
  log = require('loglevel'),
  files;

function cleanPath(filePath) {
  var homeExpanded = (filePath.indexOf('~') === 0) ? path.join(os.homedir(), filePath.substr(1)) : filePath;

  return homeExpanded;
}

function transformAndSave(files, mode, stdOut, updateOnly, syntax, dryRun, options) {
  if (options.toc.items.source === 'all') {
    log.debug('--all flag is enabled. Including headers before the TOC location.');
  }

  if (updateOnly) {
    log.debug('--update-only flag is enabled. Only updating files that already have a TOC.');
  }

  log.debug('\n==================\n');

  var transformed = files
    .map(function (x) {
      var content = fs.readFileSync(x.path, 'utf8')
        , result = transform(content, mode, undefined, undefined, undefined, undefined, undefined, undefined, undefined, updateOnly, syntax, options);
      result.path = x.path;
      return result;
    });
  var changed = transformed.filter(function (x) { return x.transformed; }),
    unchanged = transformed.filter(function (x) { return !x.transformed; }),
    toc = transformed.filter(function (x) { return x.toc; });

  if (stdOut) {
    toc.forEach(function (x) {
      console.log(x.toc);
    });
  }

  unchanged.forEach(function (x) {
    if (stdOut) {
      console.log('==================\n\n"%s" is up to date', x.path);
    }
    else {
      log.debug('"%s" is up to date', x.path);
    }
  });

  changed.forEach(function (x) {
    if (stdOut) {
      console.log('==================\n\n"%s" should be updated', x.path);
    } else if (dryRun) {
      log.warn('"%s" should be updated but wasn\'t due to dry run.', x.path);
    }
    else {
      log.info('"%s" will be updated', x.path);
      fs.writeFileSync(x.path, x.data, "utf8");
    }
  });
  if (dryRun && changed.length > 0) {
    process.exitCode = 1;
  }
}

function printUsageAndExit(isErr) {
  var outputFunc = isErr ? log.error : log.info;

  outputFunc('Usage: doctoc [mode] [--entryprefix prefix] [--notitle | --title title] [--maxlevel level] [--minlevel level] [--mintocitems qty] [--toc-location location] [--toc-pragma-style style] [--toc-header-content content] [--toc-footer-content content] [--toc-items-indentation-width width] [--toc-items-indentation-style style] [--all] [--loglevel level] [--update-only] [--syntax (' + supportedSyntaxes.join("|") + ')] <path> (where path is some path to a directory (e.g., .) or a file (e.g., README.md))');
  outputFunc('\nAvailable modes are:');
  for (var key in modes) {
    outputFunc("  --%s\t%s", key, modes[key]);
  }
  outputFunc("Defaults to '" + mode + "'.");

  process.exit(isErr ? 2 : 0);
}

var supportedSyntaxes = ['md', 'mdx'];
var modes = {
  bitbucket: "bitbucket.org",
  nodejs: "nodejs.org",
  github: "github.com",
  gitlab: "gitlab.com",
  ghost: "ghost.org",
};

var mode = modes["github"];

var argv = minimist(process.argv.slice(2),
    {
      boolean: [ 'h', 'help', 'T', 'notitle', 's', 'stdout', 'all' , 'u', 'update-only', 'd', 'dryrun'].concat(Object.keys(modes)),
      string: [ 'title', 't', 'maxlevel', 'm', 'minlevel', 'entryprefix', 'syntax', 'mintocitems', 'toc-location', 'toc-title-padding-before', 'toc-header-content', 'toc-footer-content', 'toc-pragma-style', 'toc-items-indentation-width', 'toc-items-indentation-style', 'document-lines-min', 'l', 'loglevel' ],
      unknown: function(a) { return (a[0] == '-' ? (console.error('Unknown option(s): ' + a), printUsageAndExit(true)) : true); }
    });

var logLevel = argv.l || argv.loglevel || "info";

try {
  log.setLevel(logLevel, false);
}
catch (e) {
  console.error('Unknown log level: ' + logLevel);
  console.error('Supported options: trace, debug, info, warn, error');
  process.exitCode = 2;
  return;
}

if (argv.h || argv.help) {
  log.setLevel("info");
  printUsageAndExit();
}

if (argv['syntax'] !== undefined && !supportedSyntaxes.includes(argv['syntax'])) {
  log.error('Unknown syntax:', argv['syntax']);
  log.error('Supported options:', supportedSyntaxes.join(", "));
  process.exit(2);
  return;
}
for (var key in modes) {
  if (argv[key]) {
    mode = modes[key];
  }
}

var stdOut = argv.s || argv.stdout || false;
var updateOnly = argv.u || argv['update-only'];
var syntax = argv['syntax'] || 'md';
var dryRun = argv.d || argv.dryrun || false;

var options = {
  document: {
    lines: {
      min: argv['document-lines-min'],
    }
  },
  heading: {
    level: {
      max: argv.m || argv.maxlevel
      min: argv.minlevel
    }
  },
  toc: {
    pragma: {
      style: argv['toc-pragma-style'],
    },
    header: {
      content: argv['toc-header-content'],
    },
    items: {
      indentation:{
        width: argv['toc-items-indentation-width'],
        style: argv['toc-items-indentation-style'],
      },
      min: argv.mintocitems,
      source: argv.all ? 'all' : 'after',
      symbols: argv.entryprefix?.trim().replaceAll(' ', '')?.split(',')
    },
    location: argv['toc-location'],
    title: {
      content: argv.t || argv.title,
      padding: {
        before: argv['toc-title-padding-before'],
      },
      remove: argv.T || argv.notitle
    },
    footer: {
      content: argv['toc-footer-content'],
    }
  }
}

if (argv._.length > 1 && stdOut) {
  console.error('--stdout cannot be used to process multiple files/directories. Use --dryrun instead.');
  process.exitCode = 2;
  return;
}

for (var i = 0; i < argv._.length; i++) {
  var target = cleanPath(argv._[i]),
    stat = fs.statSync(target);

  if (stat.isDirectory() && stdOut) {
    console.error('--stdout cannot be used to process a directory. Use --dryrun instead.');
    process.exitCode = 2;
    return;
  }

  if (stat.isDirectory()) {
    log.debug('\nDocToccing "%s" and its sub directories for %s.', target, mode);
    files = file.findMarkdownFiles(target, syntax);
  } else {
    log.debug('\nDocToccing single file "%s" for %s.', target, mode);
    files = [{ path: target }];
  }

  transformAndSave(files, mode, stdOut, updateOnly, syntax, dryRun, options);

  if (dryRun && process.exitCode === 1) {
    log.warn('\nDocumentation tables of contents are out of date.');
  }
  else {
    log.info('\nEverything is OK.');
  }
}

module.exports.transform = transform;
