import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ActivatedRoute } from '@angular/router';
import { OverlayService } from 'src/app/services/OverlayService';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  //loginForm: FormGroup;
  overlayService: OverlayService;

  constructor(private authService: AuthService, private route: ActivatedRoute, private _overlayService: OverlayService) { 
    console.log(this.route.queryParams);
//    this.route.queryParams.subscribe(params => {
//      console.log(params);
//      if (params && params.message) {
//        this.toastService.presentToast(params.message);
//      }
//    });

this.overlayService = _overlayService;

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
      this.overlayService.toast({ message: 'Usuário ou senha inválidos'});
  }



}
