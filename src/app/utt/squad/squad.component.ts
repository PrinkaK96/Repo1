import { Component } from '@angular/core';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-squad',
  templateUrl: './squad.component.html',
  styleUrls: ['./squad.component.scss']
})
export class SquadComponent {
  title = 'leaderboard';
  squadList: any = []
  constructor(private commonService: CommonService) { }

  ngOnInit() {
    this.getSquads()
  }
  getSquads() {
    this.squadList = []
    this.commonService.getSquads().subscribe((res) => {
      this.squadList.push(res)
      this.squadList
    })
  }
}
