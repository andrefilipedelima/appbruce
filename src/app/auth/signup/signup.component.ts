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

  passwordType: string = 'password';
  passwordTypeConfirm: string = 'password';
  passwordIcon: string = 'visibility_off';
  passwordIconConfirm: string = 'visibility_off';

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

  mostraOcultaSenha(senha) {

    if (senha === 'password') {
      this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
  
      if (this.passwordType === 'text') {
        this.passwordIcon = 'visibility';
      } else {
        this.passwordIcon = 'visibility_off';
      }
    }

    if (senha === 'passwordConfirm') {
      this.passwordTypeConfirm = this.passwordTypeConfirm === 'text' ? 'password' : 'text';
  
      if (this.passwordTypeConfirm === 'text') {
        this.passwordIconConfirm = 'visibility';
      } else {
        this.passwordIconConfirm = 'visibility_off';
      }
    }


  }


}
