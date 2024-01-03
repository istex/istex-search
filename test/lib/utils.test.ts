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
  it(`should identify errors, replace '\n' by ',' and put each items in quotes`, () => {
    const ids = "id1\nid2\nid3";
    expect(Module.buildQueryFromIds("doi", ids)).toStrictEqual({
      errorLines: [1, 2, 3],
      query: 'doi:("id1","id2","id3")',
    });
  });
  it(`should identify any error but still replace '\n' by ',' and put each items in quotes`, () => {
    const ids =
      "10.1136/bmj.2.2760.1392-a\n10.1136/jech.20.3.127\n10.1136/bmj.1.2091.212-a";
    expect(Module.buildQueryFromIds("doi", ids)).toStrictEqual({
      errorLines: [],
      query:
        'doi:("10.1136/bmj.2.2760.1392-a","10.1136/jech.20.3.127","10.1136/bmj.1.2091.212-a")',
    });
  });
});

describe("getIdsFromQuery", () => {
  it(`should replace ',' by '\n' and remove quotes`, () => {
    const query = 'arkIstex:("id1","id2","id3")';
    expect(Module.getIdsFromQuery(query)).toBe("id1\nid2\nid3");
  });

  it(`should return query if it doesn't match the pattern`, () => {
    const query = "abc";
    expect(Module.getIdsFromQuery(query)).toBe(query);
  });
});

describe("parseCorpusFileContent", () => {
  it(`should replace '\n' by ' OR ' and put each items in quotes`, () => {
    const corpusFileContent = `#
    # Fichier .corpus
    #
    query        : *
    date         : 2022-3-11
    total        : 3
    [ISTEX]
    ark   id1    # very cool comment
    ark id2    # very cool comment
    ark  id3    # very cool comment`;
    expect(Module.parseCorpusFileContent(corpusFileContent)).toBe(
      `id1
id2
id3`,
    );
  });
});

describe("isoToLanguage", () => {
  it(`should return the language corresponding to the iso code`, () => {
    expect(Module.isoToLanguage("fr-FR", "fr")).toBe("français");
    expect(Module.isoToLanguage("en-EN", "en")).toBe("English");
    expect(Module.isoToLanguage("en-EN", "fr")).toBe("French");
    expect(Module.isoToLanguage("en-EN", "de")).toBe("German");
    expect(Module.isoToLanguage("en-EN", "es")).toBe("Spanish");
    expect(Module.isoToLanguage("en-EN", "it")).toBe("Italian");
    expect(Module.isoToLanguage("en-EN", "pt")).toBe("Portuguese");
    expect(Module.isoToLanguage("en-EN", "ru")).toBe("Russian");
    expect(Module.isoToLanguage("en-EN", "zh")).toBe("Chinese");
    expect(Module.isoToLanguage("en-EN", "ja")).toBe("Japanese");
    expect(Module.isoToLanguage("en-EN", "ko")).toBe("Korean");
    expect(Module.isoToLanguage("en-EN", "ar")).toBe("Arabic");
    expect(Module.isoToLanguage("en-EN", "he")).toBe("Hebrew");
    expect(Module.isoToLanguage("en-EN", "la")).toBe("Latin");
    expect(Module.isoToLanguage("en-EN", "el")).toBe("Greek");
    expect(Module.isoToLanguage("en-EN", "hi")).toBe("Hindi");
    expect(Module.isoToLanguage("en-EN", "fa")).toBe("Persian");
    expect(Module.isoToLanguage("en-EN", "tr")).toBe("Turkish");
    expect(Module.isoToLanguage("en-EN", "nl")).toBe("Dutch");
    expect(Module.isoToLanguage("en-EN", "sv")).toBe("Swedish");
    expect(Module.isoToLanguage("en-EN", "pl")).toBe("Polish");
    expect(Module.isoToLanguage("en-EN", "cs")).toBe("Czech");
    expect(Module.isoToLanguage("en-EN", "no")).toBe("Norwegian");
    expect(Module.isoToLanguage("en-EN", "da")).toBe("Danish");
    expect(Module.isoToLanguage("en-EN", "fi")).toBe("Finnish");
    expect(Module.isoToLanguage("en-EN", "hu")).toBe("Hungarian");
    expect(Module.isoToLanguage("en-EN", "ro")).toBe("Romanian");
    expect(Module.isoToLanguage("en-EN", "uk")).toBe("Ukrainian");
    expect(Module.isoToLanguage("en-EN", "bg")).toBe("Bulgarian");
    expect(Module.isoToLanguage("en-EN", "vi")).toBe("Vietnamese");
    expect(Module.isoToLanguage("en-EN", "th")).toBe("Thai");
    expect(Module.isoToLanguage("en-EN", "id")).toBe("Indonesian");
    expect(Module.isoToLanguage("en-EN", "ms")).toBe("Malay");
    expect(Module.isoToLanguage("en-EN", "et")).toBe("Estonian");
    expect(Module.isoToLanguage("en-EN", "lv")).toBe("Latvian");
    expect(Module.isoToLanguage("en-EN", "lt")).toBe("Lithuanian");
    expect(Module.isoToLanguage("en-EN", "sr")).toBe("Serbian");
    expect(Module.isoToLanguage("en-EN", "sk")).toBe("Slovak");
    expect(Module.isoToLanguage("en-EN", "sl")).toBe("Slovenian");
    expect(Module.isoToLanguage("en-EN", "hr")).toBe("Croatian");
    expect(Module.isoToLanguage("en-EN", "tl")).toBe("Filipino");
  });
  it(`should return the iso code if the language is not supported`, () => {
    expect(Module.isoToLanguage("en-EN", "abc")).toBe("abc");
  });
});
