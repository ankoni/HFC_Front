import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {MatDialogConfig, MatRowDef, MatSnackBar, MatTable} from '@angular/material';
import {$e} from 'codelyzer/angular/styles/chars';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AccountService} from '../../../service/account.service';
import {UserSettingComponent} from '../user-setting.component';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../dialog/confirm-dialog/confirm-dialog.component';

export class UserAccountTableData {
  id: string;
  name: string;
  balance: number;
  update: string;
  create: string;
  newRow?: boolean;
}

@Component({
  selector: 'app-user-account-setting',
  templateUrl: './user-account-setting.component.html',
  styleUrls: ['./user-account-setting.component.scss']
})
export class UserAccountSettingComponent implements OnInit {

  @ViewChild('matTable', {static: false}) table;
  @Input() userId: string;
  constructor(
    private formBuilder: FormBuilder,
    protected accountService: AccountService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
    ) {
  }

  userAccountTable: UserAccountTableData[] = [];
  displayedColumns: string[] = ['name', 'balance', 'update', 'create', 'delete'];
  isChanged: boolean;

  ngOnInit() {
    this.accountService.getAccountsByUserId().subscribe((data: UserAccountTableData[]) => {
      this.userAccountTable  = data;
    }, error => {
      console.log(error.message);
    });
  }

  addNewRow() {
    this.userAccountTable.push({
      id: '',
      name: '',
      balance: null,
      update: '',
      create: '',
      newRow: true
    });
    this.table.renderRows();
  }

  deleteAccount(element: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      height: '200px',
      data: {
        message: 'Вы уверены?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userAccountTable.splice(this.userAccountTable.indexOf(element), 1);
        this.table.renderRows();
        if (!element.newRow) {
          this.isChanged = true;
        }
      }
    });
  }

  changeInputRow($event, element: any) {
    switch ($event.target.name) {
      case 'name':
        element.name = $event.target.value;
        break;
      case 'balance':
        element.balance = $event.target.value;
        break;
    }
    if (element.newRow) {
      this.isChanged = true;
    }
  }

  save() {
    this.accountService.updateUsersAccounts(this.userId, this.userAccountTable).subscribe((data: UserAccountTableData[]) => {
      this.snackBar.open('Данные успешно изменены', 'Счета', {
        duration: 2000,
      });
      this.userAccountTable = data;
      this.isChanged = false;
      this.table.renderRows();
    }, error => {
      console.log(error.message);
    });
  }

}
