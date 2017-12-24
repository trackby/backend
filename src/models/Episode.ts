export class Episode {
  private _info: string;
  private _trailerUrl: string;
  private _imageUrl: string;
  private _episodeNo: number;
  private _seasonId: number;
  private _showId: number;
  

  constructor(no: number, info: string, trailerUrl: string, imageUrl: string, seasonId: number, showId: number) {
    this._episodeNo = no;
    this._info = info;
    this._trailerUrl = trailerUrl;
    this._imageUrl = imageUrl;
    this._seasonId = seasonId;
    this._showId = showId;
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
  public get season_id() {
    return this._seasonId;
  }
  public set season_id(id: number) {
    this._seasonId = id;
  }
  public get show_id() {
    return this._showId;
  }
  public set show_id(id: number) {
    this._showId = id;
  }

}

