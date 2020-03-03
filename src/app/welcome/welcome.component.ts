import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit, OnDestroy {
  
  public welcome: string;
  isAuth = false;
  authSubscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.welcome = this.activatedRoute.snapshot.paramMap.get('id');
    this.authSubscription = this.authService.authChange.subscribe(authStatus =>{
      this.isAuth = authStatus;
    });
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }

}
