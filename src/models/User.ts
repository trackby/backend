export class User {
  private _id: number;
  private _username: string;
  private _password: string;
  private _email: string;
  private _role: string;

  constructor(username: string, password: string, email: string,
              role: string = 'REGISTERED_USER', id?: number) {
    this._id = id;
    this._username = username;
    this._password = password;
    this._email = email;
    this._role = role;
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
  public get isAdmin(): boolean {
    return this._role === 'ADMIN';
  }
  public set isAdmin(isAdmin: boolean) {
    if (isAdmin) {
      this._role = 'ADMIN';
    }
  }
}
