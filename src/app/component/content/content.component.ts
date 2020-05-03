import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../service/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  userName: string;


  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authService.checkAuth().subscribe(isLogged => {
        this.userName = isLogged.name;
      },
      error => {
        console.log(error);
      });
  }
}
