export class Show {
	private _id: number;
	private _info: string;
	private _trailerUrl: string;
	private _imageUrl: string;
	private _showName: string;

	constructor(id: number, name: string, info: string, trailerUrl: string, imageUrl: string) {
		this._id = id;
		this._showName = name;
		this._info = info;
		this._trailerUrl = trailerUrl;
		this._imageUrl = imageUrl;
	}

	public get id(): number {
		return this._id;
	}
	public set id(id: number) {
		this._id = id;
	}
	public get info(): string {
		return this._info;
	}
	public set info(info: string) {
		this._info = info;
	}
	public get trailer_url(): string {
		return this._trailerUrl;
	}
	public set trailer_url(url: string) {
		this._trailerUrl = url;
	}
	public get image_url(): string {
		return this._imageUrl;
	}
	public set image_url(url: string) {
		this._imageUrl = url;
	}
	public get show_name(): string {
		return this._showName;
	}
	public set show_name(name: string) {
		this._showName = name;
	}
}
