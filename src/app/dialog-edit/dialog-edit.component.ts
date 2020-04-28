import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';

import { Event } from "../event";
import { EventService } from '../event.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dialog-edit',
  templateUrl: './dialog-edit.component.html',
  styleUrls: ['./dialog-edit.component.scss']
})
export class DialogEditComponent implements OnInit {
  public eventModel: Event;
  neueBuchung:boolean;
  codes: any;
  currentLayout: string;
  
  constructor(
    public _eventServer: EventService,
    private _snackBar: MatSnackBar,
    public auth: AuthService,
    private _clipboard: Clipboard,
    public dialogRef: MatDialogRef<DialogEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.codes = this.auth.codes();
    // this.currentLayout = data.layout;
    console.log("edit layout="+data.layout+" zeitend="+data.zeitend);
   }

  ngOnInit() {
    this.neueBuchung = this.eventModel.id <= 0;
  }

  pay(wert:number, uid:string) {
    // console.log("pay wert="+wert+ "uid="+uid);
    this.auth.pay(wert, uid).then( code => {
      if (code.length > 0) {
        // console.log("pay code=", code[0].get('code'));
        this.eventModel.telnumber = code[0].get('code');
        this._clipboard.copy(code[0].get('name')+" "+code[0].get('code'));
        console.log("copy to clip: "+code[0].get('name')+" "+code[0].get('code'));
        this._snackBar.open("Code "+code[0].get('name')+" mit Wert "+wert+" € gekauft.", "Ok");
      } else {
        console.log("pay kein code mit wert "+wert+" mehr vorhanden.");
        this._snackBar.open("Kein Code mit Wert "+wert+" €  mehr vorhanden.", "Ok");
      }
    });
  }

  clearFirstnameField() {
    this.eventModel.firstname = "";
  }

  clearLastnameField() {
    this.eventModel.lastname = "";
  }

  clearTelnumberField() {
    this.eventModel.telnumber = "";
  }

  parseInt(s:string):number { return parseInt(s); }

  onDelete() {
    console.log("delete");
    this.dialogRef.close('{ "delete": 1}');
  }

  onSubmit() {
    console.log("submit");
    this.dialogRef.close('{ "save": 1}');
  }

}