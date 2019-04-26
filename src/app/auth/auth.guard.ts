import { AuthService } from './../services/auth/auth.service';
import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

/**
 * CanActivate interface mehet, akkor ha nem lazy loadingosak a modulok
 * Ha lazy loadingot alkalmazunk akkor CanLoad interface kell
 */
export class AuthGuard implements CanLoad  {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  canLoad(
    route: import('@angular/router').Route,
    segments: import('@angular/router').UrlSegment[]): boolean | Observable<boolean> | Promise<boolean> {
      if (!this.authService.userIsAuthenticated) {
        this.router.navigateByUrl('/auth');
      }
      return this.authService.userIsAuthenticated;
  }
}
