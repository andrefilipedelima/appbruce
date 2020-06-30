import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OverlayService } from 'src/app/services/OverlayService';
import { take } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';

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

  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private _overlayService: OverlayService,
    public alertCtrl: AlertController
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

    if(!login) {
      this.overlayService.toast({ message: 'Usuário ou senha inválidos'});
    } else {
      const user = this.authService.getUser();
      if (user.displayName === null) {
        this.salvarNomeUsuario();
      }
    }
  }

  async salvarNomeUsuario() {
    let alert = await this.alertCtrl.create({
      header: 'Olá',
      subHeader: 'Bem vindo ao App Bruce!',
      message: 'Como gostaria de ser chamado?',
      inputs: [
        {
          name: 'nome',
          type: 'text',
          placeholder: 'Digite aqui seu nome...'
        },
      ],
      buttons: [
        {
          text: 'Salvar',
          handler: data => {
            if (data.nome.length > 0) {
              this.authService.setUserName(data.nome);
            }
          }
        },
      ]
    });
    await alert.present();
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
