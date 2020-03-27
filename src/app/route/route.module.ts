import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from '../component/login/login.component';
import {ContentComponent} from '../component/content/content.component';
import {AppComponent} from '../app.component';
import {MenuComponent} from '../component/content/menu/menu.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: AppComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'main',
    component: ContentComponent
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
