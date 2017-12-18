export class ShowComment {
	/*show_comment table */
	private _id: number;
	private _showId: number;
	private _commentId: number;

	constructor(id: number, showId: number, commentId: number) {
		this._id = id;
		this._showId = showId;
		this._commentId = commentId;
	}

	public get id(): number {
		return this._id;
	}
	public set id(id: number) {
		this._id = id;
	}
	public get show_id(): number {
		return this._showId;
	}
	public set show_id(id: number) {
		this._showId = id;
	}
	public get comment_id(): number {
		return this._commentId;
	}
	public set comment_id(id: number) {
		this._commentId = id;
	}
}
