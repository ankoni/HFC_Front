import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../service/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  authIsRequired: boolean;
  userName: string;
  menu = [
    {name: 'Таблица финансов'}
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authService.checkAuth().subscribe(isLogged => {
        if (!isLogged) {
          this.router.navigate(['login']);
        } else {
          this.userName = isLogged.name;
        }
      },
      error => {
        console.log(error);
      });
  }
}
