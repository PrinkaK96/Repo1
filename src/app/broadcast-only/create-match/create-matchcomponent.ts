import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { get } from 'http';
import { MessageService } from 'primeng/api';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { CommonApiService } from 'src/app/services/Common/common-api.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { JsonDataCallingService } from 'src/app/services/LocalDataJsonDataAPI/json-data-calling.service';
import { BroadcastOnlyService } from 'src/app/services/broadcastOnly/broadcast-only.service';
import * as XLSX from 'xlsx';
const TEMPLATE = "assets/file/Import Player-Template.xlsx";
@Component({
  selector: 'app-create-match',
  templateUrl: './create-match.component.html',
  styleUrls: ['./create-match.component.scss'],
  providers: [MessageService,DatePipe]
})



export class CreateMatchComponent implements OnInit {
  _selectedBanner: any = '';
  _eventParticipantType: any = [];
  azureLoggerConversion: any = new Error();
  _fixtureFormat: any = [];
  _officialList: any;
  _matchDetailForm!: FormGroup;
  _currentDate: any = new Date();
  index: any;
  _playersList: any = []
  @Output() tournamentIndex = new EventEmitter<any>();
  _uploadImage: any;
  editMatchDetails: boolean= false;
  editInfo: any=[];
  getMatches: boolean=false;
  event_id: any;
  _bestOf: any;
  @ViewChild('selectFile') selectFile: ElementRef | any;
  element: any;
  _isSubmitEvent:boolean=false;
  _showRuleSetField: boolean=false;
  _rulePoint: any=[];
  umpire_id: any;
  _dataObject: any = []
  _minDateValue: any;
  _maxDateValue: any;
  _isSubmitEventUmpire: boolean=false;

  constructor(private messageService: MessageService, private commonApiService: CommonApiService, private formBuilder: FormBuilder, private broadcastService: BroadcastOnlyService,
    private jsonDataCallingService: JsonDataCallingService, private azureLoggerService: MyMonitoringService,
    private encyptDecryptService: EncyptDecryptService,private datePipe: DatePipe) {
    this.eventsParticipant();
    this.setFixtureFormat();
    this.loadTournamentDetails();
    this.getEventOfficial();
    this.selectBestOf();
    this.selectRulePoint()
  }

  ngOnInit(): void {
    if (localStorage.getItem('event_id')) {
      this.getMatches=true;
      this.event_id = this.encyptDecryptService.decryptUsingAES256(
        localStorage.getItem('event_id')
      );
      this._dataObject = localStorage.getItem('data');
      this._dataObject = JSON.parse(this._dataObject)
      //this._minDateValue = new Date(this._dataObject.event_start_time.split('T')[0]);
    //  this._maxDateValue = new Date(this._dataObject.event_end_time.split('T')[0]);
      const dateString1 = this._dataObject.event_start_time;
      this._minDateValue= new Date(dateString1)//= this.datePipe.transform(new Date(dateString1), 'dd/mm/yy,HH:mm');

      const dateString = this._dataObject.event_end_time;
      this._maxDateValue = new Date(dateString)//this.datePipe.transform(new Date(dateString), 'dd/mm/yy,HH:mm');

      
      this.getBroadcastMatches();
    }
    else{
      this.getMatches=false;
    }
  }

  //#region FormControl for match details
  loadTournamentDetails() {
    this._matchDetailForm = this.formBuilder.group({
      playerNameA: new FormControl('', Validators.compose([Validators.required])),
      playerNameB: new FormControl('', Validators.compose([Validators.required])),
      dateTime: new FormControl('', Validators.compose([Validators.required])),
      participantType: new FormControl('', Validators.compose([Validators.required])),
      tableNo: new FormControl('', Validators.compose([Validators.required])),
      fixtureFormat: new FormControl('', Validators.compose([Validators.required])),
      categoryName: new FormControl('', Validators.compose([Validators.required])),
      umpireName: new FormControl(''),
      roundName: new FormControl('', Validators.compose([Validators.required])),
      bestOf: new FormControl(''),
      rule_point:new FormControl(''),
    });
  }
  //#endregion FormControl for match details

  //#region function to upload banner
  fileDetail(file: any) {
    //this.showImage = false;
    //this._notSelectedImage=true;
    const maxSize = 800 * 1024; //800KB
    const minSize = 50 * 1024; //50KB
    if (file) {
      const extension = file.item(0).name.split('.')[1];
      if (extension !== 'jpg' && extension !== 'jpeg' && extension !== 'png') {
        // File format not allowed
        this.messageService.add({
          key: 'bc',
          severity: 'info',
          summary: 'Info',
          detail: 'Only the jpg/jpeg/png file types are supported',
          life: 3000,
        });
      }
      else {
        if (file[0].size > maxSize || file[0].size < minSize) {
          this.messageService.add({
            key: 'bc',
            severity: 'info',
            summary: 'Info',
            detail: 'File size must be between 50KB-800KB range',
            life: 3000,
          });
        }
        else {
          // this._showBanner = true;
          this._selectedBanner = file.item(0);
          // this._uploadImage = this._selectedBanner
          //this._selectedUpdateBanner = this._selectedBanner
          let reader = new FileReader();
          reader.onload = (event: any) => {
            this._selectedBanner = event.target.result;
          };
          reader.readAsDataURL(this._selectedBanner);
          this.uploadBroadcastMatchBanner()
        }
      }
    }
  }
  //#endregion function to upload banner


  //#region fetching jsonData to get to get enum of events_participant
  eventsParticipant() {
    this.jsonDataCallingService.eventsParticipantType().subscribe({
      next: (result: any) => {
        this._eventParticipantType = result;
      },
      error: (result) => {
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => { },
    });
  }
  //#endregion fetching jsonData to get to get enum of events_participant

  //#region fetching jsonData to get to get enum of events_fixture_format
  setFixtureFormat() {
    this.jsonDataCallingService.eventsFixtureFormat().subscribe({
      next: (result: any) => {
        this._fixtureFormat = result;
      },
      error: (result) => {
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => { },
    });
  }
  //#endregion fetching jsonData to get to get enum of events_fixture_format

  //#region fetching jsonData to get to get enum of events_Point
  selectRulePoint() {
    this.jsonDataCallingService.selectRulePoint().subscribe({
      next: (result: any) => {
        this._rulePoint = result;
      },
      error: (result) => {
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => { },
    });
  }
  //#endregion fetching jsonData to get to get enum of events_Point

  //#region fetching official list through the API
  getEventOfficial() {
    this.broadcastService.getEventOfficial().subscribe({
      next: (result: any) => {
        this._officialList = [];
        this._officialList = result.body;
      },
      error: (result: any) => {
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => { },
    })
  }
  //#endregion fetching official list through the API

//#region fetching jsonData to get to get enum of rule_set
selectBestOf() {
  this.jsonDataCallingService.selectBestOf().subscribe({
    next: (result: any) => {
      this._bestOf = result;
    },
    error: (result) => {
      this.azureLoggerConversion = result.error.msg
      this.azureLoggerService.logException(this.azureLoggerConversion)
    },
    complete: () => { },
  });
}
//#endregion fetching jsonData to get to get enum of rule_set

  //#region method to save match-details for any event
  saveMatchDetails() { 
    if(this._matchDetailForm.valid){ 
    this._isSubmitEvent = false;
    this.umpire_id= this._officialList.filter(((x:any)=> x.name == this._matchDetailForm.controls['umpireName'].value))
    var data = {
      broadcast_list: [
        {
          start_time: this.commonApiService.convertUTCDateToLocalDate(new Date(this._matchDetailForm.controls['dateTime'].value)),
          playerA: this._matchDetailForm.controls['playerNameA'].value,
          playerB: this._matchDetailForm.controls['playerNameB'].value,
          umpire_id: this.umpire_id.length===0 ? undefined : this.umpire_id[0].user_id,
          umpire_name: this.umpire_id.length===0 ? undefined : this._matchDetailForm.controls['umpireName'].value,
          rule_set: this.umpire_id.length===0 ? undefined : this._matchDetailForm.controls['bestOf'].value,
          rule_point: this.umpire_id.length===0 ? undefined :  this._matchDetailForm.controls['rule_point'].value,
          table: parseInt(this._matchDetailForm.controls['tableNo'].value),
          participant_type: this._matchDetailForm.controls['participantType'].value,
          round: this._matchDetailForm.controls['roundName'].value,
          fixture_format: this._matchDetailForm.controls['fixtureFormat'].value,
          image: this._uploadImage != undefined ? this._uploadImage : 'https://stupaprodsguscentral.blob.core.windows.net/cbtm/livethumbnsil (1).jpg',
          category: this._matchDetailForm.controls['categoryName'].value,
        }
      ]
    }
    this.broadcastService.saveMatchDetail(data, this.event_id)
      .subscribe({
        next: (result: any) => {
          this._matchDetailForm.reset()
          this.getBroadcastMatches();
          this.messageService.add({
            key: 'bc',
            severity: 'success',
            summary: 'Success',
            detail: result.body.msg,
            life: 3000,
          });
        },
        error: (result: any) => {
          this.azureLoggerConversion = result.error.msg;
          this.azureLoggerService.logException(this.azureLoggerConversion);
          this.messageService.add({
            key: 'bc',
            severity: 'error',
            summary: 'Error',
            detail: result.error.msg,
            life: 3000,
          });
        },
        complete: () => { },
      });
    }
    else{
      this._isSubmitEvent = true;
      this.messageService.add({
        key: 'bc',
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill all required details',
        life: 3000,
      });
    }
  }
  //#endregion  method to save match-details for any event

  //#region  method to import excel containing match-details 
  importMatchDetails(event:any) {
    //this.sharedService.setAppLoader(true);
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);
    reader.onload = (e: any) => {
      /* create workbook */
      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });

      /* selected the first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      const data = XLSX.utils.sheet_to_json(ws); // to get 2d array pass 2nd parameter as object {header: 1}

     


      // validate the rows

      for (let index = 0; index < data.length; index++) {
        this.element = data[index];
        
        const pattern = /^\d{2}\/\d{2}\/\d{4}$/

        if (new Date(this.element['start_time']) < new Date() || pattern.test(this.element['start_time'])) {
          this.messageService.add({ key: 'bc',severity: 'error', summary: 'Found Error at Row ' + (index + 1), detail: 'Old Date and time is not Accepted and date format must be mm/dd/yyyy with 24 hour time format.', life: 3000 });
          //this.sharedService.setAppLoader(false);
          return;
        }

        if (!this.element['playerA']) {
          this.messageService.add({ key: 'bc',severity: 'error', summary: 'Found Error at Row ' + (index + 2), detail: 'PlayerAName is missing', life: 3000 });
          //this.sharedService.setAppLoader(false);
          return;
        }

        if (!this.element['playerB']) {
          this.messageService.add({  key: 'bc',severity: 'error', summary: 'Found Error at Row ' + (index + 2), detail: 'PlayerBName is missing', life: 3000 });
          //this.sharedService.setAppLoader(false);
          return;
        }
        if (!this.element['participant_type']) {
          this.messageService.add({ key: 'bc',severity: 'error', summary: 'Found Error at Row ' + (index + 2), detail: 'ParticipantType is missing', life: 3000 });
          
          return;
        }
        if (!this.element['table']) {
          this.messageService.add({ key: 'bc',severity: 'error', summary: 'Found Error at Row ' + (index + 2), detail: 'TableNumber is missing', life: 3000 });
          
          return;
        }
        if (!this.element['round']) {
          this.messageService.add({ key: 'bc',severity: 'error', summary: 'Found Error at Row ' + (index + 2), detail: 'RoundName is missing', life: 3000 });
          
          return;
        }
        if (!this.element['fixture_format']) {
          this.messageService.add({ key: 'bc',severity: 'error', summary: 'Found Error at Row ' + (index + 2), detail: 'Fixture Format is missing', life: 3000 });
          
          return;
        }
        const dateStr = this.element.start_time;
        const [month, day, splittedYear] = dateStr.split("/");
        const year = splittedYear.slice(0,4)
        // Note that month is zero-indexed in the Date constructor
        const date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
        const utcDateTime = date.toISOString();
        
        this.element.start_time = utcDateTime.split('T')[0]+"T"+splittedYear.slice(5,10)+':00Z'
        //this.element['TournamentId'] = JSON.parse(localStorage.getItem('event_id'))
        // element['MatchDate'] = this.dateService.fulldateFormatter(this.liveMatchForm.value.date) + "," + this.dateService.fullTimeFormatter(this.liveMatchForm.value.date)
      }
      
       
      this.saveBulkMatches(data);
    };
  }
  //#endregion method to import excel containing match-details 

  //#region method to download excel containing match-details template
  downloadTemplate() {
    const link = document.createElement('a');
    link.setAttribute('target', '_self');

    link.setAttribute('href', TEMPLATE);
    link.setAttribute('download', `Import Player-Template.xlsx`);

    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  //#endregion method to download excel containing match-details template


  //#region method to pass index to parent to navigate to create-tournament when no tournament is created
  nevigateToDetails() {
    this.tournamentIndex.emit(0)
  }
//#endregion method to pass index to parent to navigate to create-tournament when no tournament is created

//#region API call to get broadcast matches
getBroadcastMatches() {
    this.broadcastService.getMatchDetails(this.event_id)
      .subscribe({
        next: (result: any) => {
          this._playersList = []
          this._playersList = result.body
          
        },
        error: (result: any) => {
          this.azureLoggerConversion = result.error.msg;
          this.azureLoggerService.logException(this.azureLoggerConversion);
          this.messageService.add({
            key: 'bc',
            severity: 'error',
            summary: 'Error',
            detail: result.error.msg,
            life: 3000,
          });
        },
        complete: () => { },
      });
  }
  //#endregion API call to get broadcast matches

 //#region upload banner of broadcast match
  uploadBroadcastMatchBanner() {
    this.event_id = this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    );
    const formData = new FormData();
    formData.append('file', this._selectedBanner)
    this.broadcastService.updateEventImage(formData).subscribe({
      next: (data: any) => {
        this._uploadImage = data.body.url;

      },
      error: (result: any) => {
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
        this.messageService.add({
          key: 'bc',
          severity: 'error',
          summary: 'Error',
          detail: result.error.msg,
          life: 3000,
        });
      },
      complete: () =>{
        
      }
    })
  }
   //#endregion upload banner of broadcast match
 
 
   //#region set values in form control in case of edit match action
  editMatchDetail(matchData: any) {
    this.editMatchDetails = true;
    this._showRuleSetField = true;
    this._isSubmitEvent = false;
    this.editInfo = matchData;
    
    this._matchDetailForm.controls['playerNameA'].setValue(matchData.match_details[0].participant_name);
    this._matchDetailForm.controls['playerNameB'].setValue(matchData.match_details[1].participant_name);
    this._matchDetailForm.controls['dateTime'].setValue(new Date(matchData.start_time));
    this._matchDetailForm.controls['umpireName'].setValue(matchData.umpire_name);
    this._matchDetailForm.controls['participantType'].setValue(matchData.participant_type);
    this._matchDetailForm.controls['fixtureFormat'].setValue(matchData.fixture_format);
    this._matchDetailForm.controls['roundName'].setValue(matchData.round);
    this._matchDetailForm.controls['tableNo'].setValue(matchData.table);
    this._matchDetailForm.controls['bestOf'].setValue(matchData.rule_set);
    this._matchDetailForm.controls['categoryName'].setValue(matchData.category);
    this._matchDetailForm.controls['rule_point'].setValue(matchData.rule_point);
  }
  //#endregion set values in form control in case of edit match action

   //#region API CALL to update match details in case of edit-Match
  editMatches(){
   // this.umpire_id= this._officialList.filter(((x:any)=> x.name == this._matchDetailForm.controls['umpireName'].value))
    var data = 
        {
          start_time: this.commonApiService.convertUTCDateToLocalDate(new Date(this._matchDetailForm.controls['dateTime'].value)),
          playerA: this._matchDetailForm.controls['playerNameA'].value,
          playerB: this._matchDetailForm.controls['playerNameB'].value,
          umpire_id: this.editInfo.umpire_id!=undefined ?this.editInfo.umpire_id : undefined ,
          umpire_name: this._matchDetailForm.controls['umpireName'].value,
          rule_set: this._matchDetailForm.controls['bestOf'].value,
          rule_point: this._matchDetailForm.controls['rule_point'].value,
          table: parseInt(this._matchDetailForm.controls['tableNo'].value),
          participant_type: this._matchDetailForm.controls['participantType'].value,
          round: this._matchDetailForm.controls['roundName'].value,
          fixture_format: this._matchDetailForm.controls['fixtureFormat'].value,
          image:  this._uploadImage != undefined ? this._uploadImage : 'https://stupaprodsguscentral.blob.core.windows.net/cbtm/livethumbnsil (1).jpg',
          match_id: this.editInfo.match_id,
          category: this._matchDetailForm.controls['categoryName'].value,
        }

    
    this.broadcastService.editMatches(data, this.event_id)
      .subscribe({
        next: (result: any) => {
          this.getBroadcastMatches();
          this._matchDetailForm.reset();
          this.editMatchDetails = false;
          this._showRuleSetField = false;
          this._isSubmitEvent = false;
          this.messageService.add({
            key: 'bc',
            severity: 'success',
            summary: 'Success',
            detail: result.body.msg,
            life: 3000,
          });
        },
        error: (result: any) => {
          this.azureLoggerConversion = result.error.msg;
          this.azureLoggerService.logException(this.azureLoggerConversion);
          this.messageService.add({
            key: 'bc',
            severity: 'error',
            summary: 'Error',
            detail: result.error.msg,
            life: 3000,
          });
        },
        complete: () => { },
      });
  }
   //#endregion API CALL to update match details in case of edit-Match

   //#region API CALL to delete Match-details
   deleteMatch(data:any){
    this.broadcastService.deleteMatchDetail(this.event_id,data.match_id)
    .subscribe({
      next: (result: any) => {
        this.getBroadcastMatches();
        this._matchDetailForm.reset();
        this.editMatchDetails = false;
        this._showRuleSetField = false;
        this.messageService.add({
          key: 'bc',
          severity: 'success',
          summary: 'Success',
          detail: result.body.msg,
          life: 3000,
        });
      },
      error: (result: any) => {
        this.azureLoggerConversion = result.error.msg;
        this.azureLoggerService.logException(this.azureLoggerConversion);
        this.messageService.add({
          key: 'bc',
          severity: 'error',
          summary: 'Error',
          detail: result.error.msg,
          life: 3000,
        });
      },
      complete: () => { },
    });
  }
   //#endregion API CALL to delete Match-details

  clearFile() {
    this.messageService.add({ key: 'bc',severity: 'success', summary: 'Important', detail: 'Date format should be in format mm/dd/yyyy.', life: 3000 });
    this.selectFile.nativeElement.value = "";
  }

  //#endregion save matches in bulk after saving details in excel and directly importing them
  saveBulkMatches(broadcast_list:any){
    var data = {
      broadcast_list
    }
    this.broadcastService.saveMatchDetail(data, this.event_id)
      .subscribe({
        next: (result: any) => {
          this._matchDetailForm.reset();
          this.getBroadcastMatches();
          this.messageService.add({
            key: 'bc',
            severity: 'success',
            summary: 'Success',
            detail: result.body.msg,
            life: 3000,
          });
        },
        error: (result: any) => {
          this.azureLoggerConversion = result.error.msg;
          this.azureLoggerService.logException(this.azureLoggerConversion);
          this.messageService.add({
            key: 'bc',
            severity: 'error',
            summary: 'Error',
            detail: result.error.msg,
            life: 3000,
          });
        },
        complete: () => { },
      });
  }
  //#endregion save matches in bulk after saving details in excel and directly importing them

  //#region condition to show rule_set and rule_point field when umpire field is created
  showRuleField(){
    if(this._matchDetailForm.controls['umpireName'].value=== null){
      this._showRuleSetField = false;
      this._matchDetailForm.controls['rule_point'].setValue(null);
      this._matchDetailForm.controls['bestOf'].setValue(null);
      this._matchDetailForm.controls['rule_point'].setValidators(null);
      this._matchDetailForm.controls['rule_point'].updateValueAndValidity();
      this._matchDetailForm.controls['bestOf'].setValidators(null);
      this._matchDetailForm.controls['bestOf'].updateValueAndValidity();
    }
    else{
    this._showRuleSetField = true;
    this._isSubmitEventUmpire = true
    this._matchDetailForm.controls['rule_point'].setValidators([Validators.required,]);
    this._matchDetailForm.controls['bestOf'].setValidators([Validators.required,]);
    }
  }
  //#endregion condition to show rule_set and rule_point field when umpire field is created
}
