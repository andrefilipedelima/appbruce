import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {


  //@ViewChild(MatMenuTrigger, {static: true}) trigger: MatMenuTrigger;

  constructor() { }

  ngOnInit() {}

  onSubmit(form: NgForm){
    console.log(form);
  }

  

  /* someMethod() {
    this.trigger.openMenu();
  } */


}
