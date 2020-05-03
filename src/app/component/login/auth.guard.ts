import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree
} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../../service/auth.service';
import {Permission} from '../../model/permission.enum';

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
      if (url !== '/main' && url !== '/admin') {
        this.router.navigate([url]);
      }
      if (url === '/admin') {
        this.authService.checkPermission(Permission.AdminPanel).subscribe(allow => {
          if (allow) {
            this.router.navigate([url]);
          } else {
            this.router.navigate(['/main']);
          }
        });
      }

      return true;
    }
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    const url: string = route.path;
    return this.checkLogin(url);
  }
}
