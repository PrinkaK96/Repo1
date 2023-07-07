import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'stupa-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
  _history = [
    { name: 'SAmple name12',from:'Category name sample 123' ,moveto:'Category name sample 123'},
    { name: 'SAmple name12',from:'Category name sample 123' ,moveto:'Category name sample 123'},
    { name: 'SAmple name12',from:'Category name sample 123' ,moveto:'Category name sample 123'},
];
_category=[
  { name: 'Category 1',from:'Category 4' ,moveto:'Category 1'},
    { name: 'Category 2',from:'Category 5 ' ,moveto:'Category 2'},
    { name: 'Category 3',from:'Category 6' ,moveto:'Category 3'},
];

  constructor() {}

  ngOnInit(): void {}
}
