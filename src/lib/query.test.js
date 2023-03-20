import { describe, expect, it } from 'vitest';

import { getError } from '@/test/utils';
import { supportedIdTypes } from '@/config';
import * as Module from './query';

describe('Tests for the function building or parsing query strings', () => {
  it('parseCorpusFileContent', () => {
    const completeCorpusFileContent =
`#
# Fichier .corpus
#
query        : *
date         : 2022-3-11
total        : 9
[ISTEX]

ark   ark:/67375/NVC-S58LP3M2-S    # very cool comment
ark ark:/67375/NVC-RBP335V7-7    # very cool comment

ark  ark:/67375/NVC-8SNSRJ6Z-Z    # very cool comment
id    B940A8D3FD96AB383C6393070933764A2CE3D106   # very cool comment
id CAE51D9B29CBA1B8C81A136946C75A51055C7066  # very cool comment
id  59E080581FC0350BC92AD9975484E4127E8803A0 # very cool comment

doi   10.1007/s12291-008-0044-0   # very cool comment
doi 10.1016/S0041-1345(00)01436-6  # very cool comment
doi  10.1111/j.1365-2923.2011.04210.x # very cool comment`;

    const onlyArksCorpusFileContent =
`#
# Fichier .corpus
#
query        : *
date         : 2022-3-11
total        : 3
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
total        : 3
[ISTEX]
id    B940A8D3FD96AB383C6393070933764A2CE3D106   # very cool comment
id CAE51D9B29CBA1B8C81A136946C75A51055C7066  # very cool comment
id  59E080581FC0350BC92AD9975484E4127E8803A0 # very cool comment`;

    const onlyDoisCorpusFileContent =
`#
# Fichier .corpus
#
query        : *
date         : 2022-3-11
total        : 3
[ISTEX]
doi   10.1007/s12291-008-0044-0   # very cool comment
doi 10.1016/S0041-1345(00)01436-6  # very cool comment
doi  10.1111/j.1365-2923.2011.04210.x # very cool comment`;

    const invalidLineCorpusFileContent =
`#
# Fichier .corpus
#
query        : *
date         : 2022-3-11
total        : 3
[ISTEX]
ark  ark:/67375/NVC-S58LP3M2-S
   
garbage line

ark  ark:/67375/NVC-RBP335V7-7
ark  ark:/67375/NVC-8SNSRJ6Z-Z`;

    const multipleErrorsCorpusFileContent =
`#
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

    const invalidArkCorpusFileContent =
`#
# Fichier .corpus
#
query        : *
date         : 2022-3-11
total        : 1
[ISTEX]
ark ark:/67375/NVC-S58LP3M2-    # missing last character`;

    const invalidIstexIdCorpusFileContent =
`#
# Fichier .corpus
#
query        : *
date         : 2022-3-11
total        : 1
[ISTEX]
id CAE51D9B29CBA1B8C81A136946C75A51055C706    # missing last character`;

    const completeExpectedQueryString = 'doi.raw:("10.1007/s12291-008-0044-0" "10.1016/S0041-1345(00)01436-6" "10.1111/j.1365-2923.2011.04210.x") OR arkIstex.raw:("ark:/67375/NVC-S58LP3M2-S" "ark:/67375/NVC-RBP335V7-7" "ark:/67375/NVC-8SNSRJ6Z-Z") OR id:("B940A8D3FD96AB383C6393070933764A2CE3D106" "CAE51D9B29CBA1B8C81A136946C75A51055C7066" "59E080581FC0350BC92AD9975484E4127E8803A0")';
    const parsedCompleteCorpusFileContent = Module.parseCorpusFileContent(completeCorpusFileContent);
    expect(parsedCompleteCorpusFileContent.queryString).toBe(completeExpectedQueryString);
    expect(parsedCompleteCorpusFileContent.numberOfIds).toBe(9);

    const onlyArksExpectedQueryString = 'arkIstex.raw:("ark:/67375/NVC-S58LP3M2-S" "ark:/67375/NVC-RBP335V7-7" "ark:/67375/NVC-8SNSRJ6Z-Z")';
    const parsedOnlyArksCorpusFileContent = Module.parseCorpusFileContent(onlyArksCorpusFileContent);
    expect(parsedOnlyArksCorpusFileContent.queryString).toBe(onlyArksExpectedQueryString);
    expect(parsedOnlyArksCorpusFileContent.numberOfIds).toBe(3);

    const onlyIstexIdsExpectedQueryString = 'id:("B940A8D3FD96AB383C6393070933764A2CE3D106" "CAE51D9B29CBA1B8C81A136946C75A51055C7066" "59E080581FC0350BC92AD9975484E4127E8803A0")';
    const parsedOnlyIstexIdsCorpusFileContent = Module.parseCorpusFileContent(onlyIstexIdsCorpusFileContent);
    expect(parsedOnlyIstexIdsCorpusFileContent.queryString).toBe(onlyIstexIdsExpectedQueryString);
    expect(parsedOnlyIstexIdsCorpusFileContent.numberOfIds).toBe(3);

    const onlyDoisExpectedQueryString = 'doi.raw:("10.1007/s12291-008-0044-0" "10.1016/S0041-1345(00)01436-6" "10.1111/j.1365-2923.2011.04210.x")';
    const parsedOnlyDoisCorpusFileContent = Module.parseCorpusFileContent(onlyDoisCorpusFileContent);
    expect(parsedOnlyDoisCorpusFileContent.queryString).toBe(onlyDoisExpectedQueryString);
    expect(parsedOnlyDoisCorpusFileContent.numberOfIds).toBe(3);

    const invalidLineError = getError(() => Module.parseCorpusFileContent(invalidLineCorpusFileContent));
    expect(invalidLineError).not.toBe(null);
    expect(invalidLineError.ids).toEqual([{ id: 'line', line: 10 }]);

    const multipleErrorsError = getError(() => Module.parseCorpusFileContent(multipleErrorsCorpusFileContent));
    expect(multipleErrorsError).not.toBe(null);
    expect(multipleErrorsError.ids).toEqual([{ id: 'error', line: 9 }, { id: 'error', line: 11 }]);

    const invalidArkError = getError(() => Module.parseCorpusFileContent(invalidArkCorpusFileContent));
    expect(invalidArkError).not.toBe(null);
    expect(invalidArkError.ids).toEqual([{ id: 'ark:/67375/NVC-S58LP3M2-', line: 8 }]);

    const invalidIstexIdError = getError(() => Module.parseCorpusFileContent(invalidIstexIdCorpusFileContent));
    expect(invalidIstexIdError).not.toBe(null);
    expect(invalidIstexIdError.ids).toEqual([{ id: 'CAE51D9B29CBA1B8C81A136946C75A51055C706', line: 8 }]);
  });

  it('getIdTypeInfoFromId', () => {
    const ark = 'ark:/67375/NVC-8SNSRJ6Z-Z';
    const istexId = '59E080581FC0350BC92AD9975484E4127E8803A0';
    const doi = '10.1002/(SICI)1522-2594(199911)42:5<952::AID-MRM16>3.0.CO;2-S';
    const garbage = 'abc';

    expect(Module.getIdTypeInfoFromId(ark)).toBe(supportedIdTypes.ark);
    expect(Module.getIdTypeInfoFromId(istexId)).toBe(supportedIdTypes.istexId);
    expect(Module.getIdTypeInfoFromId(doi)).toBe(supportedIdTypes.doi);
    expect(Module.getIdTypeInfoFromId(garbage)).toBe(undefined);
  });

  it('getIdTypeInfoFromQueryString', () => {
    const correctArkQueryString = 'arkIstex.raw:("ark:/67375/NVC-15SZV86B-F" "ark:/67375/NVC-XMM4B8LD-H")';
    const correctIstexIdQueryString = 'id:("59E080581FC0350BC92AD9975484E4127E8803A0" "8BCCF3BB7437DC06D22134B90DFF2F736E3C6BB9")';
    const correctDoiQueryString = 'doi.raw:("10.1007/s12291-008-0044-0" "10.1016/S0041-1345(00)01436-6" "10.1111/j.1365-2923.2011.04210.x")';

    expect(Module.getIdTypeInfoFromQueryString(correctArkQueryString)).toBe(supportedIdTypes.ark);
    expect(Module.getIdTypeInfoFromQueryString(correctIstexIdQueryString)).toBe(supportedIdTypes.istexId);
    expect(Module.getIdTypeInfoFromQueryString(correctDoiQueryString)).toBe(supportedIdTypes.doi);
  });

  it('buildQueryStringFromIds', () => {
    const arks = [
      'ark:/67375/NVC-8SNSRJ6Z-Z ',
      ' ark:/67375/NVC-RBP335V7-7',
      'ark:/67375/NVC-S58LP3M2-S ',
    ];

    const istexIds = [
      '59E080581FC0350BC92AD9975484E4127E8803A0',
      'CAE51D9B29CBA1B8C81A136946C75A51055C7066',
      'B940A8D3FD96AB383C6393070933764A2CE3D106',
    ];

    const dois = [
      '10.1007/s12291-008-0044-0',
      '10.1016/S0041-1345(00)01436-6',
      '10.1111/j.1365-2923.2011.04210.x',
    ];

    const expectedArkQueryString = 'arkIstex.raw:("ark:/67375/NVC-8SNSRJ6Z-Z" "ark:/67375/NVC-RBP335V7-7" "ark:/67375/NVC-S58LP3M2-S")';
    expect(Module.buildQueryStringFromIds(supportedIdTypes.ark, arks)).toBe(expectedArkQueryString);

    const expectedIstexIdQueryString = 'id:("59E080581FC0350BC92AD9975484E4127E8803A0" "CAE51D9B29CBA1B8C81A136946C75A51055C7066" "B940A8D3FD96AB383C6393070933764A2CE3D106")';
    expect(Module.buildQueryStringFromIds(supportedIdTypes.istexId, istexIds)).toBe(expectedIstexIdQueryString);

    const expectedDoiQueryString = 'doi.raw:("10.1007/s12291-008-0044-0" "10.1016/S0041-1345(00)01436-6" "10.1111/j.1365-2923.2011.04210.x")';
    expect(Module.buildQueryStringFromIds(supportedIdTypes.doi, dois)).toBe(expectedDoiQueryString);
  });

  it('isIdQueryString', () => {
    const correctArkQueryString = 'arkIstex.raw:("ark:/67375/NVC-15SZV86B-F" "ark:/67375/NVC-XMM4B8LD-H")';
    const badArkQueryString = 'arkIstex.raw:("ark1" "ark2")';

    const correctIstexIdQueryString = 'id:("59E080581FC0350BC92AD9975484E4127E8803A0" "8BCCF3BB7437DC06D22134B90DFF2F736E3C6BB9")';
    const badIstexIdQueryString = 'id:("1234" "5678")';

    const correctDoiQueryString = 'doi.raw:("10.1007/s12291-008-0044-0" "10.1016/S0041-1345(00)01436-6" "10.1111/j.1365-2923.2011.04210.x")';
    const badDoiQueryString = 'doi.raw:("1234" "5678")';

    const garbageString = 'foo:bar';

    expect(Module.isIdQueryString(supportedIdTypes.ark, correctArkQueryString)).toBe(true);
    expect(Module.isIdQueryString(supportedIdTypes.ark, badArkQueryString)).toBe(false);
    expect(Module.isIdQueryString(supportedIdTypes.ark, garbageString)).toBe(false);

    expect(Module.isIdQueryString(supportedIdTypes.istexId, correctIstexIdQueryString)).toBe(true);
    expect(Module.isIdQueryString(supportedIdTypes.istexId, badIstexIdQueryString)).toBe(false);
    expect(Module.isIdQueryString(supportedIdTypes.istexId, garbageString)).toBe(false);

    expect(Module.isIdQueryString(supportedIdTypes.doi, correctDoiQueryString)).toBe(true);
    expect(Module.isIdQueryString(supportedIdTypes.doi, badDoiQueryString)).toBe(false);
    expect(Module.isIdQueryString(supportedIdTypes.doi, garbageString)).toBe(false);
  });

  it('getIdsFromIdQueryString', () => {
    const singleArkQueryString = 'arkIstex.raw:("ark:/67375/NVC-15SZV86B-F")';
    const multipleArkQueryString = 'arkIstex.raw:("ark:/67375/NVC-15SZV86B-F" "ark:/67375/NVC-XMM4B8LD-H")';

    const singleIstexIdQueryString = 'id:("59E080581FC0350BC92AD9975484E4127E8803A0")';
    const multipleIstexIdsQueryString = 'id:("59E080581FC0350BC92AD9975484E4127E8803A0" "8BCCF3BB7437DC06D22134B90DFF2F736E3C6BB9")';

    const singleDoiQueryString = 'doi.raw:("10.1007/s12291-008-0044-0")';
    const multipleDoisQueryString = 'doi.raw:("10.1007/s12291-008-0044-0" "10.1016/S0041-1345(00)01436-6")';

    expect(Module.getIdsFromIdQueryString(supportedIdTypes.ark, singleArkQueryString)).toEqual(['ark:/67375/NVC-15SZV86B-F']);
    expect(Module.getIdsFromIdQueryString(supportedIdTypes.ark, multipleArkQueryString)).toEqual(['ark:/67375/NVC-15SZV86B-F', 'ark:/67375/NVC-XMM4B8LD-H']);

    expect(Module.getIdsFromIdQueryString(supportedIdTypes.istexId, singleIstexIdQueryString)).toEqual(['59E080581FC0350BC92AD9975484E4127E8803A0']);
    expect(Module.getIdsFromIdQueryString(supportedIdTypes.istexId, multipleIstexIdsQueryString)).toEqual(['59E080581FC0350BC92AD9975484E4127E8803A0', '8BCCF3BB7437DC06D22134B90DFF2F736E3C6BB9']);

    expect(Module.getIdsFromIdQueryString(supportedIdTypes.doi, singleDoiQueryString)).toEqual(['10.1007/s12291-008-0044-0']);
    expect(Module.getIdsFromIdQueryString(supportedIdTypes.doi, multipleDoisQueryString)).toEqual(['10.1007/s12291-008-0044-0', '10.1016/S0041-1345(00)01436-6']);
  });
});
