import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';
const TEMPLATE = "assets/file/Import-Official-Template.xlsx";
@Component({
  selector: 'stupa-create-official',
  templateUrl: './create-official.component.html',
  styleUrls: ['./create-official.component.scss'],
  providers: [MessageService],
})
export class CreateOfficialComponent implements OnInit {
  @Output() landPage = new EventEmitter<any>();
  _officialForm: any = FormGroup;
  _defaultProfile = '../../../../assets/icons/avatar.png';
  _profileImage: any;
  _isSubmit: boolean = false;
  _imageFile = null;
  _showMessage: boolean = false;
  _state = [{ name: 'Abled' }, { name: 'dis-Abled' }];
  _eventId: number = 0;
  _eventOfficial: any = [];
  constructor(private formBuilder: FormBuilder, private eventsService: EventsService, private encyptDecryptService: EncyptDecryptService,
    private messageService: MessageService) {
    this.loadOfficialForm();
  }
  ngOnInit(): void {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    );
    this.getEventOfficial();
  }
  loadOfficialForm() {
    this._officialForm = this.formBuilder.group({
      officialName: new FormControl('', Validators.compose([Validators.required])),
      officialEmail: new FormControl('', Validators.compose([Validators.required, Validators.email])),
      officialPhoto: new FormControl(''),
    });
  }
  resetForm() {
    this._isSubmit = false;
    this._officialForm.reset();
    this._showMessage = false;
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

  downloadTemplate() {
    const link = document.createElement('a');
    link.setAttribute('target', '_self');

    link.setAttribute('href', TEMPLATE);
    link.setAttribute('download', `add_official_template.xlsx`);

    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  goBackLandPage() {
    this.landPage.emit(false);
  }
  //#region Create Official/umpire for sweden
  AddOfficial() {
    this._isSubmit = true;
    if (this._officialForm.valid) {
      this._showMessage = true;
      this.eventsService.createOfficial(this._eventId, this._officialForm.controls.officialName.value, this._officialForm.controls.officialEmail.value).subscribe({
        next: (result: any) => {
          this.resetForm();
          this.getEventOfficial()
          this.messageService.add({
            key: 'bc',
            severity: 'success',
            summary: 'Success',
            detail: 'Official Created Successfully.',
            life: 3000,
          });
        },
        error: (result: any) => {
          this.messageService.add({
            key: 'bc',
            severity: 'success',
            summary: 'Success',
            detail: result.msg,
            life: 3000,
          });
        },
        complete: () => { },
      });
    }
  }
  //#endregion Create Official/umpire for sweden
  //#region get Official/umpire for sweden
  getEventOfficial() {
    this.eventsService.getEventOfficial(this._eventId, true).subscribe({
      next: (result: any) => {
        this._eventOfficial = [];
        this._eventOfficial = result.body;
      },
      error: (result: any) => {
      },
      complete: () => { },
    });
  }
  //#endregion get Official/umpire for sweden
}
