import { Component, OnInit } from '@angular/core';

import { EventService } from '../event.service';
import { AuthService } from '../services/auth.service';

class Hist {
  id: string;
  ts: Date;
  user: string;
  start: Date;
  code: string;
}

@Component({
  selector: 'app-mytrans-list',
  templateUrl: './mytrans-list.component.html',
  styleUrls: ['./mytrans-list.component.scss']
})
export class MytransListComponent implements OnInit {
  myHistList: any[];
  displayedColumns: string[] = [ 'ts', 'user', 'start', 'code' ];

  constructor(
    public _eventServer: EventService,
    public auth: AuthService,
  ) { }

  ngOnInit(): void {
    this.auth.user$.subscribe( user => {
      // console.log("uid=", user.uid);

      this.auth.getmyhist(user.uid).then( list => {
        // console.log("got list ", list);
        this.myHistList = list.docs.map( item => {
          const data = item.data() as Hist;
          return {
            $key: item.id,
            ...data,
          }; 
        })
      });
    })
  }
  
}
