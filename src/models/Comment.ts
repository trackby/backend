export class Comment {
  private _id: number;
  private _commentBody: string;
  private _userId: number;
  private _parentId: number;

  constructor(id: number, body: string, userId: number, parentId: number) {
    this._commentBody = body;
    this._id = id;
    this._userId = userId;
    this._parentId = parentId;
  }
  public get id(): number {
    return this._id;
  }
  public set id(id: number) {
    this._id = id;
  }
  public get comment_body(): string {
    return this._commentBody;
  }
  public set comment_body(body: string) {
    this._commentBody = body;
  }
  public get user_id(): number {
    return this._userId;
  }
  public set user_id(id: number) {
    this._id = id;
  }
  public get parent_id() {
    return this._parentId;
  }
  public set parent_id(id: number) {
    this._parentId = id;
  }
}
