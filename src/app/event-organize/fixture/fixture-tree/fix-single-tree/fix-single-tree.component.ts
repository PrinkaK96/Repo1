import { Component, Input, SimpleChanges, TemplateRef } from '@angular/core';
import { NgttRound, NgttTournament } from '../interfaces';

@Component({
  selector: 'stupa-fix-single-tree',
  templateUrl: './fix-single-tree.component.html',
  styleUrls: ['./fix-single-tree.component.scss']
})
export class FixSingleTreeComponent {
  //#region Variables
  @Input() matchTemplate!: TemplateRef<any>;
  @Input() tournament!: NgttTournament;
  public winnersBracket!: NgttRound[];
  public final: any;
  //#endregion
  constructor() {
  }

  ngOnInit() {
  }
  //#region  Get Latest Changes
  ngOnChanges(changes: any) {
    if (changes.hasOwnProperty('tournament') && changes.tournament.currentValue) {
      this.winnersBracket = this.tournament.rounds.filter((round: any) => {
        return round.type === 'Winnerbracket';
      });
    }
    this.final = this.tournament.rounds.filter((round: any) => {
      return round.type === 'Final';
    }).shift();
  }
  //#endregion
  getData(data: any) {
    if (data.matches[0].winner !== null) {
      return data.matches[0].match_details.filter((x: any) => x.participant_id == data.matches[0].winner)[0].participant_name;
    }else{
      return ''
    }
  

  }
}
