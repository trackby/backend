export class Error {
  private errorCode: number;
  private errorMessage: string;

  constructor(errorCode: number, errorMessage: string) {
    this.errorCode = errorCode;
    this.errorMessage = errorMessage;
  }
}
