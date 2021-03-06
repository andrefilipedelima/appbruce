import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OverlayService } from 'src/app/services/OverlayService';
import { take } from 'rxjs/operators';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  overlayService: OverlayService;

  passwordType: string = 'password';
  passwordIcon: string = 'visibility_off';

  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private _overlayService: OverlayService,
    private AppComp: AppComponent,
  ) { 
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

  }

  async onSubmit(form: NgForm){
    let login = await this.authService.login({
      email: form.value.email,
      password: form.value.password
    });

    if(!login) {
      this.overlayService.toast({ message: 'Usuário ou senha inválidos'});
    } else {
      const user = this.authService.getUser();
      if (user.displayName === null) {
        this.AppComp.salvarNomeUsuario();
      }
    }
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
