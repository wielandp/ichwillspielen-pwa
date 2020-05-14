import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { IEventRow, IPlatz } from '../eventRow';
import { DialogEditComponent } from '../dialog-edit/dialog-edit.component';
import { SignInComponent } from '../components/sign-in/sign-in.component';
import { Event } from '../event';
import { EventService } from '../event.service';
import { AuthService } from '../services/auth.service';
import * as Hammer from "hammerjs";
import { environment } from 'src/environments/environment';

// const price = {
//   '7': 21,  '8': 21,  '9': 21, '10': 21, '11': 21, '12': 21, '13': 21, '14': 21, '15': 21, '16': 21, '17': 21, '18': 21, '19': 21, '20': 21, '21': 21, '22': 21, '23': 21,
// '107': 18,'108': 18,'109': 18,'110': 18,'111': 18,'112': 18,'113': 18,'114': 21,'115': 21,'116': 21,'117': 26,'118': 26,'119': 26,'120': 26,'121': 18,'122': 18,'123': 18,
// '207': 18,'208': 18,'209': 18,'210': 18,'211': 18,'212': 18,'213': 18,'214': 21,'215': 21,'216': 21,'217': 26,'218': 26,'219': 26,'220': 26,'221': 18,'222': 18,'223': 18,
// '307': 18,'308': 18,'309': 18,'310': 18,'311': 18,'312': 18,'313': 18,'314': 21,'315': 21,'316': 21,'317': 26,'318': 26,'319': 26,'320': 26,'321': 18,'322': 18,'323': 18,
// '407': 18,'408': 18,'409': 18,'410': 18,'411': 18,'412': 18,'413': 18,'414': 21,'415': 21,'416': 21,'417': 26,'418': 26,'419': 26,'420': 26,'421': 18,'422': 18,'423': 18,
// '507': 18,'508': 18,'509': 18,'510': 18,'511': 18,'512': 18,'513': 18,'514': 21,'515': 21,'516': 21,'517': 26,'518': 26,'519': 26,'520': 26,'521': 18,'522': 18,'523': 18,
// '607': 21,'608': 21,'609': 21,'610': 21,'611': 21,'612': 21,'613': 21,'614': 21,'615': 21,'616': 21,'617': 21,'618': 21,'619': 21,'620': 21,'621': 21,'622': 21,'623': 21,
// };

const price = {
  '7': 21,'107': 18,'207': 18,'307': 18,'407': 18,'507': 18,'607': 21,
  '8': 21,'108': 18,'208': 18,'308': 18,'408': 18,'508': 18,'608': 21,
  '9': 21,'109': 18,'209': 18,'309': 18,'409': 18,'509': 18,'609': 21,
 '10': 21,'110': 18,'210': 18,'310': 18,'410': 18,'510': 18,'610': 21,
 '11': 21,'111': 18,'211': 18,'311': 18,'411': 18,'511': 18,'611': 21,
 '12': 21,'112': 18,'212': 18,'312': 18,'412': 18,'512': 18,'612': 21,
 '13': 21,'113': 18,'213': 18,'313': 18,'413': 18,'513': 18,'613': 21,
 '14': 21,'114': 21,'214': 21,'314': 21,'414': 21,'514': 21,'614': 21,
 '15': 21,'115': 21,'215': 21,'315': 21,'415': 21,'515': 21,'615': 21,
 '16': 21,'116': 21,'216': 21,'316': 21,'416': 21,'516': 21,'616': 21,
 '17': 21,'117': 26,'217': 26,'317': 26,'417': 26,'517': 26,'617': 21,
 '18': 21,'118': 26,'218': 26,'318': 26,'418': 26,'518': 26,'618': 21,
 '19': 21,'119': 26,'219': 26,'319': 26,'419': 26,'519': 26,'619': 21,
 '20': 21,'120': 26,'220': 26,'320': 26,'420': 26,'520': 26,'620': 21,
 '21': 21,'121': 18,'221': 18,'321': 18,'421': 18,'521': 18,'621': 21,
 '22': 21,'122': 18,'222': 18,'322': 18,'422': 18,'522': 18,'622': 21,
 '23': 21,'123': 18,'223': 18,'323': 18,'423': 18,'523': 18,'623': 21,
};

const zeroPad = (num: string | number, places: number) => String(num).padStart(places, '0')

@Component({
  selector: 'app-day-cal',
  templateUrl: './day-cal.component.html',
  styleUrls: ['./day-cal.component.scss']
})
export class DayCalComponent implements OnInit {
  displayedColumns: string[] = ['zeit', 'platz1', 'platz2', 'platz3'];
  dataSource = [];
  dataTable = [];
  isLoading = true;
  public events = [];
  eventModel: Event;
  eventModelPref: Event;
  currentHour: string;
  swipeelement: HTMLElement;
  swipemc: { on: (arg0: string, arg1: (ev: any) => void) => void; };
  backCounter: number = 0;

  constructor(
    public _eventServer: EventService,
    private _snackBar: MatSnackBar,
    public auth: AuthService,
    public dialog: MatDialog,
  ) {
    this.eventModel     = new Event(0, undefined, undefined, "", "", "", "1", 0, 0); // data from edit dialog
    this.eventModelPref = new Event(0, undefined, undefined, "", "", "", "1", 0, 0); // defaults for dialog
    // console.log("minDay="+this.minDay);
    // console.log("maxDay="+this.maxDay);
  }

  mystrip(s, la, le) {
    return s.substr(la, s.length - le - 1);
  }

  openEdit(param) {
    // console.log("openEdit id="+param.id+" typ="+param.typ+" start="+param.start, param);
    if (param.typ > 1) { return }
    let idx = this.events.findIndex((e) => e.id == param.id);
    // console.log("idx="+idx);
    // if (idx < 0) {
    //   console.log("idx not found");
    //   // if (this.events[idx].typ > 1) {
    //   //   console.log("kann nicht bearbeitet werden");
    //   //   return;
    //   // }
    // }
    // // if (param.id >= 0) { return; }  // shoud be ==

    // if (this.backCounter < 1) {
    //   window.history.pushState({}, '');
    //   this.backCounter++;
    // }

    // console.log("openEdit userid="+param.userid+" len="+window.history.length);
    // console.log("openEdit wert="+this.mystrip(param.name, 2, 4));
    let wert = +this.mystrip(param.name, 2, 4);
    let zeitend = ""+param.zeit + 1;
    if (idx >= 0) {
      zeitend = ""+this.events[idx].enddt.getHours();
    }
    // console.log("openEdit wert="+wert);
    console.log("openEdit zeit="+param.zeit+" zeitend="+zeitend);
    let ref = this.dialog.open(DialogEditComponent,
        { data: { id: param.id, 
                  datum: this._eventServer.daystring, 
                  userid: param.userid, 
                  zeit: param.zeit, 
                  zeitend: zeitend,
                  start: param.start, 
                  wert: wert, 
                  layout: this._eventServer.currentLayout,
        }
        // , height: ('550px') //this.currentLayout === 'large' ? '80vh' : '432px')    
        // , width: (this.currentLayout === 'large' ? '400px' : '370px')    
        , closeOnNavigation: true 
        },
    );
    let pref = localStorage.getItem('TKL-Halle-Pref');
    let o: any;
    if (pref) {
      o = JSON.parse(pref);
    }
    if (idx < 0) {
      if (!pref || !o) {
        ref.componentInstance.eventModel = new Event(0, undefined, undefined, "", "", "", "1", 0, wert);
      } else {
        ref.componentInstance.eventModel = new Event(0, undefined, undefined, 
          o.firstname, o.lastname,
          o.telnumber, o.typ, 0, wert);
      }
      // ref.componentInstance.eventModel = new Event(0, undefined, undefined, this.eventModelPref.firstname, this.eventModelPref.lastname,
      //       this.eventModelPref.telnumber, this.eventModelPref.typ, 0);
    } else {
      let e = this.events[idx];
      let tel = e.telnumber;
      if (pref && o.telnumber) {
        tel = o.telnumber;
      }
      ref.componentInstance.eventModel = new Event(e.id, e.start, e.end, e.firstname, e.lastname, tel, e.typ, e.userid, wert);
      // console.log("eventModel=", ref.componentInstance.eventModel);
    }

    ref.beforeClosed().subscribe(() => {
      let start: number = param.start;
      let end: number = start + 60*60;
      // console.log("beforeClosed id="+param.id+" daystring:"+this.daystring+" param.start:"+param.start+" start="+start+" userid="+param.userid);
      // console.log("ref.componentInstance.eventModel.id="+ref.componentInstance.eventModel.id);
      this.eventModel = new Event(
        ref.componentInstance.eventModel.id, 
        start, end, 
        ref.componentInstance.eventModel.firstname, 
        ref.componentInstance.eventModel.lastname, 
        ref.componentInstance.eventModel.telnumber,
        ref.componentInstance.eventModel.typ, 
        param.userid, 0
      );
      if (ref.componentInstance.eventModel.id <= 0) {
        localStorage.setItem('TKL-Halle-Pref', JSON.stringify({
              firstname: ref.componentInstance.eventModel.firstname, 
              lastname: ref.componentInstance.eventModel.lastname,
              telnumber: ref.componentInstance.eventModel.telnumber,
              typ: ref.componentInstance.eventModel.typ
        }));
        this.eventModelPref = new Event(
          0, start, end, 
          ref.componentInstance.eventModel.firstname, 
          ref.componentInstance.eventModel.lastname, 
          ref.componentInstance.eventModel.telnumber,
          ref.componentInstance.eventModel.typ, 
          param.userid, 0
        );
        // console.log("pref id="+ref.componentInstance.eventModel.id);
      }
    })
  
    ref.afterClosed().subscribe(result => {
      // console.log("close result="+result);
      if (result) {
        let o = JSON.parse(result);
        // console.log("o=", o);
        // console.log("do something firstname="+this.eventModel.firstname+" lastname="+this.eventModel.lastname
        //     +" telnumber="+this.eventModel.telnumber+" typ="+this.eventModel.typ+" userid="+this.eventModel.userid);
        if (o.save) {
          this._eventServer.saveEvent(this.eventModel, this._eventServer.oldUid).subscribe(
            data => {
              console.log("success!", data);
              this.auth.log_booking(this._eventServer.version, this._eventServer.oldUid, this._eventServer.oldEMail, this.eventModel);
              this.refresh();
            },
            error => {
              console.log("error!", error);
              this._snackBar.open("Fehler beim Speichern: "+error.error.text, "Ok");
            },
          );
        }

        // if (o.close) {
        //   // console.log("dialog close");
        //   window.history.back();
        //   this.backCounter--;          
        // }

        if (o.delete) {
            this._eventServer.deleteEvent(this.eventModel).subscribe(
            data => {
              // console.log("success!", data);
              this.refresh();
            },
            error => {
              console.log("error!", error);
              this._snackBar.open("Fehler beim Löschen: "+error.error.text, "Ok");
            },
          );
        }
        // this._snackBar.open("Buchung noch nicht implementiert !", "Ok")
      // } else {
      //   console.log("back button");
      //   this.backCounter--;          
      }
    });
  }

  onRefresh() {
    // console.log("onRefresh");
    // this.day = new Date(this.day.valueOf());
    // console.log("Day="+this.day);
    this.refresh();
  }

  onNext() {
    // console.log("onNext");
    if (this._eventServer.day < this._eventServer.maxDay) {
      this._eventServer.day = new Date(this._eventServer.day.valueOf()+24*60*60*1000);
      // console.log("Day="+this.day);
      this.refresh();
    } else {
      this._snackBar.open("Ende der Saison.", "Ok");
    }
  }

  onPrev() {
    // console.log("onPrev");
    if (this._eventServer.day > this._eventServer.minDay) {
      this._eventServer.day = new Date(this._eventServer.day.valueOf()-24*60*60*1000);
      // console.log("Day="+this.day);
      this.refresh();
    } else {
      this._snackBar.open("Anfang der Saison.", "Ok");
    }
  }

  platz(h:number, data):IPlatz[] {
    let hh = this._eventServer.day.getDay()*100+h;
    let lprice = price[hh];
    var p:IPlatz[] = [
      { name: "[ "+lprice+"€ ]", class: "platz"+lprice, id: -1, typ: "-1" },
      { name: "[ "+lprice+"€ ]", class: "platz"+lprice, id: -1, typ: "-1" },
      { name: "[ "+lprice+"€ ]", class: "platz"+lprice, id: -1, typ: "-1" },
    ];
    for (let ev of data.events) {
      if (h >= ev.startdt.getHours() && h*100 < (ev.enddt.getHours()*100+ev.enddt.getMinutes())) {
        let fn = "";
        if (ev.firstname != "") {
          fn = ", "+ev.firstname
        }
        if (ev.typ < 1) {
          p[ev.userId].id = ev.id;
          p[ev.userId].class = "platzEinzel";
        } else if (ev.typ == 1) {
          p[ev.userId].id = ev.id;
          p[ev.userId].class = "platzJugend";
        } else{
          p[ev.userId].id = 0;
          p[ev.userId].class = "platzAbo";
        }
        p[ev.userId].name = ev.lastname + fn;
        p[ev.userId].typ = ev.typ.toString();
      }
    }
    // console.log(p);
    return p;
  }

  // do not use Date.parse or constructor https://stackoverflow.com/questions/51715259/what-are-valid-date-time-strings-in-javascript/
  // safari reads utc instead of localtime
  parseDate(s:string):Date {
    // console.log("year="+s.substring(0, 4)+" mon="+s.substring(5, 7)+" day="+s.substring(8, 10)+" h="+s.substring(11, 13)+" min="+s.substring(14, 16));
    // return new Date(s);
    return new Date(parseInt(s.substring(0, 4)),    // year
                    parseInt(s.substring(5, 7)),    // month
                    parseInt(s.substring(8, 10)),   // day
                    parseInt(s.substring(11, 13)),  // hour
                    parseInt(s.substring(14, 16))   // minute
    );
  }

  parseHttp(data, ac):IEventRow[] {
    // console.log("parseHttp");
    // console.log(data);
    this.events = data.events;
    for (var ev of data.events) {
      // ev.startdt = Date.parse(ev.start);
      // ev.startdt = new Date(ev.start+this._eventServer.timeZone);
      ev.startdt = this.parseDate(ev.start);
      ev.enddt   = this.parseDate(ev.end);
      // console.log("parse start="+ev.start+" dt="+ev.startdt.toString());
      ev.userId  = ev.userId[0];
      ev.typ     = ev.typ.toString();
      // console.log(ev);
    }

    this.dataTable = [];
    for(var h:number = 7; h<23; h++) {
      let p = ac.platz(h, data);
      // console.log("httpParse zeit="+zeroPad(h, 2));
      this.dataTable.push({
        zeit: zeroPad(h, 2),
        start: this._eventServer.day.getTime()/1000 + h*60*60, 
        platz1: p[0], 
        platz2: p[1], 
        platz3: p[2]
      });
    } 
    this.dataTable.push({
      zeit: "23",
      start: 0, 
      platz1: {name: "", class: "", id: ""}, 
      platz2: {name: "", class: "", id: ""}, 
      platz3: {name: "", class: "", id: ""}
    });
  // console.log(ELEMENT_DATA);
    // console.log(this.dataTable);

    ac.isLoading = false;
    return this.dataTable;
  }

  openSignIn() {
    if (this.backCounter < 1) {
      window.history.pushState({}, '');
      this.backCounter++;
    }

    let ref = this.dialog.open(SignInComponent,
      { data: {
          layout: this._eventServer.currentLayout,
        } 
        // ,  height: '500px'
        , width: '370px'    
        , closeOnNavigation: true 
      },
    );

    ref.afterClosed().subscribe(result => {
      // console.log("close result="+result);
      if (result) {
        let o = JSON.parse(result);
 
        if (o.close) {
          // console.log("dialog close");
          window.history.back();
          this.backCounter--;          
        }
      }
    });
  }

  ngOnInit(): void {
    console.log("OnInit ", window.location.pathname);
    if (window.location.pathname === "/"+environment.basehref+"login") {
      setTimeout(() => { this.openSignIn() }, 1000);
    }

    this.refresh();

    this.swipeelement = window.document.getElementById('mytable');
    this.swipemc = new Hammer(this.swipeelement);
    let fObj = this;
    this.swipemc.on("swipeleft swiperight", function(ev) {
      if (ev.type == "swipeleft") {
        fObj.onNext();
      } else {
        fObj.onPrev();
      }
      console.log(ev.type +" gesture detected.");
    });
    // console.log("element=", this.swipeelement);
  }

  refresh() {
    this.isLoading = true;

    let pref = localStorage.getItem('TKL-Halle-Layout');
    let o: any;
    if (pref) {
      o = JSON.parse(pref);
      // console.log("refresh layout=", o);
      this._eventServer.currentLayout = o.layout;
    }

    this._eventServer.day.setHours(0,0,0,0);
    if (this._eventServer.day.getTime() == new Date().setHours(0,0,0,0)) {
      this.currentHour = zeroPad((new Date().getHours()-1).toString(),2);
    } else {
      this.currentHour = "";
    }
    // this.dataSource = ELEMENT_DATA;
    this._eventServer.setDayString();
    // console.log("call getEvents with "+this.day);
    this._eventServer.getEvents(this._eventServer.day)
      .subscribe(
        data => {
          this.dataSource = this.parseHttp(data, this);
          // console.log("loaded "+this.dataSource.length);
          setTimeout( () => {
              let el = window.document.querySelector(".mat-row-current");
              // console.log("el = ", el);
              if (el) {
                el.scrollIntoView();
              }
              el = window.document.querySelector(".toolbar");
              // console.log("el = ", el);
              if (el) {
                el.scrollIntoView();
              }
          }, 100);
        },
        error => {
          console.log("error!", error);
          this._snackBar.open("Fehler beim Laden", "Ok");
          this.isLoading = false;
        },
      );
  }
}