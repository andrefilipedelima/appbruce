import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'src/app/services/toastService';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  //loginForm: FormGroup;
  toastService: ToastService;

  constructor(private authService: AuthService, private route: ActivatedRoute, private _toastService: ToastService) { 
    console.log(this.route.queryParams);
//    this.route.queryParams.subscribe(params => {
//      console.log(params);
//      if (params && params.message) {
//        this.toastService.presentToast(params.message);
//      }
//    });

this.toastService = _toastService;

}

  ngOnInit() {

    //this.loginForm = new FormGroup({
    //  email: new FormControl('', {
    //    validators: [Validators.required, Validators.email]
    //  }),
    //  password: new FormControl('', {validators: [Validators.required]})
    //});

  }

  async onSubmit(form: NgForm){
    let login = await this.authService.login({
      email: form.value.email,
      password: form.value.password
    });

    if(!login)
      this.toastService.presentToast('Usuário ou senha inválidos');
  }



}
