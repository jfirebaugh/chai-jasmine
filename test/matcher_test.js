var chai  = require('chai'),
  jasmine = require('..');

chai.use(jasmine);

var expect = chai.expect;

chai.use(function (chai, utils) {
  var inspect = utils.inspect;

  chai.Assertion.addMethod('fail', function (message) {
    var obj = utils.flag(this, 'object');

    new chai.Assertion(obj).is.a('function');

    try {
      obj();
    } catch (err) {
      this.assert(
          err instanceof chai.AssertionError
        , 'expected #{this} to fail, but it threw ' + inspect(err));

      if (message instanceof RegExp) {
        this.assert(
            message.exec(err.message)
          , 'expected #{this} to fail with ' + inspect(message) + ', but got ' + inspect(err.message));
      } else if (message) {
        this.assert(
            err.message === message
          , 'expected #{this} to fail with ' + inspect(message) + ', but got ' + inspect(err.message));
      }

      return;
    }

    this.assert(false, 'expected #{this} to fail');
  });
});

describe("to[Not]Equal", function () {
  it("works like Jasmine", function () {
    expect(true).toEqual(true);
    expect(function () { expect({foo:'bar'}).toEqual(null) }).to.fail();

    var functionA = function() {
      return 'hi';
    };
    var functionB = function() {
      return 'hi';
    };
    expect(function () { expect({foo:functionA}).toEqual({foo:functionB}) }).to.fail();
    expect({foo:functionA}).toEqual({foo:functionA});

    expect(function () { expect(false).toEqual(true) }).to.fail();

    var circularGraph = {};
    circularGraph.referenceToSelf = circularGraph;
    expect(circularGraph).toEqual(circularGraph);

    expect(function () { expect(new Date(2008, 1, 3, 15, 17, 19, 1234)).toEqual(new Date(2009, 1, 3, 15, 17, 19, 1234)) }).to.fail();
    expect(new Date(2008, 1, 3, 15, 17, 19, 1234)).toEqual(new Date(2008, 1, 3, 15, 17, 19, 1234));

    expect(true).toNotEqual(false);
    expect(function () { expect(true).toNotEqual(true) }).to.fail();

    expect(function () { expect(['a', 'b']).toEqual(['a', jasmine.undefined]) }).to.fail();
    expect(function () { expect(['a', 'b']).toEqual(['a', 'b', jasmine.undefined]) }).to.fail();

    expect("cat").toEqual("cat");
    expect(function () { expect("cat").toNotEqual("cat") }).to.fail();

    expect(5).toEqual(5);
    expect(parseInt('5', 10)).toEqual(5);
    expect(function () { expect(5).toNotEqual(5) }).to.fail();
    expect(function () { expect(parseInt('5', 10)).toNotEqual(5) }).to.fail();

    expect(jasmine.undefined).toEqual(jasmine.undefined);
    expect({foo:'bar'}).toEqual({foo:'bar'});
    expect(function () { expect("foo").toEqual({bar: jasmine.undefined}) }).to.fail();
    expect(function () { expect({foo: jasmine.undefined}).toEqual("goo") }).to.fail();
    expect(function () { expect({foo: {bar :jasmine.undefined}}).toEqual("goo") }).to.fail();

    expect({foo: "bar", baz: jasmine.undefined}).toEqual({foo: "bar", baz: jasmine.undefined});
    expect({foo:['bar','baz','quux']}).toEqual({foo:['bar','baz','quux']});
    expect({foo: {bar:'baz'}, quux:'corge'}).toEqual({foo:{bar:'baz'}, quux:'corge'});
  });

  it("works with jasmine.any()", function() {
    expect("foo").toEqual(jasmine.any(String));
    expect(3).toEqual(jasmine.any(Number));
    expect(function () { expect("foo").toEqual(jasmine.any(Function)) }).to.fail();
    expect(function () { expect("foo").toEqual(jasmine.any(Object)) }).to.fail();
    expect({someObj:'foo'}).toEqual(jasmine.any(Object));
    expect(function () { expect({someObj:'foo'}).toEqual(jasmine.any(Function)) }).to.fail();
    expect(function () { expect(function(){}).toEqual(jasmine.any(Object)) }).to.fail();
    expect(["foo", "goo"]).toEqual(["foo", jasmine.any(String)]);
    expect(function() {}).toEqual(jasmine.any(Function));
    expect(["a", function() {}]).toEqual(["a", jasmine.any(Function)]);
  });

//  describe("with an object implementing jasmineMatches", function () {
//    var matcher;
//    beforeEach(function () {
//      matcher = {
//        jasmineMatches: jasmine.createSpy("jasmineMatches")
//      };
//    });
//
//    describe("on the left side", function () {
//      it("uses the jasmineMatches function", function () {
//        matcher.jasmineMatches.andReturn(false);
//        expect(function () { expect(matcher).toEqual("foo") }).to.fail();
//        matcher.jasmineMatches.andReturn(true);
//        expect(matcher).toEqual("foo");
//      });
//    });
//
//    describe("on the right side", function () {
//      it("uses the jasmineMatches function", function () {
//        matcher.jasmineMatches.andReturn(false);
//        expect(function () { expect("foo").toEqual(matcher) }).to.fail();
//        matcher.jasmineMatches.andReturn(true);
//        expect("foo").toEqual(matcher);
//      });
//    });
//  });

  it("handles circular objects ok", function() {
    var circularObject = {};
    var secondCircularObject = {};
    circularObject.field = circularObject;
    secondCircularObject.field = secondCircularObject;
    expect(circularObject).to.eql(secondCircularObject);
  });

  it("has a slightly surprising behavior, but is it intentional?", function() {
    expect({x:"x", y:"y", z:"w"}).toNotEqual({x:"x", y:"y", z:"z"});
    expect({x:"x", y:"y", w:"z"}).toNotEqual({x:"x", y:"y", z:"z"});
    expect({x:"x", y:"y", z:"z"}).toNotEqual({w: "w", x:"x", y:"y", z:"z"});
    expect({w: "w", x:"x", y:"y", z:"z"}).toNotEqual({x:"x", y:"y", z:"z"});
  });

  it("handles arrays", function() {
    expect([1, "A"]).toEqual([1, "A"]);
  });
});

describe("to[Not]Be", function () {
  it("works like Jasmine", function () {
    var a = {};
    var b = {};
    var c = a;
    expect(function () { expect(a).toBe(b) }).to.fail();
    expect(a).toBe(a);
    expect(a).toBe(c);
    expect(a).toNotBe(b);
    expect(function () { expect(a).toNotBe(a) }).to.fail();
    expect(function () { expect(a).toNotBe(c) }).to.fail();
  });
});

describe("to[Not]Match", function () {
  it("works like Jasmine", function () {
    expect('foobarbel').toMatch(/bar/);
    expect(function () { expect('foobazbel').toMatch(/bar/) }).to.fail();

    expect('foobarbel').toMatch("bar");
    expect(function () { expect('foobazbel').toMatch("bar") }).to.fail();

    expect(function () { expect('foobarbel').toNotMatch(/bar/) }).to.fail();
    expect('foobazbel').toNotMatch(/bar/);

    expect(function () { expect('foobarbel').toNotMatch("bar") }).to.fail();
    expect('foobazbel').toNotMatch("bar");
  });
});

describe("toBeDefined", function () {
  it("works like Jasmine", function () {
    expect('foo').toBeDefined();
    expect(function () { expect(jasmine.undefined).toBeDefined() }).to.fail();
  });
});

describe("toBeUndefined", function () {
  it("works like Jasmine", function () {
    expect(function () { expect('foo').toBeUndefined() }).to.fail();
    expect(jasmine.undefined).toBeUndefined();
  });
});

describe("toBeNull", function () {
  it("works like Jasmine", function () {
    expect(null).toBeNull();
    expect(function () { expect(jasmine.undefined).toBeNull() }).to.fail();
    expect(function () { expect("foo").toBeNull() }).to.fail();
  });
});

describe("toBeFalsy", function () {
  it("works like Jasmine", function () {
    expect(false).toBeFalsy();
    expect(function () { expect(true).toBeFalsy() }).to.fail();
    expect(jasmine.undefined).toBeFalsy();
    expect(0).toBeFalsy();
    expect("").toBeFalsy();
  });
});

describe("toBeTruthy", function () {
  it("works like Jasmine", function () {
    expect(function () { expect(false).toBeTruthy() }).to.fail();
    expect(true).toBeTruthy();
    expect(function () { expect(jasmine.undefined).toBeTruthy() }).to.fail();
    expect(function () { expect(0).toBeTruthy() }).to.fail();
    expect(function () { expect("").toBeTruthy() }).to.fail();
    expect("hi").toBeTruthy();
    expect(5).toBeTruthy();
    expect({foo: 1}).toBeTruthy();
  });
});

describe("to[Not]Contain", function () {
  it("works like Jasmine", function () {
    expect('ABC').toContain('A');
    expect(function () { expect('ABC').toContain('X') }).to.fail();
  
    expect(['A', 'B', 'C']).toContain('A');
    expect(function () { expect(['A', 'B', 'C']).toContain('F') }).to.fail();
    expect(['A', 'B', 'C']).toNotContain('F');
    expect(function () { expect(['A', 'B', 'C']).toNotContain('A') }).to.fail();
  
    expect(['A', {some:'object'}, 'C']).toContain({some:'object'});
    expect(function () { expect(['A', {some:'object'}, 'C']).toContain({some:'other object'}) }).to.fail();
  });
});

describe("toBeLessThan", function () {
  it("works like Jasmine", function () {
    expect(37).toBeLessThan(42);
    expect(function () { expect(37).toBeLessThan(-42) }).to.fail();
    expect(function () { expect(37).toBeLessThan(37) }).to.fail();
  });
});

describe("toBeGreaterThan", function () {
  it("works like Jasmine", function () {
    expect(function () { expect(37).toBeGreaterThan(42) }).to.fail();
    expect(37).toBeGreaterThan(-42);
    expect(function () { expect(37).toBeGreaterThan(37) }).to.fail();
  });
});

describe("toBeCloseTo", function () {
  it("returns 'true' iff actual and expected are equal within 2 decimal points of precision", function() {
    expect(0).toBeCloseTo(0);
    expect(1).toBeCloseTo(1);
    expect(1).not.toBeCloseTo(1.1);
    expect(1).not.toBeCloseTo(1.01);
    expect(1).toBeCloseTo(1.001);

    expect(1.23).toBeCloseTo(1.234);
    expect(1.23).toBeCloseTo(1.233);
    expect(1.23).toBeCloseTo(1.232);
    expect(1.23).not.toBeCloseTo(1.24);

    expect(-1.23).toBeCloseTo(-1.234);
    expect(-1.23).not.toBeCloseTo(-1.24);
  });

  it("expects close numbers to 'be close' and further numbers not to", function() {
    expect(1.225).not.toBeCloseTo(1.234); // difference is 0.009
    expect(1.225).toBeCloseTo(1.224);     // difference is 0.001
  });

  it("accepts an optional precision argument", function() {
    expect(1).toBeCloseTo(1.1, 0);
    expect(1.2).toBeCloseTo(1.23, 1);

    expect(1.234).toBeCloseTo(1.2343, 3);
    expect(1.234).not.toBeCloseTo(1.233, 3);
  });

  it("rounds", function() {
    expect(1.23).toBeCloseTo(1.229);
    expect(1.23).toBeCloseTo(1.226);
    expect(1.23).toBeCloseTo(1.225);
    expect(1.23).not.toBeCloseTo(1.2249999);

    expect(1.23).toBeCloseTo(1.234);
    expect(1.23).toBeCloseTo(1.2349999);
    expect(1.23).not.toBeCloseTo(1.235);

    expect(-1.23).toBeCloseTo(-1.234);
    expect(-1.23).not.toBeCloseTo(-1.235);
    expect(-1.23).not.toBeCloseTo(-1.236);
  });
});

describe("toThrow", function () {
  describe("when code block throws an exception", function() {
    var throwingFn;

    beforeEach(function() {
      throwingFn = function() {
        throw new Error("Fake Error");
      };
    });

    it("should match any exception", function() {
      expect(throwingFn).toThrow();
    });

    it("should match exceptions specified by message", function() {
      expect(throwingFn).toThrow("Fake Error");
      expect(function () { expect(throwingFn).toThrow("Other Error") }).to.fail(/Other Error/);
    });

    it("should match exceptions specified by Error", function() {
      expect(throwingFn).toThrow(new Error("Fake Error"));
      expect(function () { expect(throwingFn).toThrow(new Error("Other Error")) }).to.fail(/Other Error/);
    });

    describe("and matcher is inverted with .not", function() {
      it("should match any exception", function() {
        expect(function () { expect(throwingFn).not.toThrow() }).to.fail();
      });

      it("should match exceptions specified by message", function() {
        expect(function () { expect(throwingFn).not.toThrow("Fake Error") }).to.fail(/Other Error/);
      });

      it("should match exceptions specified by Error", function() {
        expect(function () { expect(throwingFn).not.toThrow(new Error("Fake Error")) }).to.fail(/Other Error/);
      });
    });
  });

  describe("when actual is not a function", function() {
    it("should fail with an exception", function() {
      expect(function () {
        expect('not-a-function').toThrow();
      }).to.throw('expected \'not-a-function\' to be a function');
    });

    describe("and matcher is inverted with .not", function() {
      it("should fail with an exception", function() {
        expect(function() {
          expect('not-a-function').not.toThrow();
        }).to.throw('expected \'not-a-function\' to be a function');
      });
    });
  });

  describe("when code block does not throw an exception", function() {
    it("should fail", function() {
      expect(function () {
        expect(function() {}).toThrow();
      }).to.fail();
    });
  });
});