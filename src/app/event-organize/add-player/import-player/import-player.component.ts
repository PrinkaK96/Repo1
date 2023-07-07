import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'stupa-import-player',
  templateUrl: './import-player.component.html',
  styleUrls: ['./import-player.component.scss']
})
export class ImportPlayerComponent implements OnInit {

  _playerArray = [
    {
      name: 'Divyanshu',
      role: 'Umpire',
      state: 'Delhi',
      email: 'xyz@yopmail.com',
      payment: 'Cash',
      verification: 'Not Verified',
    },
    {
      name: 'Divyanshu',
      role: 'Umpire',
      state: 'Delhi',
      email: 'xyz@yopmail.com',
      payment: 'Unpaid',
      verification: 'Verified',
    },
    {
      name: 'Divyanshu',
      role: 'Umpire',
      state: 'Delhi',
      email: 'xyz@yopmail.com',
      payment: 'Online',
      verification: 'Verified',
    },
    {
      name: 'Divyanshu',
      role: 'Umpire',
      state: 'Delhi',
      email: 'xyz@yopmail.com',
      payment: 'Unpaid',
      verification: 'Verified',
    },
    {
      name: 'Divyanshu',
      role: 'Umpire',
      state: 'Delhi',
      email: 'xyz@yopmail.com',
      payment: 'Cash',
      verification: 'Verified',
    },
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
