import * as Module from "@/lib/utils";

describe("Utility functions", () => {
  it("clamp", () => {
    const min = 5;
    const max = 10;

    expect(Module.clamp(3, min, max)).toBe(min);
    expect(Module.clamp(7, min, max)).toBe(7);
    expect(Module.clamp(12, min, max)).toBe(max);
  });

  it("closest", () => {
    const values = [10, 20, 30];

    expect(Module.closest(10, values)).toBe(10);
    expect(Module.closest(20, values)).toBe(20);
    expect(Module.closest(30, values)).toBe(30);
    expect(Module.closest(2, values)).toBe(10);
    expect(Module.closest(15, values)).toBe(10);
    expect(Module.closest(17, values)).toBe(20);
    expect(Module.closest(22, values)).toBe(20);
    expect(Module.closest(37, values)).toBe(30);
  });

  it("isValidMd5", () => {
    const valid = "0123456789ABCDEF0123456789ABCDEF";
    const lessThan32Characters = "0123456789ABCDEF";
    const moreThan32Characters = "0123456789ABCDEF0123456789ABCDEF1234";
    const nonHexaCharacters = "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzz";

    expect(Module.isValidMd5(valid)).toBe(true);
    expect(Module.isValidMd5(lessThan32Characters)).toBe(false);
    expect(Module.isValidMd5(moreThan32Characters)).toBe(false);
    expect(Module.isValidMd5(nonHexaCharacters)).toBe(false);
  });
});

describe("isValidDoi", () => {
  it("should return true if doi is valid", () => {
    const validDoi =
      "10.1002/(SICI)1522-2594(199911)42:5<952::AID-MRM16>3.0.CO;2-S";
    expect(Module.isValidDoi(validDoi)).toBe(true);
  });

  it("should return false if doi is not valid", () => {
    const invalidDoi = "abc";
    expect(Module.isValidDoi(invalidDoi)).toBe(false);
  });
});

describe("isValidIstexId", () => {
  it("should return true if IstexId is valid", () => {
    const validIstexId = "ark:/67375/NVC-Z7G9LN4W-1";
    expect(Module.isValidIstexId(validIstexId)).toBe(true);
  });

  it("should return false if IstexId is not valid", () => {
    const invalidIstexId = "abc";
    expect(Module.isValidIstexId(invalidIstexId)).toBe(false);
  });
});

describe("buildQueryFromIds", () => {
  it(`should replace '\n' by ' OR ' and put each items in quotes`, () => {
    const ids = "id1\nid2\nid3";
    expect(Module.buildQueryFromIds(ids)).toBe('"id1" OR "id2" OR "id3"');
  });
});

describe("isValidDoi", () => {
  it("should return true if doi is valid", () => {
    const validDoi =
      "10.1002/(SICI)1522-2594(199911)42:5<952::AID-MRM16>3.0.CO;2-S";
    expect(Module.isValidDoi(validDoi)).toBe(true);
  });

  it("should return false if doi is not valid", () => {
    const invalidDoi = "abc";
    expect(Module.isValidDoi(invalidDoi)).toBe(false);
  });
});

describe("isValidIstexId", () => {
  it("should return true if IstexId is valid", () => {
    const validIstexId = "ark:/67375/NVC-Z7G9LN4W-1";
    expect(Module.isValidIstexId(validIstexId)).toBe(true);
  });

  it("should return false if IstexId is not valid", () => {
    const invalidIstexId = "abc";
    expect(Module.isValidIstexId(invalidIstexId)).toBe(false);
  });
});

describe("buildQueryFromIds", () => {
  it(`should replace '\n' by ' OR ' and put each items in quotes`, () => {
    const ids = "id1\nid2\nid3";
    expect(Module.buildQueryFromIds(ids)).toBe('"id1" OR "id2" OR "id3"');
  });
});

describe("getIdsFromQuery", () => {
  it(`should replace ' OR ' by '\n' and remove quotes`, () => {
    const query = '"id1" OR "id2" OR "id3"';
    expect(Module.getIdsFromQuery(query)).toBe("id1\nid2\nid3");
  });

  it(`should return query if it doesn't match the pattern`, () => {
    const query = "abc";
    expect(Module.getIdsFromQuery(query)).toBe(query);
  });
});
