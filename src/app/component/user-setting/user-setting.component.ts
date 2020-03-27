import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../service/user-service.service';
import {EditUserDto, UserData} from '../../model/user-data';
import {Md5} from 'ts-md5';
import {MatSnackBar} from '@angular/material';

export enum UserSettingContent {
  User,
  UserAccount,
  UserCategory
}

export class UserSettingMenu {
  id: UserSettingContent;
  name: string;
}

@Component({
  selector: 'app-user-setting',
  templateUrl: './user-setting.component.html',
  styleUrls: ['./user-setting.component.scss']
})
export class UserSettingComponent implements OnInit {

  menu: UserSettingMenu[] = [
    {id: UserSettingContent.User, name: 'Данные профиля'},
    {id: UserSettingContent.UserAccount, name: 'Мои счета'},
    {id: UserSettingContent.UserCategory, name: 'Мои категории'}
  ];
  openedContent: UserSettingContent = UserSettingContent.User;
  UserSettingContent = UserSettingContent;

  userDataForm: FormGroup;
  userId: string;
  name = '';
  regDate: Date;
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
    this.getData();
  }

  ngOnInit() {
  }

  getData() {
    this.userService.getUserData().subscribe((data: UserData) => {
      if (data) {
        this.userId = data.id;
        this.name =  data.name;
        this.regDate = new Date(data.regDate);
      }
    });

    this.userDataForm = this.formBuilder.group(
      {
        username: new FormControl(this.name, null),
        currentPassword: new FormControl('', null),
        newPassword: new FormControl('', null),
        confirm: new FormControl('', null)
      }
    );
  }
  openData(id: UserSettingContent) {
    this.openedContent = id;
  }

  save() {
    if (this.userDataForm.get('newPassword').value === this.userDataForm.get('confirm').value) {
      const editData: EditUserDto = {
        name: this.userDataForm.get('username').value,
        currentPassword: Md5.hashStr(this.userDataForm.get('currentPassword').value).toString(),
        newPassword: Md5.hashStr(this.userDataForm.get('newPassword').value).toString()
      };

      this.userService.editUserData(this.userId, editData).subscribe(s => {
        const message = 'Изменения применены!';
        this.snackBar.open(message, 'Редактирование', {
          duration: 2000,
        });
        this.getData();
      }, error => {
        console.log(error);
      });
    }
  }
}
