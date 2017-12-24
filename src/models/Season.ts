export class Season {
  private _info: string;
  private _trailerUrl: string;
  private _imageUrl: string;
  private _seasonNo: number;
  private _seasonYear: string;
  private _showId: number;

  constructor(no: number, info: string, trailerUrl: string, imageUrl: string, seasonYear: string, showId: number) {
    this._seasonNo = no;
    this._info = info;
    this._trailerUrl = trailerUrl;
    this._imageUrl = imageUrl;
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
  public get season_no(): number {
    return this._seasonNo;
  }
  public set season_no(no: number) {
    this._seasonNo = no;
  }
  public get season_year() {
    return this._seasonYear;
  }
  public set season_year(name: string) {
    this._seasonYear = name;
  }
  public get show_id() {
    return this._showId;
  }
  public set show_id(id: number) {
    this.show_id = id;
  }
  
}

