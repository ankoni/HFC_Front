import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {AuthService} from '../../../service/auth.service';
import {MatDialog} from '@angular/material/dialog';
import {UserSettingComponent} from '../../user-setting/user-setting.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  @Input() login: string;
  account = '00.00р';
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit() {

  }

  logout() {
    this.authService.logout().subscribe(s => {
      this.authService.isAuth = false;
      console.log('logout success');
      this.router.navigate(['login']);
    }, error => {
      console.log('something was wrong');
    });
  }

  openUserSetting() {
    const dialogRef = this.dialog.open(UserSettingComponent, {
      height: '550px',
      width: '900px'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
