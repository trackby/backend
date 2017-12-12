export class Error {
    private errCode: number;
    private errMsg: string;
    constructor(
        errCode: number,
        errMsg: string,
    ) {
        this.errCode = errCode;
        this.errMsg = errMsg;
    }
}
