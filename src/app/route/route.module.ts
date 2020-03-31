import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from '../component/login/login.component';
import {ContentComponent} from '../component/content/content.component';
import {AppComponent} from '../app.component';
import {MenuComponent} from '../component/content/menu/menu.component';
import {FinanceTableComponent} from '../component/content/finance-table/finance-table.component';
import {AuthGuard} from '../component/login/auth.guard';

export const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'main',
  },
  {
    path: 'main',
    component: ContentComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'finance',
        component: FinanceTableComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class RouteModule { }
