
import { Season } from './Season';
import { Episode } from './Episode';

export class Show {
  private _id: number;
  private _info: string;
  private _trailerUrl: string;
  private _imageUrl: string;
  private _showName: string;
  private _directorName: string;
  private _writerName: string;
  private _watched: Boolean;
  private _seasons: Season[];
  private _episodes: Episode[];
  

  constructor(id: number, name: string, info: string, trailerUrl: string, imageUrl: string, directorName: string, writerName: string) {
    this._id = id;
    this._showName = name;
    this._info = info;
    this._trailerUrl = trailerUrl;
    this._imageUrl = imageUrl;
    this._directorName = directorName;
    this._writerName = writerName;
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
  public get writer_name() {
    return this._writerName;
  }
  public set writer_name(name: string) {
    this._writerName = name;
  }
  public get director_name() {
    return this._directorName;
  }
  public set director_name(name: string) {
    this._directorName = name;
  }
  public get watched() {
    return this._watched;
  }
  public set watched(watch: Boolean) {
    this._watched = watch;
  }
  public get seasons() {
    return this._seasons;
  }
  public set seasons(seasons: Season[]) {
    this._seasons = seasons;
  }
  public get episodes() {
    return this._episodes;
  }
  public set episodes(episodes: Episode[]) {
    this._episodes = episodes;
  }
  
}
