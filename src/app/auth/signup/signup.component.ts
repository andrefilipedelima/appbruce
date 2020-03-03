import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {

  maxDate;
  minDate;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear()-12);
    

    this.minDate = new Date();
    this.minDate.setFullYear(this.minDate.getFullYear()-120);
    
  }

  onSubmit(form: NgForm){
      this.authService.registerUser({
        email: form.value.email,
        password: form.value.password
      });
  }

}
