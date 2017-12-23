export class Reaction {
  private _id: number;
  private _reactionType: string;
  private _userId: number;

  constructor(id: number, reactionType: string, userId: number) {
    this._id = id;
    this._reactionType = reactionType;
    this._userId = userId;
  }
  public get id(): number {
    return this._id;
  }
  public set id(id: number) {
    this._id = id;
  }
  public get reaction_type(): string {
    return this._reactionType;
  }
  public set reaction_type(type: string) {
    this._reactionType = type;
  }
  public get user_id(): number {
    return this._userId;
  }
  public set user_id(id: number) {
    this._id = id;
  }
}
