'use strict';
var Personnage = require('../public/javascripts/core/Personnage.js');
var p = new Personnage('Tommy', 100, 100, 'fire');
/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports['Perso'] = {
    'Perso': function (test) {
        console.log(p);
        test.ok(p.name(), 'Tommy');
        test.ok(p.life(), 100);
        test.ok(p.armor(), 100);
        test.ok(p.type(), 'fire');
        test.done();
    },
};
