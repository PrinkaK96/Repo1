import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'stupa-add-players',
  templateUrl: './add-players.component.html',
  styleUrls: ['./add-players.component.scss']
})
export class AddPlayersComponent implements OnInit {
  _showMessage: boolean = false;
  _state = [{ name: 'Abled' }, { name: 'Para' }];
  _imageFile = null;
  skeletonRow = [
    {},
    {},
    {},
    {},
  ]
  _defaultProfile = '../../../../assets/icons/avatar.png';
  @Output() landPage = new EventEmitter<any>();
  event:any;
  constructor() { }

  ngOnInit(): void {
  }
  onUpload(e: any) {
    let userImageFile = e.dataTransfer
      ? e.dataTransfer.files[0]
      : e.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    if (userImageFile.type.match(pattern)) {
      reader.onload = this._handleReaderLoaded.bind(this);
      this._imageFile = userImageFile;
      reader.readAsDataURL(userImageFile);
    } else {
      alert('Wrong Pattern');
    }
  }
  _handleReaderLoaded(e: any) {
    var reader = e.target;

    this._defaultProfile = reader.result;
  }
  goBackLandPage() {
    this.landPage.emit(false);
  }
}
