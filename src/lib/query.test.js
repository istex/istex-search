import { describe, expect, it } from 'vitest';
import * as Module from './query';

describe('Tests for the function building or parsing query strings', () => {
  it('parseCorpusFileContent', () => {
    const completeCorpusFileContent =
`#
# Fichier .corpus
#
query        : *
date         : 2022-3-11
total        : 5
[ISTEX]

ark   ark:/67375/NVC-S58LP3M2-S    # very cool comment
ark ark:/67375/NVC-RBP335V7-7    # very cool comment

ark  ark:/67375/NVC-8SNSRJ6Z-Z    # very cool comment
id    B940A8D3FD96AB383C6393070933764A2CE3D106   # very cool comment
id CAE51D9B29CBA1B8C81A136946C75A51055C7066  # very cool comment
id  59E080581FC0350BC92AD9975484E4127E8803A0 # very cool comment`;

    const onlyArksCorpusFileContent =
`#
# Fichier .corpus
#
query        : *
date         : 2022-3-11
total        : 5
[ISTEX]

ark   ark:/67375/NVC-S58LP3M2-S    # very cool comment
ark ark:/67375/NVC-RBP335V7-7    # very cool comment
ark  ark:/67375/NVC-8SNSRJ6Z-Z    # very cool comment`;

    const onlyIstexIdsCorpusFileContent =
`#
# Fichier .corpus
#
query        : *
date         : 2022-3-11
total        : 5
[ISTEX]
id    B940A8D3FD96AB383C6393070933764A2CE3D106   # very cool comment
id CAE51D9B29CBA1B8C81A136946C75A51055C7066  # very cool comment
id  59E080581FC0350BC92AD9975484E4127E8803A0 # very cool comment`;

    const invalidLineCorpusFileContent =
`#
# Fichier .corpus
#
query        : *
date         : 2022-3-11
total        : 5
[ISTEX]
ark  ark:/67375/NVC-S58LP3M2-S
   
garbage line

ark  ark:/67375/NVC-RBP335V7-7
ark  ark:/67375/NVC-8SNSRJ6Z-Z`;

    const completeExpectedQueryString = 'arkIstex.raw:("ark:/67375/NVC-8SNSRJ6Z-Z" "ark:/67375/NVC-RBP335V7-7" "ark:/67375/NVC-S58LP3M2-S") OR id:("59E080581FC0350BC92AD9975484E4127E8803A0" "CAE51D9B29CBA1B8C81A136946C75A51055C7066" "B940A8D3FD96AB383C6393070933764A2CE3D106")';
    const parsedCompleteCorpusFileContent = Module.parseCorpusFileContent(completeCorpusFileContent);
    expect(parsedCompleteCorpusFileContent.queryString).toBe(completeExpectedQueryString);
    expect(parsedCompleteCorpusFileContent.numberOfIds).toBe(6);

    const onlyArksExpectedQueryString = 'arkIstex.raw:("ark:/67375/NVC-8SNSRJ6Z-Z" "ark:/67375/NVC-RBP335V7-7" "ark:/67375/NVC-S58LP3M2-S")';
    const parsedOnlyArksCorpusFileContent = Module.parseCorpusFileContent(onlyArksCorpusFileContent);
    expect(parsedOnlyArksCorpusFileContent.queryString).toBe(onlyArksExpectedQueryString);
    expect(parsedOnlyArksCorpusFileContent.numberOfIds).toBe(3);

    const onlyIstexIdsExpectedQueryString = 'id:("59E080581FC0350BC92AD9975484E4127E8803A0" "CAE51D9B29CBA1B8C81A136946C75A51055C7066" "B940A8D3FD96AB383C6393070933764A2CE3D106")';
    const parsedOnlyIstexIdsCorpusFileContent = Module.parseCorpusFileContent(onlyIstexIdsCorpusFileContent);
    expect(parsedOnlyIstexIdsCorpusFileContent.queryString).toBe(onlyIstexIdsExpectedQueryString);
    expect(parsedOnlyIstexIdsCorpusFileContent.numberOfIds).toBe(3);

    expect(() => Module.parseCorpusFileContent(invalidLineCorpusFileContent)).toThrow();
  });

  it('buildQueryStringFromArks', () => {
    const arks = [
      'ark:/67375/NVC-8SNSRJ6Z-Z ',
      ' ark:/67375/NVC-RBP335V7-7',
      'ark:/67375/NVC-S58LP3M2-S ',
    ];

    const expectedQueryString = 'arkIstex.raw:("ark:/67375/NVC-8SNSRJ6Z-Z" "ark:/67375/NVC-RBP335V7-7" "ark:/67375/NVC-S58LP3M2-S")';
    expect(Module.buildQueryStringFromArks(arks)).toBe(expectedQueryString);
  });

  it('buildQueryStringFromIstexIds', () => {
    const istexIds = [
      '59E080581FC0350BC92AD9975484E4127E8803A0',
      'CAE51D9B29CBA1B8C81A136946C75A51055C7066',
      'B940A8D3FD96AB383C6393070933764A2CE3D106',
    ];

    const expectedQueryString = 'id:("59E080581FC0350BC92AD9975484E4127E8803A0" "CAE51D9B29CBA1B8C81A136946C75A51055C7066" "B940A8D3FD96AB383C6393070933764A2CE3D106")';
    expect(Module.buildQueryStringFromIstexIds(istexIds)).toBe(expectedQueryString);
  });

  it('buildQueryStringFromDoiList', () => {
    const doiList = [
      '10.1007/s12291-008-0044-0',
      '10.1016/S0041-1345(00)01436-6',
      '10.1111/j.1365-2923.2011.04210.x',
    ];

    const expectedQueryString = 'doi:("10.1007/s12291-008-0044-0" "10.1016/S0041-1345(00)01436-6" "10.1111/j.1365-2923.2011.04210.x")';
    expect(Module.buildQueryStringFromDoiList(doiList)).toBe(expectedQueryString);
  });

  it('isArkQueryString', () => {
    const correctArkQueryString = 'arkIstex.raw:("ark:/67375/NVC-15SZV86B-F" "ark:/67375/NVC-XMM4B8LD-H")';
    const badArkQueryString = 'arkIstex.raw:("ark1" "ark2")';
    const garbageString = 'foo:bar';

    expect(Module.isArkQueryString(correctArkQueryString)).toBe(true);
    expect(Module.isArkQueryString(badArkQueryString)).toBe(false);
    expect(Module.isArkQueryString(garbageString)).toBe(false);
  });

  it('getArksFromArkQueryString', () => {
    const singleArkQueryString = 'arkIstex.raw:("ark:/67375/NVC-15SZV86B-F")';
    const multipleArkQueryString = 'arkIstex.raw:("ark:/67375/NVC-15SZV86B-F" "ark:/67375/NVC-XMM4B8LD-H")';

    expect(Module.getArksFromArkQueryString(singleArkQueryString)).toEqual(['ark:/67375/NVC-15SZV86B-F']);
    expect(Module.getArksFromArkQueryString(multipleArkQueryString)).toEqual(['ark:/67375/NVC-15SZV86B-F', 'ark:/67375/NVC-XMM4B8LD-H']);
  });

  it('isIstexIdQueryString', () => {
    const correctIstexIdQueryString = 'id:("1234" "5678")';
    const garbageString = 'foo:bar';

    expect(Module.isIstexIdQueryString(correctIstexIdQueryString)).toBe(true);
    expect(Module.isIstexIdQueryString(garbageString)).toBe(false);
  });

  it('getIstexIdsFromIstexIdQueryString', () => {
    const singleIstexIdQueryString = 'id:("1234")';
    const multipleIstexIdsQueryString = 'id:("1234" "5678")';

    expect(Module.getIstexIdsFromIstexIdQueryString(singleIstexIdQueryString)).toEqual(['1234']);
    expect(Module.getIstexIdsFromIstexIdQueryString(multipleIstexIdsQueryString)).toEqual(['1234', '5678']);
  });

  it('isDoiQueryString', () => {
    const correctDoiQueryString = 'doi:("10.1007/s12291-008-0044-0" "10.1016/S0041-1345(00)01436-6" "10.1111/j.1365-2923.2011.04210.x")';
    const garbageString = 'foo:bar';

    expect(Module.isDoiQueryString(correctDoiQueryString)).toBe(true);
    expect(Module.isDoiQueryString(garbageString)).toBe(false);
  });

  it('getDoisFromDoiQueryString', () => {
    const singleDoiQueryString = 'doi:("10.1007/s12291-008-0044-0")';
    const multipleDoiQueryString = 'doi:("10.1007/s12291-008-0044-0" "10.1016/S0041-1345(00)01436-6")';

    expect(Module.getDoisFromDoiQueryString(singleDoiQueryString)).toEqual(['10.1007/s12291-008-0044-0']);
    expect(Module.getDoisFromDoiQueryString(multipleDoiQueryString)).toEqual(['10.1007/s12291-008-0044-0', '10.1016/S0041-1345(00)01436-6']);
  });
});