import {Component, Input, NgModule, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {Md5} from 'ts-md5';
import {AuthService} from '../../service/auth.service';
import {RegistrationFormComponent} from './registration-form/registration-form.component';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {ActivatedRoute, ParamMap, Router, RouterModule} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {utf8Encode} from '@angular/compiler/src/util';

export class AuthData {
  login: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit, OnChanges {

  @Input() url;
  loginForm: FormGroup;
  login = new FormControl('', Validators.required);
  password = new FormControl('', Validators.required);

  errorMessage: string;
  hide = true;
  constructor(
    private formBuilder: FormBuilder,
    protected router: Router,
    private route: ActivatedRoute,
    public authService: AuthService,
    public dialog: MatDialog
  ) {
    this.loginForm = this.formBuilder.group(
      {
        login: this.login,
        password: this.password
      }
    );
    this.url = this.route.snapshot.params.url;
    if (this.authService.isAuth) {
      this.router.navigate([this.url ? this.url : '']);
    }
  }

  ngOnInit() {
    this.authService.checkAuth().subscribe(isLogged => {
        if (isLogged) {
          this.authService.isAuth = true;
          this.router.navigate([this.url]);
        }
    }, error => {
      console.log(error);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  submitForm(form: FormGroup) {
    if (form.valid) {
      const authData: AuthData = {
        login: form.value.login,
        password: Md5.hashStr(form.value.password).toString()
      };
      this.authService.setAuth(authData).subscribe(str => {
        this.authService.isAuth = true;
        this.router.navigate([this.url ? this.url : '']);
      }, error => {
        this.errorMessage = error.error.text;
      });
    }
  }

  openRegistrationForm() {
    const dialogRef = this.dialog.open(RegistrationFormComponent, {
      height: '400px',
      width: '600px'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  changeValues() {
    if (this.errorMessage) {
      this.errorMessage = null;
    }
  }
}
