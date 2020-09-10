import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from "@angular/common/http";
import { IEvent } from "./event";
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from './services/auth.service';
import { Event } from './event';

const href = 'https://www.tklhalle.de/cal.php';
const _wc: boolean = true;

const weekday:string[] = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

const zeroPad = (num: string | number, places: number) => String(num).padStart(places, '0')
  
const _setDayString = (day) =>
  weekday[day.getDay()] + " " + zeroPad(day.getDate(),2) + "."
    + zeroPad(day.getMonth()+1,2) + "." + day.getFullYear();

@Injectable({
  providedIn: 'root'
})
export class EventService { 
  public isAdmin: boolean = false;
  public minDay: Date = new Date("2020-09-28");
  public maxDay: Date = new Date("2021-04-04");
  public day: Date;
  public daystring: String;
  public oldUid: string = "";
  public oldEMail: string = "";
  public currentLayout: string;
  public version: string = "0.4.3";
  public neueVersion: boolean = false;
  public curVersion: boolean = false;
  // public timeZone: string;

  constructor(
    private http: HttpClient,
    public auth: AuthService,
  ) {
    this.day = new Date();          // beginne mit heute
    if (this.day > this.maxDay) {   // wenn Saison schon zu Ende ist, dann letzter Tag
      this.day = new Date(this.maxDay);
    } else if (this.day < this.minDay) {  // wenn noch nicht angefangen, erster Tag
      this.day = new Date(this.minDay);
    }
               // new Date(Date.now()-155*24*60*60*1000);   // tomorrow (+1 day)
    this.daystring = _setDayString(this.day);
    console.log("Day="+this.day);
    
    this.auth.getAllCfg().then( cfg => {
      this.minDay = new Date(cfg.get("mindate"));
      this.maxDay = new Date(cfg.get("maxdate"));
      this.minDay.setHours(0,0,0,0);
      this.maxDay.setHours(0,0,0,0);
      console.log("minDay=", this.minDay);
      console.log("maxDay=", this.maxDay);

      if (this.day > this.maxDay) {   // wenn Saison schon zu Ende ist, dann letzter Tag
        this.day = new Date(this.maxDay);
      } else if (this.day < this.minDay) {  // wenn noch nicht angefangen, erster Tag
        this.day = new Date(this.minDay);
      }
  
      console.log("version="+this.version+ " minversion="+cfg.get("minversion")+" curVersion="+cfg.get("curversion"));
      if (this.version < cfg.get("minversion")) {
        console.log("neue Version muss installiert werden !!!");
        this.neueVersion = true;
      }
      if (this.version < cfg.get("curversion")) {
        console.log("neue Version verfügbar !");
        this.curVersion = true;
      }
    }, reason => {
      console.log("cfg error ", reason);
    });
  }

  setDayString() {
    this.daystring = _setDayString(this.day);
  }

  getEvents(day: Date): Observable<IEvent[]> {
    let _start = Math.round(day.valueOf()/1000);
    let _end   = _start + 24*60*60;
    // this.timeZone = ".000"+day.toTimeString().substring(12, 17);
    // console.log("timeZone="+this.timeZone);
    const params = new HttpParams()
      .set('start', _start.toString())
      .set('end', _end.toString());
    // let url:string = `${href}?action=get_events&start=1582239600&end=1582326000`;
    let url:string = `${href}?action=get_events`;  // &start=${start}&end=${end}
    // console.log("url="+url);
    return this.http.get<IEvent[]>(url, {params, withCredentials: _wc })
        .pipe(catchError(this.errorHandler));
  }

  saveEvent(ev: Event, uid: string) {
    console.log("saveEvent id="+ev.id);
    let tn = ev.telnumber;
    if (tn === '') { tn = 'pwa'; } 
    const params = new HttpParams()
      .set('action'   , "save")
      .set('id'       , ev.id.toString())
      .set('start'    , ev.start.toString())
      .set('end'      , ev.end.toString())
      .set('firstname', ev.firstname)
      .set('lastname' , ev.lastname)
      .set('telnumber', tn)
      .set('typ'      , ev.typ)
      .set('uid'      , ev.userid.toString())
      .set('body'     , 'ngFB:'+uid)
      ;
    // let url:string = `${href}?action=save&`;
    // console.log("url="+href+"?"+params.toString());
    // return this.http.post<string>(href, {params})
    //     .pipe(catchError(this.errorHandler));
    return this.http.request<string>("POST", href, { params: params, withCredentials: _wc })
        .pipe(catchError(this.errorHandler));
  }

  deleteEvent(ev: Event) {
    console.log("deleteEvent id="+ev.id);
    const params = new HttpParams()
      .set('action'   , "delete")
      .set('id'       , ev.id.toString())
      .set('telnumber', ev.telnumber)
      .set('typ'      , ev.typ)
    ;
    // console.log("url="+href+"?"+params.toString());
    return this.http.request<string>("POST", href, { params, withCredentials: _wc })
        .pipe(catchError(this.errorHandler));
  }

  login(un:string, pw:string) {
    // console.log("login with "+un+" "+pw);
    const params = new HttpParams()
      .set('action'   , "login")
      .set('uid'      , un)
      .set('pwd'      , pw)
    ;
    // console.log("url="+href+"?"+params.toString());
    // console.log("http=", this.http)
    return this.http.get<string>(href, {params, withCredentials: _wc })
        .pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error);
  }
}
