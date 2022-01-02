import { Component, OnInit } from '@angular/core';

import { EventService } from '../event.service';
import { AuthService } from '../services/auth.service';

class Code {
  id: string;
  ts: Date;
  name: string;
  code: string;
  paid: boolean;
}

@Component({
  selector: 'app-codes-list',
  templateUrl: './codes-list.component.html',
  styleUrls: ['./codes-list.component.scss']
})
export class CodesListComponent implements OnInit {
  codesList: any[];
  displayedColumns: string[] = [ 'name', 'code', 'paid', 'ts' ];

  constructor(
    public _eventServer: EventService,
    public auth: AuthService,
  ) { }

  ngOnInit(): void {
    this.auth.user$.subscribe( user => {
      // console.log("uid=", user.uid);

      this.auth.getmyCodes(user.uid).then( list => {
        // console.log("got list ", list);
        this.codesList = list.docs.map( item => {
          const data = item.data() as Code;
          return {
            $key: item.id,
            ...data,
          }; 
        })
      });
    })
  }

}
