import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CovalentLayoutModule } from '@covalent/core/layout';
import { CovalentStepsModule  } from '@covalent/core/steps';
import { LoginComponent } from './component/login/login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatDialogModule,
  MatIconModule,
  MatTooltipModule,
  MatMenuModule,
  MatSidenavModule,
  MatListModule,
  MatToolbarModule,
  MatSnackBarModule,
  MatSnackBar,
  MatTableModule,
  MatTreeModule,
  MatPaginatorModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MAT_FORM_FIELD_DEFAULT_OPTIONS, MAT_DATE_FORMATS
} from '@angular/material';
import {Md5} from 'ts-md5';
import { MenuComponent } from './component/content/menu/menu.component';
import { ContentComponent } from './component/content/content.component';

import { HttpClientModule } from '@angular/common/http';
import { RegistrationFormComponent } from './component/login/registration-form/registration-form.component';
import {Router, RouterModule} from '@angular/router';
import {appRoutes, RouteModule} from './route/route.module';
import {APP_BASE_HREF, HashLocationStrategy, LocationStrategy} from '@angular/common';
import { UserSettingComponent } from './component/user-setting/user-setting.component';
import { UserAccountSettingComponent } from './component/user-setting/user-account-setting/user-account-setting.component';
import { ConfirmDialogComponent } from './component/dialog/confirm-dialog/confirm-dialog.component';
import { UserCategorySettingComponent } from './component/user-setting/user-category-setting/user-category-setting.component';
import { FinanceTableComponent } from './component/content/finance-table/finance-table.component';
import {AuthGuard} from './component/login/auth.guard';
import { CreateFinanceRecordDialogComponent } from './component/dialog/create-finance-record-dialog/create-finance-record-dialog.component';
export const DATE_FORMAT = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MenuComponent,
    ContentComponent,
    RegistrationFormComponent,
    UserSettingComponent,
    UserAccountSettingComponent,
    ConfirmDialogComponent,
    UserCategorySettingComponent,
    FinanceTableComponent,
    CreateFinanceRecordDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CovalentLayoutModule,
    CovalentStepsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDialogModule,
    RouterModule.forRoot(appRoutes),
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatTableModule,
    MatTreeModule,
    MatPaginatorModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    Md5,
    MatSnackBar,
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    AuthGuard,
    MatDatepickerModule,
    {provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT}
  ],
  bootstrap: [AppComponent],
  entryComponents:
  [
    RegistrationFormComponent,
    UserSettingComponent,
    ConfirmDialogComponent,
    CreateFinanceRecordDialogComponent
  ]
})
export class AppModule {

}
