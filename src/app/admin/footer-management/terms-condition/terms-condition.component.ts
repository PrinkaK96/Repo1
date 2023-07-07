import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AdminFooterService } from 'src/app/services/AdminFooter/admin-footer.service';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';

@Component({
  selector: 'app-terms-condition',
  templateUrl: './terms-condition.component.html',
  styleUrls: ['./terms-condition.component.scss'],
  providers: [MessageService],
})
export class TermsConditionComponent implements OnInit {
  _disableEdit: boolean = true;
  _disableEdit2: boolean = true;
  _showFields: boolean = false;
  _newFormBuild!: FormGroup;
  _setLinksArray: any = [{
    'title': 'Privacy Policy',
    'url': 'Enter Link here',
    'disabled': true
  }, {
    'title': 'Term & Condition',
    'url': 'Enter Link here',
    'disabled': true
  }];
  _counts = 0;
  _addMoreField: any = [

  ]
  _finalData: any = [];
  footerData: any = [];
  socialLinks: any = [];
  _showLoader: boolean = false;
  azureLoggerConversion: Error = new Error();
  constructor(
    private footerService: AdminFooterService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private azureLoggerService: MyMonitoringService
  ) {
    this.formBuilder.group({
      privacyPlicy: new FormControl(''),
      term: new FormControl(''),
    });
  }

  ngOnInit(): void { this.getFooter(); }
  /*get all details for terms and condition page */
  getFooter() {
    this._showLoader = true;
    this.footerService.getFooter().subscribe({
      next: (data: any) => {
        this.footerData = data.body.filter((x: any) => x.title === 'Terms & conditions')[0].data;
        this.socialLinks = this.footerData;
        this._setLinksArray = [];
        for (let i = 0; i < this.footerData.links.length; i++) {
          const data = {
            'title': this.footerData.links[i].title,
            'url': this.footerData.links[i].url,
            'disabled': true
          }
          if (this._setLinksArray.findIndex((x: any) => x.title == this.footerData.links[i].title) == -1) {
            this._setLinksArray.push(data)
          }

        }
        // this._setLinksArray = this.socialLinks.links;
      },
      error: (result: any) => {
        this.azureLoggerConversion = result.error.msg;
        this.azureLoggerService.logException(this.azureLoggerConversion);
      },
      complete: () => {

      },
    });
    this._showLoader = false;
  }
  /*update details for terms and condition page */
  updateFooter() {
    this._showLoader = true;
    this._finalData = [];
    for (let i = 0; i < this._addMoreField.length; i++) {
      if (this._addMoreField[i].title != '' && this._addMoreField[i].title != '') {
        this._setLinksArray.push(this._addMoreField[i]);
      }

    }

    for (let i = 0; i < this._setLinksArray.length; i++) {
      const data = {
        title: this._setLinksArray[i].title,
        url: this._setLinksArray[i].url,
        published: true
      }
      if (this._finalData.findIndex((x: any) => x.title == this._setLinksArray[i].title) == -1) {
        this._finalData.push(data);
      }

    }
    const body = {
      title: 'Terms & conditions',
      published: true,
      data: { "links": this._finalData },
      footer_id: 2,
      contact: '',
    };

    this.footerService.updateFooter(body).subscribe({
      next: (result: any) => {
        this.messageService.add({
          key: 'bc',
          severity: 'success',
          summary: 'Success',
          detail: 'Changes successfully uploaded',
          life: 3000,
        });
        this._showLoader = false;
      },
      error: (result: any) => {
        this.azureLoggerConversion = result.error.msg;
        this.azureLoggerService.logException(this.azureLoggerConversion);
        this.messageService.add({
          key: 'bc',
          severity: 'error',
          summary: 'Something went wrong.',
          detail: result.error.msg,
          life: 3000,
        });
        this._showLoader = false;
      },
      complete: () => { },
    });
  }
  /*Start: handle input clicks for static inputs*/
  privacyPolicyClick(event: any) {
    this._setLinksArray.priivacy_policy = event.target.value;
    // this._setLinksArray.push('Privacy Policy', event.target.value)
  }
  TermsClick(event: any) {
    this._setLinksArray.terms_of_service = event.target.value;
    // this._setLinksArray.push('Terms Of Service', event.target.value)
  }
  /*End: handle input clicks for static inputs*/
  setEditable(data: any, index: any) {
    // data.focus();
    // this._disableEdit = false;
    this._setLinksArray[index].disabled = false;
  }
  setEditable2(data: any) {
    data.focus();
    this._disableEdit2 = false;
  }
  showFields() {
    this._showFields = true;
    this._counts = 0;

  }
  /*Add More Field Functionality :allow user to add some extra links */
  addMoreField() {
    var dd = this._setLinksArray.length + this._addMoreField.length

    if (dd < 4) {
      this._showFields = true;
      this._addMoreField.push({
        title: '',
        url: ''
      })
    }
    else {
      this.messageService.add({
        key: 'bc',
        severity: 'info',
        summary: 'Info',
        detail: 'You can add maximum of 2 fields only.',
        life: 3000,
      });
    }
  }
  privacyFocusOut(event: any, index: any) {
    // this._disableEdit = true;
    // this._setLinksArray[0] = event.target.value
    this._setLinksArray[index].disabled = true;
  }
}
