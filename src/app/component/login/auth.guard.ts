import { Injectable } from '@angular/core';
import {
  CanLoad,
  Route,
  UrlSegment,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
  NavigationExtras,
  CanActivate, CanActivateChild
} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from '../../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const url: string = state.url;

    if (!this.authService.isAuth) {
      this.router.navigate(['login', {url}]);
    }
    return this.authService.isAuth;
  }

  checkLogin(url: string) {
    if (this.authService.isAuth) {
      return true;
    }
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const url: string = state.url;
    if (this.checkLogin(url)) {
      if (url !== '/main') {
        this.router.navigate([url]);
      }

      return true;
    }
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    const url: string = route.path;
    return this.checkLogin(url);
  }
}
