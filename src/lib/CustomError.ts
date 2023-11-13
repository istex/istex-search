export type CustomErrorInfo =
  | { name: "SyntaxError" }
  | { name: "QIdNotFoundError"; qId: string }
  | { name: "QIdSaveError"; qId: string }
  | { name: "default" };

class CustomError extends Error {
  public readonly info: CustomErrorInfo;

  constructor(info: CustomErrorInfo) {
    super(info.name);
    this.info = info;
  }
}

export default CustomError;
