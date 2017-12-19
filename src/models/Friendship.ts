
type FriendshipStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export class Friendship {
  private _firstUserId: number;
  private _secondUserId: number;
  private _status: FriendshipStatus;
  private _actionUserId: number;

  constructor(firstUserId: number, secondUserId: number, status: FriendshipStatus = 'PENDING', actionUserId: number) {
    this._firstUserId = firstUserId;
    this._secondUserId = secondUserId;
    this._status = status;
    this._actionUserId = actionUserId;
  }

  public get firstUserId(): number {
    return this._firstUserId;
  }

  public set firstUserId(id: number) {
    this._firstUserId = id;
  }

  public get secondUserId(): number {
    return this._secondUserId;
  }

  public set secondUserId(id: number) {
    this._secondUserId = id;
  }

  public get status(): FriendshipStatus {
    return this._status;
  }

  public set status(status: FriendshipStatus) {
    this._status = status;
  }

  public get actionUserId(): number {
    return this._actionUserId;
  }

  public set actionUserId(id: number) {
    this._actionUserId = id;
  }

}
