export class Episode {
  private _info: string;
  private _trailerUrl: string;
  private _imageUrl: string;
  private _episodeNo: number;
  private _seasonNo: number;
  private _showName: string;
  private _episodeName: string;
  private _watched: boolean;

  constructor(no: number, name: string, info: string, trailerUrl: string, imageUrl: string, episodeName: string,
              seasonNo: number, showName: string) {
    this._episodeNo = no;
    this._episodeName = episodeName;
    this._info = info;
    this._trailerUrl = trailerUrl;
    this._imageUrl = imageUrl;
    this._seasonNo = seasonNo;
    this._episodeName = episodeName;
    this._showName = showName;
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
  public get episode_no(): number {
    return this._episodeNo;
  }
  public set episode_no(no: number) {
    this._episodeNo = no;
  }
  public get season_no() {
    return this._seasonNo;
  }
  public set season_no(id: number) {
    this._seasonNo = id;
  }
  public get episode_name() {
    return this._episodeName;
  }
  public set episode_name(name: string) {
    this._episodeName = name;
  }
  public get show_name() {
    return this._showName;
  }
  public set show_name(name: string) {
    this._showName = name;
  }
  public get watched() {
    return this._watched;
  }
  public set watched(watch: boolean) {
    this._watched = watch;
  }
}
