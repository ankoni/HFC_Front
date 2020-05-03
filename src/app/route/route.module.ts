import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from '../component/login/login.component';
import {ContentComponent} from '../component/content/content.component';
import {AppComponent} from '../app.component';
import {MenuComponent} from '../component/content/menu/menu.component';
import {FinanceTableComponent} from '../component/content/finance-table/finance-table.component';
import {AuthGuard} from '../component/login/auth.guard';
import {AdminComponent} from '../component/admin/admin.component';
import {MainPageComponent} from '../component/main-page/main-page.component';
import {UserListComponent} from '../component/admin/user-list/user-list.component';

export const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full'
  },
  {
    path: 'main',
    component: ContentComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: MainPageComponent,
        children: [
          {
            path: 'finance',
            component: FinanceTableComponent
          }
        ]
      }
    ]
  },
  {
    path: 'admin',
    component: ContentComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: AdminComponent,
        children: [
          {
            path: 'users',
            component: UserListComponent
          }
        ]
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
