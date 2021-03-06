import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  constructor(private authService: AuthService) { }

  email: string;

  ngOnInit() {
  }
  
  onSubmit(form: NgForm) {
    this.authService.reset({
    email: form.value.email
    });
    this.email = "";
  }

}
