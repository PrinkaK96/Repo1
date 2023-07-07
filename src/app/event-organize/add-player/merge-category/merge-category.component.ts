import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { PlayerServiceService } from 'src/app/services/player/player-service.service';

@Component({
  selector: 'stupa-merge-category',
  templateUrl: './merge-category.component.html',
  styleUrls: ['./merge-category.component.scss'],
  providers: [MessageService]
})
export class MergeCategoryComponent implements OnInit {
  _showLoader: boolean = false;
  _dropDownCategoryList: any = [];
  _selectedCategory: any;
  _from_cat_id: any;
  _to_cat_id: any;
  _eventId: any;
  azureLoggerConversion: any = new Error()
  @Input() _mergeCategoryList: any = [];
  @Output() refreshPlayerList = new EventEmitter<any>();
  constructor(private playerService: PlayerServiceService, private messageService: MessageService, private azureLoggerService: MyMonitoringService,
    private encyptDecryptService: EncyptDecryptService
  ) { }

  ngOnInit(): void {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
  }
  mergeClick(index: any) {
    this._from_cat_id = this._mergeCategoryList[index].category_id
    this._dropDownCategoryList = this._mergeCategoryList.filter((x: any) => x.category_id !== this._mergeCategoryList[index].category_id)
    for (let i = 0; i < this._mergeCategoryList.length; i++) {
      if (index == i) {
        this._mergeCategoryList[i].isSelectedCategory = true;
      } else {
        this._mergeCategoryList[i].isSelectedCategory = false;
      }
    }
  }
  mergeCategory(data: any) {
    this._showLoader = true;
    this._selectedCategory
    if (this._selectedCategory !== undefined) {
      this._to_cat_id = this._selectedCategory.category_id
      this.playerService.mergeCategory(this._eventId, this._from_cat_id, this._to_cat_id).subscribe({
        next: (result: any) => {
          this._showLoader = false;
          this.messageService.add({
            key: 'bc',
            severity: 'success',
            summary: 'Success',
            detail: result.body.msg,
            life: 3000,
          });
          this.refreshPlayerList.emit()
        },
        error: (result) => {
          this._showLoader = false;
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
          this.messageService.add({
            key: 'bc',
            severity: 'error',
            summary: 'error',
            detail: result.error.msg,
            life: 99999999000,
          });
        },
        complete: () => { },
      });
    } else {
      this.messageService.add({
        key: 'bc',
        severity: 'error',
        summary: 'error',
        detail: 'Please choose category from drop down',
        life: 9999000,
      });
    }
  }
}

