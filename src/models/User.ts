
export class User {
    private _id: number;
    private _username: string;
    private _password: string;

    constructor(id: number, username: string, password: string) {
        this._id = id;
        this._username = username;
        this._password = password;
    }

    public get username(): string {
        return this._username;
    }
    public get id(): number {
        return this._id;
    }
    public set id(id: number) {
        this._id = id;
    }
    public get password(): string {
        return this._password;
    }
}
