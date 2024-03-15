export type CustomErrorInfo =
  | { name: "SyntaxError" }
  | { name: "PartialAstError" }
  | { name: "IdTypeNotSupportedError"; id: string }
  | { name: "IdsError"; count: number; lines: string }
  | { name: "CorpusFileFormatError" }
  | { name: "EmptyIdsError" }
  | { name: "FileReadError" }
  | { name: "QIdNotFoundError"; qId: string }
  | { name: "QIdSaveError"; qId: string }
  | { name: "EmptyQueryError" }
  | { name: "default" };

class CustomError extends Error {
  public readonly info: CustomErrorInfo;

  constructor(info: CustomErrorInfo) {
    super(info.name);
    this.info = info;
  }
}

export default CustomError;
