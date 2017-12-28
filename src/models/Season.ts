import { Episode } from './Episode';

export class Season {
  private _info: string;
  private _trailerUrl: string;
  private _imageUrl: string;
  private _seasonNo: number;
  private _seasonYear: number;
  private _showName: string;
  private _watched: boolean;
  private _episodes: Episode[];

  constructor(no: number, info: string, trailerUrl: string, imageUrl: string, seasonYear: number, showName: string) {
    this._seasonNo = no;
    this._info = info;
    this._trailerUrl = trailerUrl;
    this._imageUrl = imageUrl;
    this._showName = showName;
    this._seasonYear = seasonYear;
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
  public set season_year(year: number) {
    this._seasonYear = year;
  }
  public get show_name() {
    return this._showName;
  }
  public set show_name(showName: string) {
    this._showName = showName;
  }
  public get watched() {
    return this._watched;
  }
  public set watched(watch: boolean) {
    this._watched = watch;
  }
  public get episodes() {
    return this._episodes;
  }
  public set episodes(ep: Episode[]) {
    this._episodes = ep;
  }
}
