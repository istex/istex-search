import { supportedIdTypes } from "@/config";
import type CustomError from "@/lib/CustomError";
import * as Module from "@/lib/queryIds";

describe("Import search related functions", () => {
  describe("parseCorpusFileContent", () => {
    it("should parse a .corpus file containing DOIs", () => {
      const corpusFileContent = `#
# Fichier .corpus
#
query        : *
date         : 2022-3-11
total        : 3
[ISTEX]
doi   10.1007/s12291-008-0044-0   # very cool comment
doi 10.1016/S0041-1345(00)01436-6  # very cool comment
doi  10.1111/j.1365-2923.2011.04210.x # very cool comment`;

      const queryString =
        'doi.raw:("10.1007/s12291-008-0044-0" "10.1016/S0041-1345(00)01436-6" "10.1111/j.1365-2923.2011.04210.x")';
      const parseResult = Module.parseCorpusFileContent(corpusFileContent);

      expect(parseResult.queryString).toBe(queryString);
      expect(parseResult.ids.length).toBe(3);
    });

    it("should parse a .corpus file containing ARKs", () => {
      const corpusFileContent = `#
# Fichier .corpus
#
query        : *
date         : 2022-3-11
total        : 3
[ISTEX]

ark   ark:/67375/NVC-S58LP3M2-S    # very cool comment
ark ark:/67375/NVC-RBP335V7-7    # very cool comment
ark  ark:/67375/NVC-8SNSRJ6Z-Z    # very cool comment`;

      const queryString =
        'arkIstex.raw:("ark:/67375/NVC-S58LP3M2-S" "ark:/67375/NVC-RBP335V7-7" "ark:/67375/NVC-8SNSRJ6Z-Z")';
      const parseResult = Module.parseCorpusFileContent(corpusFileContent);

      expect(parseResult.queryString).toBe(queryString);
      expect(parseResult.ids.length).toBe(3);
    });

    it("should parse a .corpus file containing Istex IDs", () => {
      const corpusFileContent = `#
# Fichier .corpus
#
query        : *
date         : 2022-3-11
total        : 3
[ISTEX]
id    B940A8D3FD96AB383C6393070933764A2CE3D106   # very cool comment
id CAE51D9B29CBA1B8C81A136946C75A51055C7066  # very cool comment
id  59E080581FC0350BC92AD9975484E4127E8803A0 # very cool comment`;

      const queryString =
        'id:("B940A8D3FD96AB383C6393070933764A2CE3D106" "CAE51D9B29CBA1B8C81A136946C75A51055C7066" "59E080581FC0350BC92AD9975484E4127E8803A0")';
      const parseResult = Module.parseCorpusFileContent(corpusFileContent);

      expect(parseResult.queryString).toBe(queryString);
      expect(parseResult.ids.length).toBe(3);
    });

    it("should detect files without the [ISTEX] line", () => {
      const corpusFileContent = "garbage";

      const error = getError(() =>
        Module.parseCorpusFileContent(corpusFileContent),
      );
      expect(error?.info).toMatchObject({ name: "CorpusFileFormatError" });
    });

    it("should invalid IDs", () => {
      const corpusFileContent = `#
# Fichier .corpus
#
query        : *
date         : 2022-3-11
total        : 3
[ISTEX]
ark  ark:/67375/NVC-S58LP3M2-S
first error
ark  ark:/67375/NVC-RBP335V7-7
second error
ark  ark:/67375/NVC-8SNSRJ6Z-Z`;

      const error = getError(() =>
        Module.parseCorpusFileContent(corpusFileContent),
      );
      expect(error?.info).toMatchObject({ count: 2, lines: "9, 11" });
    });

    it("should detect syntax errors in DOIs", () => {
      const corpusFileContent = `#
# Fichier .corpus
#
query        : *
date         : 2022-3-11
total        : 1
[ISTEX]
doi   1.1007/s12291-008-0044-0   # wrong prefix`;

      const error = getError(() =>
        Module.parseCorpusFileContent(corpusFileContent),
      );
      expect(error?.info).toMatchObject({ count: 1, lines: "8" });
    });

    it("should detect syntax errors in ARKs", () => {
      const corpusFileContent = `#
# Fichier .corpus
#
query        : *
date         : 2022-3-11
total        : 1
[ISTEX]
ark ark:/67375/NVC-S58LP3M2-    # missing last character`;

      const error = getError(() =>
        Module.parseCorpusFileContent(corpusFileContent),
      );
      expect(error?.info).toMatchObject({ count: 1, lines: "8" });
    });

    it("should detect syntax errors in Istex IDs", () => {
      const corpusFileContent = `#
# Fichier .corpus
#
query        : *
date         : 2022-3-11
total        : 1
[ISTEX]
id CAE51D9B29CBA1B8C81A136946C75A51055C706    # missing last character`;

      const error = getError(() =>
        Module.parseCorpusFileContent(corpusFileContent),
      );
      expect(error?.info).toMatchObject({ count: 1, lines: "8" });
    });
  });

  describe("buildQueryStringFromIds", () => {
    it("should build a DOI query string", () => {
      const ids = [
        "10.1007/s12291-008-0044-0",
        "10.1016/S0041-1345(00)01436-6",
        "10.1111/j.1365-2923.2011.04210.x",
      ];
      const queryString =
        'doi.raw:("10.1007/s12291-008-0044-0" "10.1016/S0041-1345(00)01436-6" "10.1111/j.1365-2923.2011.04210.x")';

      expect(Module.buildQueryStringFromIds(supportedIdTypes[0], ids)).toBe(
        queryString,
      );
    });

    it("should build an ARK query string", () => {
      const ids = [
        "ark:/67375/NVC-8SNSRJ6Z-Z ",
        " ark:/67375/NVC-RBP335V7-7",
        "ark:/67375/NVC-S58LP3M2-S ",
      ];
      const queryString =
        'arkIstex.raw:("ark:/67375/NVC-8SNSRJ6Z-Z" "ark:/67375/NVC-RBP335V7-7" "ark:/67375/NVC-S58LP3M2-S")';

      expect(Module.buildQueryStringFromIds(supportedIdTypes[1], ids)).toBe(
        queryString,
      );
    });

    it("should build an Istex ID query string", () => {
      const ids = [
        "59E080581FC0350BC92AD9975484E4127E8803A0",
        "CAE51D9B29CBA1B8C81A136946C75A51055C7066",
        "B940A8D3FD96AB383C6393070933764A2CE3D106",
      ];
      const queryString =
        'id:("59E080581FC0350BC92AD9975484E4127E8803A0" "CAE51D9B29CBA1B8C81A136946C75A51055C7066" "B940A8D3FD96AB383C6393070933764A2CE3D106")';

      expect(Module.buildQueryStringFromIds(supportedIdTypes[2], ids)).toBe(
        queryString,
      );
    });
  });

  describe("isIdQueryString", () => {
    it("should detect DOI query strings", () => {
      const queryString =
        'doi.raw:("10.1007/s12291-008-0044-0" "10.1016/S0041-1345(00)01436-6" "10.1111/j.1365-2923.2011.04210.x")';

      expect(Module.isIdQueryString(supportedIdTypes[0], queryString)).toBe(
        true,
      );
    });

    it("should detect ARK query strings", () => {
      const queryString =
        'arkIstex.raw:("ark:/67375/NVC-15SZV86B-F" "ark:/67375/NVC-XMM4B8LD-H")';

      expect(Module.isIdQueryString(supportedIdTypes[1], queryString)).toBe(
        true,
      );
    });

    it("should detect Istex ID query strings", () => {
      const queryString =
        'id:("59E080581FC0350BC92AD9975484E4127E8803A0" "8BCCF3BB7437DC06D22134B90DFF2F736E3C6BB9")';

      expect(Module.isIdQueryString(supportedIdTypes[2], queryString)).toBe(
        true,
      );
    });

    it("should reject other query strings", () => {
      const queryString = "foo:bar";

      for (const idType of supportedIdTypes) {
        expect(Module.isIdQueryString(idType, queryString)).toBe(false);
      }
    });
  });

  describe("getIdTypeFromQueryString", () => {
    it("should extract the ID type for DOI query strings", () => {
      const queryString =
        'doi.raw:("10.1007/s12291-008-0044-0" "10.1016/S0041-1345(00)01436-6" "10.1111/j.1365-2923.2011.04210.x")';

      expect(Module.getIdTypeFromQueryString(queryString)).toBe(
        supportedIdTypes[0],
      );
    });

    it("should extract the ID type for ARK query strings", () => {
      const queryString =
        'arkIstex.raw:("ark:/67375/NVC-15SZV86B-F" "ark:/67375/NVC-XMM4B8LD-H")';

      expect(Module.getIdTypeFromQueryString(queryString)).toBe(
        supportedIdTypes[1],
      );
    });

    it("should extract the ID type for Istex ID query strings", () => {
      const queryString =
        'id:("59E080581FC0350BC92AD9975484E4127E8803A0" "8BCCF3BB7437DC06D22134B90DFF2F736E3C6BB9")';

      expect(Module.getIdTypeFromQueryString(queryString)).toBe(
        supportedIdTypes[2],
      );
    });

    it("should return null for other query strings", () => {
      const queryString = "foo:bar";

      expect(Module.getIdTypeFromQueryString(queryString)).toBe(null);
    });
  });

  describe("getIdTypeFromId", () => {
    it("should extract the ID type for a DOI", () => {
      const id = "10.1007/s12291-008-0044-0";

      expect(Module.getIdTypeFromId(id)).toBe(supportedIdTypes[0]);
    });

    it("should extract the ID type for an ARK", () => {
      const id = "ark:/67375/NVC-15SZV86B-F";

      expect(Module.getIdTypeFromId(id)).toBe(supportedIdTypes[1]);
    });

    it("should extract the ID type for an Istex ID", () => {
      const id = "59E080581FC0350BC92AD9975484E4127E8803A0";

      expect(Module.getIdTypeFromId(id)).toBe(supportedIdTypes[2]);
    });

    it("should return null for invalid IDs", () => {
      const id = "abc";

      expect(Module.getIdTypeFromId(id)).toBe(null);
    });
  });

  describe("getIdsFromQueryString", () => {
    it("should extract DOIs from a DOI query string", () => {
      const queryString =
        'doi.raw:("10.1007/s12291-008-0044-0" "10.1016/S0041-1345(00)01436-6")';

      expect(
        Module.getIdsFromQueryString(supportedIdTypes[0], queryString),
      ).toEqual(["10.1007/s12291-008-0044-0", "10.1016/S0041-1345(00)01436-6"]);
    });

    it("should extract ARKs from an ARK query string", () => {
      const queryString =
        'arkIstex.raw:("ark:/67375/NVC-15SZV86B-F" "ark:/67375/NVC-XMM4B8LD-H")';

      expect(
        Module.getIdsFromQueryString(supportedIdTypes[1], queryString),
      ).toEqual(["ark:/67375/NVC-15SZV86B-F", "ark:/67375/NVC-XMM4B8LD-H"]);
    });

    it("should extract Istex IDs from an Istex ID query string", () => {
      const queryString =
        'id:("59E080581FC0350BC92AD9975484E4127E8803A0" "8BCCF3BB7437DC06D22134B90DFF2F736E3C6BB9")';

      expect(
        Module.getIdsFromQueryString(supportedIdTypes[2], queryString),
      ).toEqual([
        "59E080581FC0350BC92AD9975484E4127E8803A0",
        "8BCCF3BB7437DC06D22134B90DFF2F736E3C6BB9",
      ]);
    });

    it("should return an empty array when not passing a supported ID type", () => {
      expect(Module.getIdsFromQueryString(null, "")).toEqual([]);
    });
  });
});

function getError(func: (...args: any[]) => any) {
  try {
    func();
  } catch (err) {
    return err as CustomError;
  }

  return null;
}
