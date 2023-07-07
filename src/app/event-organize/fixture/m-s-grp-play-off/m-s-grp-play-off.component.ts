import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { ArrangeDialogComponent } from './arrange-dialog/arrange-dialog.component';

@Component({
  selector: 'stupa-m-s-grp-play-off',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    DropdownModule,
    CalendarModule,
    FormsModule,
    ReactiveFormsModule,
    InputNumberModule,
    DialogModule,
    ArrangeDialogComponent,
  ],
  templateUrl: './m-s-grp-play-off.component.html',
  styleUrls: ['./m-s-grp-play-off.component.scss'],
})
export class MSGrpPlayOffComponent {
  _selectedDate: any;
  _showDialog: boolean = false;
  _currentDate = new Date();
  _tableNo: any = [{ name: 1 }, { name: 2 }, { name: 3 }, { name: 4 }];
  _umpire: any = [
    { name: 'Lorem ipsum git' },
    { name: 'Lorem ipsum git' },
    { name: 'Lorem ipsum git' },
  ];
  _toStream: any = [{ name: 'Yes' }, { name: 'No' }];
  _groups: any = [
    { playerA: 'player1', playerB: 'player1' },
    { playerA: 'player2', playerB: 'player2' },
    { playerA: 'player3', playerB: 'player3' },
  ];
  openDialog() {
    this._showDialog = true;
  }
}
