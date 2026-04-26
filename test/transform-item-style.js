'use strict';
/*jshint asi: true */

var test = require('tap').test,
  transform = require('../lib/transform');

test('transforming', function (t) {
  var md = [ 
      '# My Module',
      'Some text here',
      '## API',
      '### Method One',
      'works like this',
      '### Method Two',
      '#### Main Usage',
      'some main usage here',
    ].join('\n');
  var contents = [
      '**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*',
      '',
      '- [My Module](#my-module)',
      '  * [API](#api)',
      '    + [Method One](#method-one)',
      '    + [Method Two](#method-two)',
      '      - [Main Usage](#main-usage)',
    ].join('\n');

  var res = transform(md,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  , '-,*,+' // pass a collection as the prefix for toc entries
  );

  t.ok(res.transformed, 'transforms it');
  t.same(res.toc, contents, 'generates correct toc contents');
});
