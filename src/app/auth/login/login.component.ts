import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OverlayService } from 'src/app/services/OverlayService';
import { table } from 'console';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  //loginForm: FormGroup;
  overlayService: OverlayService;

  passwordType: string = 'password';
  passwordIcon: string = 'visibility_off';

  constructor(private router: Router, private authService: AuthService, private route: ActivatedRoute, private _overlayService: OverlayService) { 
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
    this.authService.isAuth().pipe(take(1)).subscribe(user =>{
      if(user){
        this.router.navigate(['/welcome/filmes']);
      }
    })
      

    const criacaoConta = this.route.snapshot.paramMap.get("contacriada");
    
    if(criacaoConta !== undefined && criacaoConta == "true") {
     this._overlayService.toast({message:"Conta criada, por favor verifique o seu e-mail para ativar a conta!"}); 
    }

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

  mostraOcultaSenha() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';

    if (this.passwordType === 'text') {
      this.passwordIcon = 'visibility';
    } else {
      this.passwordIcon = 'visibility_off';
    }
  }

}
