import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanLoad,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlSegment
} from '@angular/router';

import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { tap, take } from 'rxjs/operators';
import { Route } from '@angular/compiler/src/core';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  private checkAuthState(redirect: string): Observable<boolean> {
    return this.authService.isAuth().pipe(
      tap(is => {
        if (!is) {
          this.router.navigate(['/login']);
        }
      })
    );
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.checkAuthState(state.url);
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> {
    const url = segments.map(s => `/${s}`).join('');

    return this.checkAuthState(url).pipe(take(1));
  }
}
