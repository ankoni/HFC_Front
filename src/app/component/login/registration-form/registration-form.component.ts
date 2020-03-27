import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {FieldForm} from '../../common/field-form';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {AuthService} from '../../../service/auth.service';
import {UserService} from '../../../service/user-service.service';
import {UserData, UserRegDto} from '../../../model/user-data';
import {Md5} from 'ts-md5';
import {Router} from '@angular/router';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss']
})
export class RegistrationFormComponent implements OnInit {
  registrationForm: FormGroup;
  loginReg = new FormControl('', Validators.required);
  passwordReg = new FormControl('', Validators.required);
  confirmPassword = new FormControl('', Validators.required);
  hidePassword = true;
  errorMessage: string;
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<RegistrationFormComponent>,
    public userService: UserService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    protected router: Router
  ) {
    this.registrationForm = this.formBuilder.group(
      {
        loginReg: this.loginReg,
        passwordReg: this.passwordReg,
        confirmPassword: this.confirmPassword
      }
    );
  }

  ngOnInit() {
  }

  accept() {
    if (this.registrationForm.get('passwordReg').value === this.registrationForm.get('confirmPassword').value) {
      const newUser: UserRegDto = {
        name: this.registrationForm.get('loginReg').value,
        password: Md5.hashStr(this.registrationForm.get('passwordReg').value).toString()
      };
      this.userService.registration(newUser).subscribe(data => {
        const message = 'Успешно';
        this.snackBar.open(message, 'Регистрация', {
          duration: 2000,
        });
        this.authService.setAuth(data).subscribe(resp => {
          this.router.navigate(['main']);
          this.dialogRef.close();
        }, error => {
          this.errorMessage = 'Произошла ошибка';
        });
      }, error => {
        this.errorMessage = 'Пользователь с таким логином уже существует';
      });
    } else {
      this.errorMessage = 'Пароли не совпадают!';
    }
  }
}
