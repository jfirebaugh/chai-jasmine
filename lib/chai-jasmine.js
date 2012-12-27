module.exports = function (chai, utils) {
  var Assertion = chai.Assertion,
    flag = utils.flag

  Assertion.addMethod("toEqual", function (expected) {
    return this.eql(expected);
  });

  Assertion.addMethod("toNotEqual", function (expected) {
    return this.not.eql(expected);
  });

  Assertion.addMethod("toBe", function (expected) {
    return this.equal(expected);
  });

  Assertion.addMethod("toNotBe", function (expected) {
    return this.not.equal(expected);
  });

  Assertion.addMethod("toMatch", function (expected) {
    return this.match(new RegExp(expected));
  });

  Assertion.addMethod("toNotMatch", function (expected) {
    return this.not.match(new RegExp(expected));
  });

  Assertion.addMethod("toBeDefined", function () {
    return this.not.undefined;
  });

  Assertion.addMethod("toBeUndefined", function () {
    return this.undefined;
  });

  Assertion.addMethod("toBeNull", function () {
    return this.null;
  });

  Assertion.addMethod("toBeFalsy", function () {
    return this.not.ok;
  });

  Assertion.addMethod("toBeTruthy", function () {
    return this.ok;
  });

  Assertion.addMethod("toContain", function (expected) {
    return this.deep.contain(expected);
  });

  Assertion.addMethod("toNotContain", function (expected) {
    return this.not.contain(expected);
  });

  Assertion.addMethod("toBeLessThan", function (expected) {
    return this.lessThan(expected);
  });

  Assertion.addMethod("toBeGreaterThan", function (expected) {
    return this.greaterThan(expected);
  });

  Assertion.addMethod("toBeCloseTo", function (expected, precision) {
    return this.closeTo(expected, precision);
  });

  Assertion.addMethod("toThrow", function (expected) {
    return this.throw(expected);
  });
};

module.exports.any = require('./any');
