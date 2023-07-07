import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AdminGrobalLiveService } from 'src/app/services/AdminGlobalLiveStream/admin-grobal-live.service';
import { UserProfileService } from 'src/app/services/UserProfile/user-profile.service';

@Component({
  selector: 'stupa-live-settings',
  templateUrl: './live-settings.component.html',
  styleUrls: ['./live-settings.component.scss'],
  providers: [MessageService]
})
export class LiveSettingsComponent {
  _selectedEntity: any;
  _trendingFormArray: any = FormGroup;
  _recentFormArray: any = FormGroup;
  _entityList: any = [
    {
      "id": "cbtm",
      "name": "Brazil"
    },
    {
      "id": "tt",
      "name": "Stupa"
    }
  ]
  _eventList: any = [
  ]
  _matchList: any = [
  ]
  _matchRecentList: any = [
  ]
  isValidFormSubmitted: boolean | null = null;
  isValidFormSubmittedRecent: boolean | null = null;
  fileToUpload: any;
  _uploadImage: any;
  fileName: any;
  _fileControlsIndex: any;
  _fileControlsSubIndex: any;
  _isTrending: boolean = false;
  _showDialog: boolean = false;
  _imgUrl: any;
  _currentTenant: any;
  _rowIndex: any;
  _ordersList: any = [];
  _subMatchesList: any = [];
  _globalTrendingList: any = [];
  _globalRecentList: any = [];
  _showLoader: boolean = false;
  isDesc: boolean = true;
  column: string = 'id';
  constructor(private router: Router, private fb: FormBuilder,
    private userProfileService: UserProfileService,
    private adminGrobalLiveService: AdminGrobalLiveService,
    private messageService: MessageService) {
    this.getGlobalTrendingMatches();
    this.getGlobalRecentEventMatches();
  }
  ngOnInit() {
    this._trendingFormArray = this.fb.group({
      trendingMatch: this.fb.array([])
    });
    this._recentFormArray = this.fb.group({
      recentMatch: this.fb.array([])
    });
    this.addMoreFormRecentArray();
  }
  goback() {
    this.router.navigate(['/admin/platform-headers']);
  }
  trendingMatch(): any {
    return this._trendingFormArray.get('trendingMatch') as FormArray;
  }
  recentMatch(): any {
    return this._recentFormArray.get('recentMatch') as FormArray;
  }
  trendingFormArray(): FormGroup {
    return this.fb.group({
      trendEntity: new FormControl('', Validators.compose([Validators.required])),
      trendEvent: new FormControl('', Validators.compose([Validators.required])),
      trendMatch: new FormControl('', Validators.compose([Validators.required])),
      trenThumbnail: new FormControl('')
    });
  }
  recentFormArray(): FormGroup {
    return this.fb.group({
      recentEntity: new FormControl('', Validators.compose([Validators.required])),
      recentEvent: new FormControl('', Validators.compose([Validators.required])),
      subMatchesList: this.fb.array([])
    });
  }
  addMoreFormArray() {
    if (this.trendingMatch().controls.length < 10) {
      this.isValidFormSubmitted = false;
      if (this._trendingFormArray.invalid) {
        return;
      }
      this.isValidFormSubmitted = true;
      this.trendingMatch().push(this.trendingFormArray());
    } else {
    }
  }
  removeForm(empIndex: number) {
    this._eventList[empIndex] = [];
    this._matchList[empIndex] = [];
    this.trendingMatch().removeAt(empIndex);
  }
  addMoreFormRecentArray() {
    this.isValidFormSubmittedRecent = false;
    if (this._recentFormArray.invalid) {
      return;
    }
    this.isValidFormSubmittedRecent = true;
    this.recentMatch().push(this.recentFormArray());
  }
  removeRecentForm(empIndex: number) {
    this.recentMatch().removeAt(empIndex);
  }
  removeSubRecentForm(empIndex: number, subIndex: number) {
    this.subMatches(empIndex).removeAt(subIndex);
  }
  deleteAll() {
    const body = {
      "match_order": []
    }
    this.adminGrobalLiveService.updateTrendingMatches(body).subscribe({
      next: (result: any) => {
        this.messageService.add({
          key: 'bc',
          severity: 'success',
          summary: 'Success',
          detail: result.body.msg,
          life: 3000,
        });
        let frmArray = this._trendingFormArray.get('trendingMatch') as FormArray;
        frmArray.clear();
        this._showLoader = false;
        this.getGlobalTrendingMatches();
      },
      error: (result: any) => {
        this.messageService.add({
          key: 'bc',
          severity: 'info',
          summary: 'Info',
          detail: result.error.msg,
          life: 3000,
        });
        this._showLoader = false;
      },
      complete: () => {
      }
    })
  }
  submitTrendForm() {
    this.isValidFormSubmitted = false;
    if (this._trendingFormArray.invalid) {
      return;
    }
    this.isValidFormSubmitted = true;
    this.createTrendingMatches();
  }
  onSubmitRecent() {
    this.isValidFormSubmittedRecent = false;
    if (this._recentFormArray.invalid) {
      return;
    }
    this.isValidFormSubmittedRecent = true;
  }
  onFileDroppedTrending($event: any, index: any, isTrending: boolean) {
    this._isTrending = isTrending
    this._fileControlsIndex = index;
    this.uploadFilesSimulator($event);
  }
  onFileDroppedRecent($event: any, index: any, subIndex: any) {
    this._isTrending = false
    this._fileControlsIndex = index;
    this._fileControlsSubIndex = subIndex;
    this.uploadFilesSimulator($event);
  }
  uploadProfileImage() {
    const formData = new FormData();
    formData.append('file', this._uploadImage)
    this.userProfileService.uploadProfileImage(21, formData).subscribe({
      next: (data: any) => {
        this._uploadImage = data.body.url
        if (this._isTrending) {
          this.trendingMatch().controls[this._fileControlsIndex].controls.trenThumbnail.value = data.body.url;
        } else {
          this.recentMatch().controls[this._fileControlsIndex].controls.subMatchesList.controls[this._fileControlsSubIndex].controls.thumnail.setValue(data.body.url);
        }
      },
      error: (result: any) => {
      },
      complete: () => { }
    })
  }
  uploadFilesSimulator(file: FileList) {
    this.fileToUpload = file.item(0);
    this._uploadImage = file.item(0);
    this.fileName = file[0].name;
    let reader = new FileReader();
    reader.onload = (event: any) => { };
    reader.addEventListener('load', () => { });
    reader.readAsDataURL(this.fileToUpload);
    this.uploadProfileImage()
  }
  viewImage(index: any, isTrending: any) {
    this._showDialog = true;
    if (isTrending) {
      this._imgUrl = this.trendingMatch().controls[index].controls.trenThumbnail.value
    } else {
      this._imgUrl = this.recentMatch().controls[this._fileControlsIndex].controls.subMatchesList.controls[this._fileControlsSubIndex].controls.thumnail.value
    }
  }
  viewRecentImage(index: any, subIndex: any) {
    this._showDialog = true;
    this._imgUrl = this.recentMatch().controls[index].controls.subMatchesList.controls[subIndex].controls.thumnail.value
  }
  //#region SubMatches 
  subMatches(empIndex: number): any {
    return this.recentMatch()
      .at(empIndex)
      .get('subMatchesList') as FormArray;
  }
  newMatch(): FormGroup {
    return this.fb.group({
      matchName: new FormControl('', Validators.compose([Validators.required])),
      thumnail: new FormControl(''),
    });
  }
  addMoreSubMatch(empIndex: number) {
    this.isValidFormSubmittedRecent = false;
    if (this._recentFormArray.invalid) {
      return;
    }
    this.isValidFormSubmittedRecent = true;
    this.subMatches(empIndex).push(this.newMatch());
  }
  addFirstSubMatch(empIndex: number) {
    this.isValidFormSubmittedRecent = true;
    this.subMatches(empIndex).clear()
    this.subMatches(empIndex).push(this.newMatch());
    this.getGlobalEventMatchesForRecent(empIndex)
  }
  removeSubMatch(empIndex: number, skillIndex: number) {
    this.subMatches(empIndex).removeAt(skillIndex);
  }
  getTenantAllEvents() {
    if (this._currentTenant !== '' && this._currentTenant !== null && this._currentTenant !== undefined) {
      this._showLoader = true;
      this.adminGrobalLiveService.getTenantAllEvents(this._currentTenant).subscribe({
        next: (data: any) => {
          this._eventList[this._rowIndex] = [];
          this._eventList[this._rowIndex] = data.body;
          this._showLoader = false;
        },
        error: (result: any) => {
          this._showLoader = false;
        },
        complete: () => {
        }
      })
    }
  }
  getGlobalEventMatches(index: any) {
    if (this._currentTenant !== '' && this._currentTenant !== null && this._currentTenant !== undefined) {
      this._showLoader = true;
      this.adminGrobalLiveService.getGlobalEventMatches(this.trendingMatch().controls[index].controls.trendEvent.value, this._currentTenant).subscribe({
        next: (data: any) => {

          this._matchList[index] = [];
          this._matchList[index] = data.body;
          this._showLoader = false;
        },
        error: (result: any) => {
          this._showLoader = false;
        },
        complete: () => {
        }
      })
    }
  }
  getGlobalEventMatchesForRecent(index: any) {
    if (this.recentMatch().controls[index].controls.recentEntity.value !== '' && this.recentMatch().controls[index].controls.recentEntity.value !== null && this.recentMatch().controls[index].controls.recentEntity.value !== undefined) {
      this._showLoader = true;
      this.adminGrobalLiveService.getGlobalEventMatches(this.recentMatch().controls[index].controls.recentEvent.value, this._currentTenant).subscribe({
        next: (data: any) => {
          this._showLoader = false;
          this._matchRecentList[index] = [];
          this._matchRecentList[index] = data.body;
        },
        error: (result: any) => {
          this._showLoader = false;
        },
        complete: () => {
        }
      })
    }
  }
  currentTrendTenant(index: any) {
    this._rowIndex = index;
    this._currentTenant = this.trendingMatch().controls[index].controls.trendEntity.value
    this.getTenantAllEvents();
  }
  currentRecentTenant(index: any) {
    this._rowIndex = index;
    this._currentTenant = this.recentMatch().controls[index].controls.recentEntity.value
    this.getTenantAllEvents();
  }
  createTrendingMatches() {
    this._ordersList = [];
    for (let i = 0; i < this._globalTrendingList.length; i++) {
      const data = {
        "match": this._globalTrendingList[i].id,
        "order": i + 1,
        "image_url": this._globalTrendingList.image == '' ? 'https://stupaprodsguscentral.blob.core.windows.net/cbtm/UserProfile/21/Event%20Thumbnail%20%281%29%20%281%29-compressed%20%281%29.jpg' : this._globalTrendingList.image
      }
      this._ordersList.push(data);
    }
    for (let i = 0; i < this._trendingFormArray.controls.trendingMatch.value.length; i++) {
      const data = {
        "match": this._trendingFormArray.controls.trendingMatch.value[i].trendMatch,
        "order": i + 1,
        "image_url": this.trendingMatch().controls[i].controls.trenThumbnail.value == '' ? 'https://stupaprodsguscentral.blob.core.windows.net/cbtm/UserProfile/21/Event%20Thumbnail%20%281%29%20%281%29-compressed%20%281%29.jpg' : this.trendingMatch().controls[i].controls.trenThumbnail.value
      }
      this._ordersList.push(data);
    }
    for (let f = 0; f < this._ordersList.length; f++) {
      this._ordersList[f].order = f + 1
    }
    const body = {
      "match_order": this._ordersList
    }
    if (true) {
      this._showLoader = true;
      this.adminGrobalLiveService.updateTrendingMatches(body).subscribe({
        next: (result: any) => {
          this.messageService.add({
            key: 'bc',
            severity: 'success',
            summary: 'Success',
            detail: result.body.msg,
            life: 3000,
          });
          let frmArray = this._trendingFormArray.get('trendingMatch') as FormArray;
          frmArray.clear();
          this._showLoader = false;
          this.getGlobalTrendingMatches();
        },
        error: (result: any) => {
          this.messageService.add({
            key: 'bc',
            severity: 'info',
            summary: 'Info',
            detail: result.error.msg,
            life: 3000,
          });
          this._showLoader = false;
        },
        complete: () => {
        }
      })
    } 
  }
  getGlobalTrendingMatches() {
    this._showLoader = true;
    this.adminGrobalLiveService.getGlobalTrendingMatches().subscribe({
      next: (data: any) => {
        this._globalTrendingList = [];
        this._globalTrendingList = data.body;
        this._showLoader = false;
        // this.sort('id');
        this.addMoreFormArray();
      },
      error: (result: any) => {
        this._showLoader = false;
        this.addMoreFormArray();
      },
      complete: () => {
      }
    })
  }
  countValue() {
    for (let i = 0; this._trendingFormArray.controls.trendingMatch.length; i++) {
      return this._globalTrendingList.length + 1 + i
    }
  }
  deleteRow(index: any) {
    this._globalTrendingList.splice(index, 1)
  }
  deleteSubMatchRow(index: any) {
    this._globalRecentList.splice(index, 1);
    if (this._globalRecentList.length == 0) {
      this.addMoreFormRecentArray();
    }
  }
  deleteRecentMatchRow(index: any) {
    this._eventList[index] = [];
    this.recentMatch().removeAt(index);
  }
  viewCreateTrenImage(imsg: any) {
    // const img = new Image();
    // img.onload = () => {
    //   const width = img.width;
    //   const height = img.height;

    //   // Create popup window
    //   const popupWidth = width + 20; // Add 20 pixels for padding
    //   const popupHeight = height + 50; // Add 50 pixels for title bar and other elements
    //   const popupOptions = `width=${popupWidth},height=${popupHeight}`;
    //   const popup = window.open(imsg, 'Image', popupOptions);

    //   // Resize popup to fit image
    //   popup !== null ? popup.resizeTo(popupWidth, popupHeight) : '';
    // };
    // img.src = imsg;
    this._showDialog = true;
    this._imgUrl = imsg;
  }
  getGlobalRecentEventMatches() {
    this._showLoader = true;
    this.adminGrobalLiveService.getGlobalRecentEventMatches().subscribe({
      next: (data: any) => {
        this._globalRecentList = [];
        this._globalRecentList = data.body;
        this._showLoader = false;
      },
      error: (result: any) => {
        this._showLoader = false;
      },
      complete: () => {
      }
    })
  }
  createRecentEvents() {
    this.isValidFormSubmittedRecent = false;
    if (this._recentFormArray.invalid) {
      return;
    }
    this.isValidFormSubmittedRecent = true;
    this._ordersList = [];
    for (let i = 0; i < this._recentFormArray.controls.recentMatch.value.length; i++) {
      const rr = {
        "event_id": this._recentFormArray.controls.recentMatch.value[i].recentEvent,
        "order": i + 1,
        "tenant_search": this._recentFormArray.controls.recentMatch.value[i].recentEntity,
        "GlobalLiveScreenBulkMatches": {
          "match_order": [
          ]
        }
      }
      this._subMatchesList = [];
      for (let j = 0; j < this._recentFormArray.controls.recentMatch.value[i].subMatchesList.length; j++) {
        const dd = {
          "match": this._recentFormArray.controls.recentMatch.value[i].subMatchesList[j].matchName,
          "order": j + 1,
          "image_url": this.recentMatch().controls[i].controls.subMatchesList.controls[j].controls.thumnail.value == '' ? 'https://stupaprodsguscentral.blob.core.windows.net/cbtm/UserProfile/21/Event%20Thumbnail%20%281%29%20%281%29-compressed%20%281%29.jpg' : this.recentMatch().controls[i].controls.subMatchesList.controls[j].controls.thumnail.value
        }
        this._subMatchesList.push(dd);
      }
      rr.GlobalLiveScreenBulkMatches.match_order = this._subMatchesList
      this._ordersList.push(rr);
    }
    for (let i = 0; i < this._globalRecentList.length; i++) {
      const rr = {
        // "id": this._globalRecentList[i].id,
        "event_id": this._globalRecentList[i].event_id,
        "order": i + 1,
        "tenant_search": this._globalRecentList[i].tenant,
        "GlobalLiveScreenBulkMatches": {
          "match_order": [
          ]
        }
      }
      this._subMatchesList = [];
      for (let j = 0; j < this._globalRecentList[i].match_details.length; j++) {
        const dd = {
          "match": this._globalRecentList[i].match_details[j].match_mapping_id,
          "order": j + 1,
          "image_url": this._globalRecentList[i].match_details[j].image == '' ? 'https://stupaprodsguscentral.blob.core.windows.net/cbtm/UserProfile/21/Event%20Thumbnail%20%281%29%20%281%29-compressed%20%281%29.jpg' : this._globalRecentList[i].match_details[j].image
        }
        this._subMatchesList.push(dd);
      }
      rr.GlobalLiveScreenBulkMatches.match_order = this._subMatchesList
      this._ordersList.push(rr);
    }
    for (let f = 0; f < this._ordersList.length; f++) {
      this._ordersList[f].order = f + 1
    }
    const body = {
      "events": this._ordersList
    }
    this.checkDuplicateSubMatches(this._ordersList);
    if (this.checkDuplicateSubMatches(this._ordersList)) {
      this._showLoader = true;
      this.adminGrobalLiveService.updateRecentEvent(body).subscribe({
        next: (result: any) => {
          this.messageService.add({
            key: 'bc',
            severity: 'success',
            summary: 'Success',
            detail: result.body.msg,
            life: 3000,
          });
          let frmArray = this._recentFormArray.get('recentMatch') as FormArray;
          frmArray.clear();
          this._showLoader = false;
          this.getGlobalRecentEventMatches();
        },
        error: (result: any) => {
          this.messageService.add({
            key: 'bc',
            severity: 'info',
            summary: 'Info',
            detail: result.error.msg,
            life: 3000,
          });
          this._showLoader = false;
        },
        complete: () => {
        }
      })
    } else {
      this.messageService.add({
        key: 'bc',
        severity: 'info',
        summary: 'Info',
        detail: 'Duplicate Sub-Matches',
        life: 3000,
      });
    }

  }
  sort(property: any) {
    this.isDesc = !this.isDesc; //change the direction    
    this.column = property;
    let direction = this.isDesc ? 1 : -1;

    this._globalTrendingList.sort(function (a: any, b: any) {
      if (a[property] < b[property]) {
        return -1 * direction;
      }
      else if (a[property] > b[property]) {
        return 1 * direction;
      }
      else {
        return 0;
      }
    });
  };
  deleteAllRecent() {
    const body = {
      "events": []
    }
    this.adminGrobalLiveService.updateRecentEvent(body).subscribe({
      next: (result: any) => {
        this.messageService.add({
          key: 'bc',
          severity: 'success',
          summary: 'Success',
          detail: result.body.msg,
          life: 3000,
        });
        let frmArray = this._recentFormArray.get('recentMatch') as FormArray;
        frmArray.clear();
        this._showLoader = false;
        // this.addMoreFormArray();
        this.addMoreFormRecentArray();
        this.getGlobalRecentEventMatches();
      },
      error: (result: any) => {
        this.messageService.add({
          key: 'bc',
          severity: 'info',
          summary: 'Info',
          detail: result.error.msg,
          life: 3000,
        });
        this._showLoader = false;
      },
      complete: () => {
      }
    })
  }
  checkDuplicateSubMatches(data: any) {
    for (let i = 0; i < data.length; i++) {
      for (let f = 0; f < data[i].GlobalLiveScreenBulkMatches.match_order.length; f++) {
        for (let j = f + 1; j < data[i].GlobalLiveScreenBulkMatches.match_order.length; j++) {
          if (data[i].GlobalLiveScreenBulkMatches.match_order[f].match === data[i].GlobalLiveScreenBulkMatches.match_order[j].match) {
            return false;
          }
        }
      }
    }
    return true;
  }
}
