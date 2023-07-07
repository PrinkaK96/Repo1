import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  _isRefesh: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }
  refreshFooter(data: any) {
    this._isRefesh = data;
  }
}
