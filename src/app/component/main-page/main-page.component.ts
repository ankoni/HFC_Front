import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html'
})
export class MainPageComponent implements OnInit {
  menu = [
    {name: 'Таблица финансов', link: 'finance'}
  ];
  constructor() { }

  ngOnInit() {
  }

}
