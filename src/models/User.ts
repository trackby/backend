export class User {
	private _id: number;
	private _username: string;
	private _password: string;
	private _email: string;
	private _age: number;
	private _isAdmin: boolean;

	constructor(username: string, password: string, email: string, age: number, isAdmin: boolean = false, id?: number) {
		this._id = id;
		this._username = username;
		this._password = password;
		this._age = age;
		this._email = email;
		this._isAdmin = isAdmin;
	}

	public get id(): number {
		return this._id;
	}
	public set id(id: number) {
		this._id = id;
	}
	public get username(): string {
		return this._username;
	}
	public set username(username: string) {
		this._username = username;
	}
	public get password(): string {
		return this._password;
	}
	public set password(password: string) {
		this._password = password;
	}
	public get email(): string {
		return this._email;
	}
	public set email(email: string) {
		this._email = email;
	}
	public get age(): number {
		return this._age;
	}
	public set age(age: number) {
		this._age = age;
	}
	public get isAdmin(): boolean {
		return this._isAdmin;
	}
	public set isAdmin(isAdmin: boolean) {
		this._isAdmin = isAdmin;
	}
}
