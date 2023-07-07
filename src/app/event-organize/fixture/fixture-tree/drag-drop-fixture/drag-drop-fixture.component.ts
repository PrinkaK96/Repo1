import { Component } from '@angular/core';

@Component({
  selector: 'stupa-drag-drop-fixture',
  templateUrl: './drag-drop-fixture.component.html',
  styleUrls: ['./drag-drop-fixture.component.scss']
})
export class DragDropFixtureComponent {
  public players = [
    {
      name: 'Player 1',
    },
    {
      name: 'Player 2',
    },
    {
      name: 'Player 3',
    },
    {
      name: 'Player 5',
    },
    {
      name: 'Player 6',
    },
    {
      name: 'Player 7',
    },
  ];

  returnUpdatedList(data:any) {
    this.players = data;
  }
}
