import assert from "assert";
import * as Module from "@/lib/queryParser";

// NOTE: These tests were taken from https://github.com/bripkens/lucene/blob/master/test/queryParser_test.js.
// Some were removed, others added to fit the changes made to the PEG grammar.

describe("queryParser", () => {
  describe("whitespace handling", () => {
    it("handles empty strings", () => {
      expect(() => Module.parseQueryString("")).toThrow();
    });

    it("handles leading whitespaces with no content", () => {
      expect(() => Module.parseQueryString(" \r\n")).toThrow();
    });

    it("handles leading whitespace before an expression string", () => {
      const ast = Module.parseQueryString(" Test:Foo");

      assert("term" in ast.left);
      expect(ast.left.field).toBe("Test");
      expect(ast.left.term).toBe("Foo");
    });

    it("handles whitespace between colon and term", () => {
      const ast = Module.parseQueryString("foo: bar");

      assert("term" in ast.left);
      expect(ast.left.field).toBe("foo");
      expect(ast.left.term).toBe("bar");
    });

    it("handles multiple whitespaces between NOT and AND/OR when used together", () => {
      const ast = Module.parseQueryString("title:foo AND   NOT   abstract:bar");

      assert("operator" in ast && "term" in ast.left && "term" in ast.right);
      expect(ast.left.field).toBe("title");
      expect(ast.left.term).toBe("foo");
      expect(ast.operator).toBe("AND");
      expect(ast.right.prefix).toBe("NOT");
      expect(ast.right.field).toBe("abstract");
      expect(ast.right.term).toBe("bar");
    });
  });

  describe("term parsing", () => {
    it("parses terms", () => {
      const ast = Module.parseQueryString("bar");

      assert("term" in ast.left);
      expect(ast.left.term).toBe("bar");
      expect(ast.left.quoted).toBe(false);
      expect(ast.left.regex).toBe(false);
    });

    it("parses quoted terms", () => {
      const ast = Module.parseQueryString('"fizz buzz"');

      assert("term" in ast.left);
      expect(ast.left.term).toBe("fizz buzz");
      expect(ast.left.quoted).toBe(true);
      expect(ast.left.regex).toBe(false);
    });

    it("parses regex terms", () => {
      const ast = Module.parseQueryString("/f[A-z]?o*/");

      assert("term" in ast.left);
      expect(ast.left.term).toBe("f[A-z]?o*");
      expect(ast.left.quoted).toBe(false);
      expect(ast.left.regex).toBe(true);
    });

    it("parses regex terms with escape sequences", () => {
      const ast = Module.parseQueryString("/f[A-z]?\\/o*/");

      assert("term" in ast.left);
      expect(ast.left.term).toBe("f[A-z]?\\/o*");
      expect(ast.left.quoted).toBe(false);
      expect(ast.left.regex).toBe(true);
    });

    it("accepts terms with '-'", () => {
      const ast = Module.parseQueryString("created_at:>now-5d");

      assert("term" in ast.left);
      expect(ast.left.term).toBe(">now-5d");
    });

    it("accepts terms with '+'", () => {
      const ast = Module.parseQueryString("published_at:>now+5d");

      assert("term" in ast.left);
      expect(ast.left.term).toBe(">now+5d");
    });
  });

  describe("prefix operators", () => {
    it("parses prefix operators (-)", () => {
      const ast = Module.parseQueryString("-bar");

      assert("term" in ast.left);
      expect(ast.left.term).toBe("bar");
      expect(ast.left.prefix).toBe("-");
    });

    it("parses prefix operator (!)", () => {
      const ast = Module.parseQueryString("!bar");

      assert("term" in ast.left);
      expect(ast.left.term).toBe("bar");
      expect(ast.left.prefix).toBe("!");
    });

    it("parses prefix operator (NOT)", () => {
      const ast = Module.parseQueryString("NOT bar");

      assert("term" in ast.left);
      expect(ast.left.term).toBe("bar");
      expect(ast.left.prefix).toBe("NOT");
    });

    it("parses prefix operator (+)", () => {
      const ast = Module.parseQueryString("+bar");

      assert("term" in ast.left);
      expect(ast.left.term).toBe("bar");
      expect(ast.left.prefix).toBe("+");
    });

    it("parses prefix operator on quoted term (-)", () => {
      const ast = Module.parseQueryString('-"fizz buzz"');

      assert("term" in ast.left);
      expect(ast.left.term).toBe("fizz buzz");
      expect(ast.left.prefix).toBe("-");
    });

    it("parses prefix operator on quoted term (NOT)", () => {
      const ast = Module.parseQueryString('NOT "fizz buzz"');

      assert("term" in ast.left);
      expect(ast.left.term).toBe("fizz buzz");
      expect(ast.left.prefix).toBe("NOT");
    });

    it("parses prefix operator on quoted term (!)", () => {
      const ast = Module.parseQueryString('!"fizz buzz"');

      assert("term" in ast.left);
      expect(ast.left.term).toBe("fizz buzz");
      expect(ast.left.prefix).toBe("!");
    });

    it("parses prefix operator on quoted term (+)", () => {
      const ast = Module.parseQueryString('+"fizz buzz"');

      assert("term" in ast.left);
      expect(ast.left.term).toBe("fizz buzz");
      expect(ast.left.prefix).toBe("+");
    });

    it("parses prefix operator on parenthesized term (-)", () => {
      const ast = Module.parseQueryString("-(fizz buzz)");
      const leftNode = ast.left;

      assert(
        "left" in leftNode &&
          "prefix" in leftNode &&
          "term" in leftNode.left &&
          "right" in leftNode &&
          "term" in leftNode.right,
      );
      expect(leftNode.prefix).toBe("-");
      expect(leftNode.parenthesized).toBe(true);
      expect(leftNode.left.term).toBe("fizz");
      expect(leftNode.operator).toBe("<implicit>");
      expect(leftNode.right.term).toBe("buzz");
    });

    it("parses prefix operator on parenthesized term (NOT)", () => {
      const ast = Module.parseQueryString("NOT (fizz buzz)");
      const leftNode = ast.left;

      assert(
        "left" in leftNode &&
          "prefix" in leftNode &&
          "term" in leftNode.left &&
          "right" in leftNode &&
          "term" in leftNode.right,
      );
      expect(leftNode.prefix).toBe("NOT");
      expect(leftNode.parenthesized).toBe(true);
      expect(leftNode.left.term).toBe("fizz");
      expect(leftNode.operator).toBe("<implicit>");
      expect(leftNode.right.term).toBe("buzz");
    });

    it("parses prefix operator on parenthesized term (!)", () => {
      const ast = Module.parseQueryString("!(fizz buzz)");
      const leftNode = ast.left;

      assert(
        "left" in leftNode &&
          "prefix" in leftNode &&
          "term" in leftNode.left &&
          "right" in leftNode &&
          "term" in leftNode.right,
      );
      expect(leftNode.prefix).toBe("!");
      expect(leftNode.parenthesized).toBe(true);
      expect(leftNode.left.term).toBe("fizz");
      expect(leftNode.operator).toBe("<implicit>");
      expect(leftNode.right.term).toBe("buzz");
    });

    it("parses prefix operator on parenthesized term (+)", () => {
      const ast = Module.parseQueryString("+(fizz buzz)");
      const leftNode = ast.left;

      assert(
        "left" in leftNode &&
          "prefix" in leftNode &&
          "term" in leftNode.left &&
          "right" in leftNode &&
          "term" in leftNode.right,
      );
      expect(leftNode.prefix).toBe("+");
      expect(leftNode.parenthesized).toBe(true);
      expect(leftNode.left.term).toBe("fizz");
      expect(leftNode.operator).toBe("<implicit>");
      expect(leftNode.right.term).toBe("buzz");
    });
  });

  describe("field name support", () => {
    it("parses implicit field name for term", () => {
      const ast = Module.parseQueryString("bar");

      assert("term" in ast.left);
      expect(ast.left.field).toBe("<implicit>");
      expect(ast.left.term).toBe("bar");
    });

    it("parses implicit field name for quoted term", () => {
      const ast = Module.parseQueryString('"fizz buzz"');

      assert("term" in ast.left);
      expect(ast.left.field).toBe("<implicit>");
      expect(ast.left.term).toBe("fizz buzz");
    });

    it("parses explicit field name for term", () => {
      const ast = Module.parseQueryString("foo:bar");

      assert("term" in ast.left);
      expect(ast.left.field).toBe("foo");
      expect(ast.left.term).toBe("bar");
    });

    it("parses explicit field name for date term", () => {
      const ast = Module.parseQueryString("foo:2015-01-01");

      assert("term" in ast.left);
      expect(ast.left.field).toBe("foo");
      expect(ast.left.term).toBe("2015-01-01");
    });

    it("parses explicit field name including dots (e.g 'sub.field') for term", () => {
      const ast = Module.parseQueryString("sub.foo:bar");

      assert("term" in ast.left);
      expect(ast.left.field).toBe("sub.foo");
      expect(ast.left.term).toBe("bar");
    });

    it("parses explicit field name for quoted term", () => {
      const ast = Module.parseQueryString('foo:"fizz buzz"');

      assert("term" in ast.left);
      expect(ast.left.field).toBe("foo");
      expect(ast.left.term).toBe("fizz buzz");
    });

    it("parses explicit field name with prefix", () => {
      let ast = Module.parseQueryString("-foo:bar");

      assert("term" in ast.left);
      expect(ast.left.field).toBe("foo");
      expect(ast.left.term).toBe("bar");
      expect(ast.left.prefix).toBe("-");

      ast = Module.parseQueryString("+foo:bar");

      assert("term" in ast.left);
      expect(ast.left.field).toBe("foo");
      expect(ast.left.term).toBe("bar");
      expect(ast.left.prefix).toBe("+");
    });

    it("prevents explicit field name from being a conjunction operator", () => {
      expect(() => Module.parseQueryString("AND:foo")).toThrow();
    });
  });

  describe("conjunction operators", () => {
    it("parses implicit conjunction operator (OR)", () => {
      const ast = Module.parseQueryString("fizz buzz");

      assert("operator" in ast && "term" in ast.left && "term" in ast.right);
      expect(ast.left.term).toBe("fizz");
      expect(ast.operator).toBe("<implicit>");
      expect(ast.right.term).toBe("buzz");
    });

    it("parses explicit conjunction operator (AND)", () => {
      const ast = Module.parseQueryString("fizz AND buzz");

      assert("operator" in ast && "term" in ast.left && "term" in ast.right);
      expect(ast.left.term).toBe("fizz");
      expect(ast.operator).toBe("AND");
      expect(ast.right.term).toBe("buzz");
    });

    it("parses explicit conjunction operator (OR)", () => {
      const ast = Module.parseQueryString("fizz OR buzz");

      assert("operator" in ast && "term" in ast.left && "term" in ast.right);
      expect(ast.left.term).toBe("fizz");
      expect(ast.operator).toBe("OR");
      expect(ast.right.term).toBe("buzz");
    });

    it("parses explicit conjunction operator (NOT)", () => {
      const ast = Module.parseQueryString("fizz NOT buzz");

      assert("operator" in ast && "term" in ast.left && "term" in ast.right);
      expect(ast.left.term).toBe("fizz");
      expect(ast.right.prefix).toBe("NOT");
      expect(ast.right.term).toBe("buzz");
    });

    it("parses explicit conjunction operator (&&)", () => {
      const ast = Module.parseQueryString("fizz && buzz");

      assert("operator" in ast && "term" in ast.left && "term" in ast.right);
      expect(ast.left.term).toBe("fizz");
      expect(ast.operator).toBe("&&");
      expect(ast.right.term).toBe("buzz");
    });

    it("parses explicit conjunction operator (||)", () => {
      const ast = Module.parseQueryString("fizz || buzz");

      assert("operator" in ast && "term" in ast.left && "term" in ast.right);
      expect(ast.left.term).toBe("fizz");
      expect(ast.operator).toBe("||");
      expect(ast.right.term).toBe("buzz");
    });

    it("throws an error when using a conjunction operator alone", () => {
      expect(() => Module.parseQueryString("AND")).toThrow();
    });
  });

  describe("parentheses groups", () => {
    it("parses parentheses group", () => {
      const ast = Module.parseQueryString("fizz (buzz baz)");

      assert("operator" in ast && "term" in ast.left);
      expect(ast.left.term).toBe("fizz");
      expect(ast.operator).toBe("<implicit>");
      expect(ast.parenthesized).toBe(undefined);

      const rightNode = ast.right;

      assert(
        "operator" in rightNode &&
          "term" in rightNode.left &&
          "term" in rightNode.right,
      );
      expect(rightNode.left.term).toBe("buzz");
      expect(rightNode.operator).toBe("<implicit>");
      expect(rightNode.parenthesized).toBe(true);
      expect(rightNode.right.term).toBe("baz");
    });

    it("parses parentheses groups with explicit conjunction operators ", () => {
      const ast = Module.parseQueryString("fizz AND (buzz OR baz)");

      assert("operator" in ast && "term" in ast.left);
      expect(ast.left.term).toBe("fizz");
      expect(ast.operator).toBe("AND");

      const rightNode = ast.right;

      assert(
        "operator" in rightNode &&
          "term" in rightNode.left &&
          "term" in rightNode.right,
      );
      expect(rightNode.left.term).toBe("buzz");
      expect(rightNode.operator).toBe("OR");
      expect(rightNode.right.term).toBe("baz");
    });
  });

  describe("range expressions", () => {
    it("parses inclusive range expression", () => {
      const ast = Module.parseQueryString("foo:[bar TO baz]");

      assert("term_min" in ast.left);
      expect(ast.left.field).toBe("foo");
      expect(ast.left.term_min).toBe("bar");
      expect(ast.left.term_max).toBe("baz");
      expect(ast.left.inclusive).toBe("both");
    });

    it("parses exclusive range expression", () => {
      const ast = Module.parseQueryString("foo:{bar TO baz}");

      assert("term_min" in ast.left);
      expect(ast.left.field).toBe("foo");
      expect(ast.left.term_min).toBe("bar");
      expect(ast.left.term_max).toBe("baz");
      expect(ast.left.inclusive).toBe("none");
    });

    it("parses mixed range expression (left inclusive)", () => {
      const ast = Module.parseQueryString("foo:[bar TO baz}");

      assert("term_min" in ast.left);
      expect(ast.left.field).toBe("foo");
      expect(ast.left.term_min).toBe("bar");
      expect(ast.left.term_max).toBe("baz");
      expect(ast.left.inclusive).toBe("left");
    });

    it("parses mixed range expression (right inclusive)", () => {
      const ast = Module.parseQueryString("foo:{bar TO baz]");

      assert("term_min" in ast.left);
      expect(ast.left.field).toBe("foo");
      expect(ast.left.term_min).toBe("bar");
      expect(ast.left.term_max).toBe("baz");
      expect(ast.left.inclusive).toBe("right");
    });

    it("parses mixed range expression (right inclusive) with date ISO format", () => {
      const ast = Module.parseQueryString(
        "date:{2017-11-17T01:32:45.123Z TO 2017-11-18T04:28:11.999Z]",
      );

      assert("term_min" in ast.left);
      expect(ast.left.field).toBe("date");
      expect(ast.left.term_min).toBe("2017-11-17T01:32:45.123Z");
      expect(ast.left.term_max).toBe("2017-11-18T04:28:11.999Z");
      expect(ast.left.inclusive).toBe("right");
    });
  });

  describe("Lucene Query syntax documentation examples", () => {
    /*
        Examples from Lucene documentation at

        http://lucene.apache.org/java/2_9_4/queryparsersyntax.html

        title:"The Right Way" AND text:go
        title:"Do it right" AND right
        title:Do it right

        te?t
        test*
        te*t

        roam~
        roam~0.8

        "jakarta apache"~10
        mod_date:[20020101 TO 20030101]
        title:{Aida TO Carmen}

        jakarta apache
        jakarta^4 apache
        "jakarta apache"^4 "Apache Lucene"
        "jakarta apache" jakarta
        "jakarta apache" OR jakarta
        "jakarta apache" AND "Apache Lucene"
        +jakarta lucene
        "jakarta apache" NOT "Apache Lucene"
        NOT "jakarta apache"
        "jakarta apache" -"Apache Lucene"
        (jakarta OR apache) AND website
        title:(+return +"pink panther")
    */

    it('parses example: title:"The Right Way" AND text:go', () => {
      const ast = Module.parseQueryString('title:"The Right Way" AND text:go');

      assert("operator" in ast && "term" in ast.left && "term" in ast.right);
      expect(ast.left.field).toBe("title");
      expect(ast.left.term).toBe("The Right Way");
      expect(ast.operator).toBe("AND");
      expect(ast.right.field).toBe("text");
      expect(ast.right.term).toBe("go");
    });

    it('parses example: title:"Do it right" AND right', () => {
      const ast = Module.parseQueryString('title:"Do it right" AND right');

      assert("operator" in ast && "term" in ast.left && "term" in ast.right);
      expect(ast.left.field).toBe("title");
      expect(ast.left.term).toBe("Do it right");
      expect(ast.operator).toBe("AND");
      expect(ast.right.field).toBe("<implicit>");
      expect(ast.right.term).toBe("right");
    });

    it("parses example: title:Do it right", () => {
      const ast = Module.parseQueryString("title:Do it right");

      assert("operator" in ast && "term" in ast.left);
      expect(ast.left.field).toBe("title");
      expect(ast.left.term).toBe("Do");
      expect(ast.operator).toBe("<implicit>");

      const rightNode = ast.right;

      assert(
        "operator" in rightNode &&
          "term" in rightNode.left &&
          "term" in rightNode.right,
      );
      expect(rightNode.left.field).toBe("<implicit>");
      expect(rightNode.left.term).toBe("it");
      expect(rightNode.operator).toBe("<implicit>");
      expect(rightNode.right.field).toBe("<implicit>");
      expect(rightNode.right.term).toBe("right");
    });

    it("parses example: te?t", () => {
      const ast = Module.parseQueryString("te?t");

      assert("term" in ast.left);
      expect(ast.left.field).toBe("<implicit>");
      expect(ast.left.term).toBe("te?t");
    });

    it("parses example: test*", () => {
      const ast = Module.parseQueryString("test*");

      assert("term" in ast.left);
      expect(ast.left.field).toBe("<implicit>");
      expect(ast.left.term).toBe("test*");
    });

    it("parses example: te*t", () => {
      const ast = Module.parseQueryString("te*t");

      assert("term" in ast.left);
      expect(ast.left.field).toBe("<implicit>");
      expect(ast.left.term).toBe("te*t");
    });

    it("parses example: roam~", () => {
      const ast = Module.parseQueryString("roam~");

      assert("term" in ast.left);
      expect(ast.left.field).toBe("<implicit>");
      expect(ast.left.term).toBe("roam");
      expect(ast.left.similarity).toBe(0.5);
    });

    it("parses example: roam~0.8", () => {
      const ast = Module.parseQueryString("roam~0.8");

      assert("term" in ast.left);
      expect(ast.left.field).toBe("<implicit>");
      expect(ast.left.term).toBe("roam");
      expect(ast.left.similarity).toBe(0.8);
    });

    it('parses example: "jakarta apache"~10', () => {
      const ast = Module.parseQueryString('"jakarta apache"~10');

      assert("term" in ast.left && "proximity" in ast.left);
      expect(ast.left.field).toBe("<implicit>");
      expect(ast.left.term).toBe("jakarta apache");
      expect(ast.left.proximity).toBe(10);
    });

    it("parses example: mod_date:[20020101 TO 20030101]", () => {
      const ast = Module.parseQueryString("mod_date:[20020101 TO 20030101]");

      assert("term_min" in ast.left);
      expect(ast.left.field).toBe("mod_date");
      expect(ast.left.term_min).toBe("20020101");
      expect(ast.left.term_max).toBe("20030101");
      expect(ast.left.inclusive).toBe("both");
    });

    it("parses example: title:{Aida TO Carmen}", () => {
      const ast = Module.parseQueryString("title:{Aida TO Carmen}");

      assert("term_min" in ast.left);
      expect(ast.left.field).toBe("title");
      expect(ast.left.term_min).toBe("Aida");
      expect(ast.left.term_max).toBe("Carmen");
      expect(ast.left.inclusive).toBe("none");
    });

    it("parses example: jakarta apache", () => {
      const ast = Module.parseQueryString("jakarta apache");

      assert("operator" in ast && "term" in ast.left && "term" in ast.right);
      expect(ast.left.field).toBe("<implicit>");
      expect(ast.left.term).toBe("jakarta");
      expect(ast.operator).toBe("<implicit>");
      expect(ast.right.field).toBe("<implicit>");
      expect(ast.right.term).toBe("apache");
    });

    it("parses example: jakarta^4 apache", () => {
      const ast = Module.parseQueryString("jakarta^4 apache");

      assert("operator" in ast && "term" in ast.left && "term" in ast.right);
      expect(ast.left.field).toBe("<implicit>");
      expect(ast.left.term).toBe("jakarta");
      expect(ast.left.boost).toBe(4);
      expect(ast.operator).toBe("<implicit>");
      expect(ast.right.field).toBe("<implicit>");
      expect(ast.right.term).toBe("apache");
    });

    it('parses example: "jakarta apache"^4 "Apache Lucene"', () => {
      const ast = Module.parseQueryString('"jakarta apache"^4 "Apache Lucene"');

      assert("operator" in ast && "term" in ast.left && "term" in ast.right);
      expect(ast.left.field).toBe("<implicit>");
      expect(ast.left.term).toBe("jakarta apache");
      expect(ast.left.boost).toBe(4);
      expect(ast.operator).toBe("<implicit>");
      expect(ast.right.field).toBe("<implicit>");
      expect(ast.right.term).toBe("Apache Lucene");
    });

    it('parses example: "jakarta apache" jakarta', () => {
      const ast = Module.parseQueryString('"jakarta apache" jakarta');

      assert("operator" in ast && "term" in ast.left && "term" in ast.right);
      expect(ast.left.field).toBe("<implicit>");
      expect(ast.left.term).toBe("jakarta apache");
      expect(ast.operator).toBe("<implicit>");
      expect(ast.right.field).toBe("<implicit>");
      expect(ast.right.term).toBe("jakarta");
    });

    it('parses example: "jakarta apache" OR jakarta', () => {
      const ast = Module.parseQueryString('"jakarta apache" OR jakarta');

      assert("operator" in ast && "term" in ast.left && "term" in ast.right);
      expect(ast.left.field).toBe("<implicit>");
      expect(ast.left.term).toBe("jakarta apache");
      expect(ast.operator).toBe("OR");
      expect(ast.right.field).toBe("<implicit>");
      expect(ast.right.term).toBe("jakarta");
    });

    it('parses example: "jakarta apache" AND "Apache Lucene"', () => {
      const ast = Module.parseQueryString(
        '"jakarta apache" AND "Apache Lucene"',
      );

      assert("operator" in ast && "term" in ast.left && "term" in ast.right);
      expect(ast.left.field).toBe("<implicit>");
      expect(ast.left.term).toBe("jakarta apache");
      expect(ast.operator).toBe("AND");
      expect(ast.right.field).toBe("<implicit>");
      expect(ast.right.term).toBe("Apache Lucene");
    });

    it("parses example: +jakarta lucene", () => {
      const ast = Module.parseQueryString("+jakarta lucene");

      assert("term" in ast.left);
      expect(ast.left.field).toBe("<implicit>");
      expect(ast.left.term).toBe("jakarta");
      expect(ast.left.prefix).toBe("+");
    });

    it('parses example: "jakarta apache" NOT "Apache Lucene"', () => {
      const ast = Module.parseQueryString(
        '"jakarta apache" NOT "Apache Lucene"',
      );

      assert("operator" in ast && "term" in ast.left && "term" in ast.right);
      expect(ast.left.field).toBe("<implicit>");
      expect(ast.left.term).toBe("jakarta apache");
      expect(ast.right.prefix).toBe("NOT");
      expect(ast.right.field).toBe("<implicit>");
      expect(ast.right.term).toBe("Apache Lucene");
    });

    it('parses example: NOT "jakarta apache"', () => {
      const ast = Module.parseQueryString('NOT "jakarta apache"');

      assert("term" in ast.left);
      expect(ast.left.field).toBe("<implicit>");
      expect(ast.left.prefix).toBe("NOT");
      expect(ast.left.term).toBe("jakarta apache");
    });

    it('parses example: "jakarta apache" -"Apache Lucene"', () => {
      const ast = Module.parseQueryString('"jakarta apache" -"Apache Lucene"');

      assert("operator" in ast && "term" in ast.left && "term" in ast.right);
      expect(ast.left.field).toBe("<implicit>");
      expect(ast.left.term).toBe("jakarta apache");
      expect(ast.operator).toBe("<implicit>");
      expect(ast.right.field).toBe("<implicit>");
      expect(ast.right.term).toBe("Apache Lucene");
      expect(ast.right.prefix).toBe("-");
    });

    it("parses example: (jakarta OR apache) AND website", () => {
      const ast = Module.parseQueryString("(jakarta OR apache) AND website");
      const leftNode = ast.left;

      assert(
        "operator" in leftNode &&
          "term" in leftNode.left &&
          "term" in leftNode.right &&
          "operator" in ast &&
          "term" in ast.right,
      );

      expect(leftNode.left.field).toBe("<implicit>");
      expect(leftNode.left.term).toBe("jakarta");
      expect(leftNode.operator).toBe("OR");
      expect(leftNode.right.field).toBe("<implicit>");
      expect(leftNode.right.term).toBe("apache");

      expect(ast.operator).toBe("AND");
      expect(ast.right.field).toBe("<implicit>");
      expect(ast.right.term).toBe("website");
    });

    it('parses example: title:(+return +"pink panther")', () => {
      const ast = Module.parseQueryString('title:(+return +"pink panther")');
      const leftNode = ast.left;

      assert(
        "operator" in leftNode &&
          "term" in leftNode.left &&
          "term" in leftNode.right,
      );
      expect(leftNode.left.field).toBe("<implicit>");
      expect(leftNode.left.term).toBe("return");
      expect(leftNode.left.prefix).toBe("+");
      expect(leftNode.operator).toBe("<implicit>");
      expect(leftNode.right.field).toBe("<implicit>");
      expect(leftNode.right.term).toBe("pink panther");
      expect(leftNode.right.prefix).toBe("+");
      expect(leftNode.field).toBe("title");
    });

    it("parses example: java AND NOT yamaha", () => {
      const ast = Module.parseQueryString("java AND NOT yamaha");

      assert("operator" in ast && "term" in ast.left && "term" in ast.right);
      expect(ast.left.field).toBe("<implicit>");
      expect(ast.left.term).toBe("java");
      expect(ast.operator).toBe("AND");
      expect(ast.right.prefix).toBe("NOT");
      expect(ast.right.field).toBe("<implicit>");
      expect(ast.right.term).toBe("yamaha");
    });

    it("parses example: NOT (java OR python) AND android", () => {
      const ast = Module.parseQueryString("NOT (java OR python) AND android");
      const leftNode = ast.left;

      assert(
        "operator" in ast &&
          "term" in ast.right &&
          "operator" in leftNode &&
          "prefix" in leftNode &&
          "term" in leftNode.left &&
          "term" in leftNode.right,
      );

      expect(leftNode.prefix).toBe("NOT");
      expect(leftNode.left.field).toBe("<implicit>");
      expect(leftNode.left.term).toBe("java");
      expect(leftNode.operator).toBe("OR");
      expect(leftNode.right.field).toBe("<implicit>");
      expect(leftNode.right.term).toBe("python");

      expect(ast.operator).toBe("AND");
      expect(ast.right.field).toBe("<implicit>");
      expect(ast.right.term).toBe("android");
    });

    it("must handle whitespace in parens", () => {
      const ast = Module.parseQueryString("foo ( bar OR baz)");

      assert(
        "operator" in ast &&
          "term" in ast.left &&
          "left" in ast.right &&
          "term" in ast.right.left &&
          "right" in ast.right &&
          "term" in ast.right.right,
      );
      expect(ast.left.field).toBe("<implicit>");
      expect(ast.left.term).toBe("foo");
      expect(ast.operator).toBe("<implicit>");
      expect(ast.right.left.term).toBe("bar");
      expect(ast.right.operator).toBe("OR");
      expect(ast.right.right.term).toBe("baz");
    });
  });

  describe("syntax errors", () => {
    it("must throw on missing brace", () => {
      expect(() => Module.parseQueryString("(foo:bar")).toThrow(/Expected/);
    });

    it("must throw on missing brace", () => {
      expect(() => Module.parseQueryString("foo:")).toThrow(/Expected/);
    });
  });

  describe("escaped sequences in quoted terms", () => {
    it("must support simple quote escape", () => {
      const ast = Module.parseQueryString('foo:"a\\"b"');

      assert("term" in ast.left);
      expect(ast.left.field).toBe("foo");
      expect(ast.left.term).toBe('a\\"b');
    });

    it("must support multiple quoted terms", () => {
      const ast = Module.parseQueryString('"a\\"b" "c\\"d"');

      assert("term" in ast.left && "right" in ast && "term" in ast.right);
      expect(ast.left.term).toBe('a\\"b');
      expect(ast.right.term).toBe('c\\"d');
    });

    it("must correctly escapes other reserved characters", () => {
      const ast = Module.parseQueryString('"a\\:b" "c\\~d\\+\\-\\?\\*"');

      assert("term" in ast.left && "right" in ast && "term" in ast.right);
      expect(ast.left.term).toBe("a\\:b");
      expect(ast.right.term).toBe("c\\~d\\+\\-\\?\\*");
    });
  });

  describe("escaped sequences in unquoted terms", () => {
    it("must escape a + character", () => {
      const ast = Module.parseQueryString("foo\\: asdf");

      assert("term" in ast.left && "right" in ast && "term" in ast.right);
      expect(ast.left.term).toBe("foo\\:");
      expect(ast.right.term).toBe("asdf");
    });

    it("must escape brackets, braces, and parenthesis characters", () => {
      const ast = Module.parseQueryString("a\\(b\\)\\{c\\}\\[d\\]e");

      assert("term" in ast.left);
      expect(ast.left.term).toBe("a\\(b\\)\\{c\\}\\[d\\]e");
    });

    it("must respect quoted whitespace", () => {
      const ast = Module.parseQueryString("foo:a\\ b");

      assert("term" in ast.left);
      expect(ast.left.term).toBe("a\\ b");
    });

    it("must respect quoted and unquoted whitespace", () => {
      const ast = Module.parseQueryString("foo:a\\ b c\\ d");

      assert("term" in ast.left && "right" in ast && "term" in ast.right);
      expect(ast.left.term).toBe("a\\ b");
      expect(ast.right.term).toBe("c\\ d");
    });
  });

  describe("escaped sequences field names", () => {
    it("escape", () => {
      const ast = Module.parseQueryString("foo\\~bar: asdf");

      assert("term" in ast.left);
      expect(ast.left.field).toBe("foo\\~bar");
      expect(ast.left.term).toBe("asdf");
    });
  });

  describe("position information", () => {
    it("retains position information", () => {
      const ast = Module.parseQueryString("test:Foo");

      assert("term" in ast.left);
      expect(ast.left.fieldLocation?.start.offset).toBe(0);
      expect(ast.left.fieldLocation?.end.offset).toBe(4);
      expect(ast.left.termLocation.start.offset).toBe(5);
      expect(ast.left.termLocation.end.offset).toBe(8);
    });
  });
});
