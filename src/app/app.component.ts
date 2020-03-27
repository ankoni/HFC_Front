import {Component, OnInit} from '@angular/core';
import {AuthService} from './service/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'СУРД';
  forwardToLogin: boolean;
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authService.checkAuth().subscribe(isLogged => {
        if (!isLogged) {
          this.forwardToLogin = true;
          this.router.navigate(['login']);
        } else {
          this.router.navigate(['main']);
        }
      },
      error => {
        console.log(error);
      });
  }
}
