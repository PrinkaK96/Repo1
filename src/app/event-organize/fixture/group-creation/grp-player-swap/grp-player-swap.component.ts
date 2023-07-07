import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'stupa-grp-player-swap',
  templateUrl: './grp-player-swap.component.html',
  styleUrls: ['./grp-player-swap.component.scss'],
})
export class GrpPlayerSwapComponent {
  //#region Variable Declare
  @Input() _searchByPlayerNameSwap: any = '';
  @Input() _playerSwapDataList: any = [];
  @Input() _playerListWithGroupName: any = [];
  @Input() _playerListWithGroupNameCopy: any = [];
  @Input() _groupList: any = [];
  @Input() _currentGroupName: any;
  @Output() swapGroupPlayer = new EventEmitter<any>();
  @Input() _currentParticipantId: any;
  ngOnChanges(changes: SimpleChanges) {
    this._searchByPlayerNameSwap = '';
  }
  //#endregion ariable Declare
  //#region  With this method we are able to search 
  searchPlayer() {
    this._playerListWithGroupName = this._playerListWithGroupNameCopy.filter((item: any) => {
      return (item.playerName.toLowerCase().includes(this._searchByPlayerNameSwap.toLowerCase()) ||
        item.playerEmail.toLowerCase().includes(this._searchByPlayerNameSwap.toLowerCase()) ||
        item.playerGroupName.toLowerCase().includes(this._searchByPlayerNameSwap.toLowerCase())
      );
    });
  }
  //#endregion  With this method we are able to search 
  //#region With this method we are able to swap player within group
  swapPlayer(data: any) {
    const selectedGroupIndex = this._groupList.findIndex((x: any) => x.group_id == this._playerSwapDataList[0].group_id)
    const destinationGroupIndex = this._groupList.findIndex((x: any) => x.group_id == data.playerGroupId)
    const selectedPlayerIndex = this._groupList.filter((x: any) => x.group_id == this._playerSwapDataList[0].group_id)[0].group_details.findIndex((x: any) => x.participant_id == this._playerSwapDataList[0].participant_id)
    const destinationPlayerIndex = this._groupList.filter((x: any) => x.group_id == data.playerGroupId)[0].group_details.findIndex((x: any) => x.participant_id == data.playerId)
    const selectedPlayerDetails = this._playerSwapDataList[0]
    const destinationPlayerDetails = this._groupList[destinationGroupIndex].group_details[destinationPlayerIndex];
    this._groupList[destinationGroupIndex].group_details.splice(destinationPlayerIndex, 1, selectedPlayerDetails);
    this._groupList[selectedGroupIndex].group_details.splice(selectedPlayerIndex, 1, destinationPlayerDetails);
    this.swapGroupPlayer.emit(this._groupList);
  }
  //#endregion With this method we are able to swap player within group
}
