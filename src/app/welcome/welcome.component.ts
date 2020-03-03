import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
  public welcome: string;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.welcome = this.activatedRoute.snapshot.paramMap.get('id');
  }

}
