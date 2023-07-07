import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';



@Component({
  selector: 'app-pros-guidelines',
  templateUrl: './pros-guidelines.component.html',
  styleUrls: ['./pros-guidelines.component.scss'],
  providers: [MessageService]
})
export class ProsGuidelinesComponent implements OnInit {
  @Input() _tabIndex: any;
  fileToUpload: any;
  fileName: any;
  pdfUrl: any;
  _eventId: any;
  _uploadImage: any;
  @Output() tabIndex = new EventEmitter<number>();
  getProspectusUrl: any;
  _updateFlag: boolean = false;
  azureLoggerConversion: any = new Error();
  constructor(public encyptDecryptService: EncyptDecryptService, private eventsService: EventsService, private messageService: MessageService,private azureLoggerService: MyMonitoringService,) { }

  ngOnInit(): void {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    );
    this.getProspectus();
  }
  ngOnChanges(){
    this._eventId = this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    );
    this.getProspectus();
  }
  onFileDropped($event: any) {
    this.uploadFilesSimulator($event);
  }
  uploadFilesSimulator(file: FileList) {
    this.fileToUpload = file.item(0);
    this._uploadImage = file.item(0);
    if (file) {
      const extension = this.fileToUpload.name.split('.')[1];
      if (extension !== 'pdf' && extension !== 'doc' && extension !== 'docx') {
        // File format not allowed
        this.messageService.add({
          key: 'bc',
          severity: 'info',
          summary: 'Info',
          detail: 'Only Pdf and Doc formats are supported',
          life: 3000,
        });
      }
      else{ 
        this.fileName = file[0].name;
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.pdfUrl = event.target.result;
    };
    reader.addEventListener('load', () => { });
    reader.readAsDataURL(this.fileToUpload);
    this.updateProspectus();
      }
    }
  }
  fileBrowseHandler(files: any) {
    this.onFileDropped(files);
  }
  eventClicked() {
    this.tabIndex.emit();
  }
  updateProspectus() {
    const formData = new FormData();
    formData.append('image', this._uploadImage)
    this.eventsService.updateProspectus( formData,this._eventId).subscribe({
      next: (data: any) => {

      },
      error: (result: any) => {
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
        this.messageService.add({
          key: 'bc',
          severity: 'info',
          summary: 'Info',
          detail: result.error.msg,
          life: 3000,
        });
      },
      complete: () =>{
        
      }
    })

  }
  reset() {
    this.pdfUrl = false;
  }

  getProspectus() {
    if(this._eventId!=null)
    this.eventsService.getDetailsByEventId(this._eventId).subscribe({
      next: (data: any) => {
        var currentData = data.body.filter((x: any) => x.event_id == this._eventId)[0];
        this._updateFlag = true;

        if (currentData.prospectus != null) {
          this.pdfUrl = currentData.prospectus;
          this.fileName = currentData.prospectus.match(/\/([^\/?#]+)$/)[1];
          this.fileName = decodeURIComponent(this.fileName)
        }
        else {
          this.pdfUrl = false;
        }

      },
      error: (data: any) => {
        this.azureLoggerConversion = data.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => {

      },
    })
  }
  
  deleteProspectus(){
    const formData = new FormData();
    const deleteProspectus = ''
    formData.append('image', deleteProspectus)
    this.eventsService.updateProspectus( formData,this._eventId).subscribe({
      next: (data: any) => {

      },
      error: (result: any) => {
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
        this.messageService.add({
          key: 'bc',
          severity: 'info',
          summary: 'Info',
          detail: result.error.msg,
          life: 3000,
        });
      },
      complete: () =>{
        
      }
    })
  }
}

