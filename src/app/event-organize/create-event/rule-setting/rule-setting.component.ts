import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { RulesSettingService } from 'src/app/services/rulesSetting/rules-setting.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { MessageService } from 'primeng/api';
import { JsonDataCallingService } from 'src/app/services/LocalDataJsonDataAPI/json-data-calling.service';
import { Router } from '@angular/router';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
@Component({
  selector: 'app-rule-setting',
  templateUrl: './rule-setting.component.html',
  styleUrls: ['./rule-setting.component.scss'],
  providers: [MessageService]
})
export class RuleSettingComponent implements OnInit{
  value!: string;
  _ruleSettingForm!: FormGroup;
  _cities = [
    { name: 'Event' },
    { name: 'Category & Class' }
  ]
  _eventFlag: boolean = true;
  _categoryClassList: any = []
  _rulesCategory: any = []
  _rulesCard = false;
  _showAddButton = false;
  _eventSlider: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    margin: 15,
    autoWidth:true,
    navSpeed: 700,
    navText: [
      '<i class="pi pi-chevron-left"></i>',
      '<i class="pi pi-chevron-right"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
      940: {
        items: 3,
      },
    },
    nav: false,
  };
  _standardCardPoint: any;
  _reAssignedValue: any;
  _reAssignedScore: any;
  _reAssignFlag: boolean | undefined;
  _showSuccessMsg: boolean | undefined;
  _showIndex = false;
  _updateText = false;
  button: boolean | undefined;
  _closeCard = false;
  _ruleItems: any = [
    {
      id: 1,
      name: '1',
      isActive: false
    },
    {
      id: 2,
      name: '3',
      isActive: false
    }
    ,
    {
      id: 3,
      name: '5',
      isActive: true
    },
    {
      id: 4,
      name: '7',
      isActive: false
    }
  ];

  _currentRuleValue: any = '';
  _categories: any;
  _categoriesObject: any;
  _gender: any;
  _genderValue: any;
  _eventFixtureFormat: any;
  _eventParticipantType: any;
  _participantValue: any;
  _fixtureValue: any;
  addCategoryList = false;
  _showValues = false;
  _newArray: any;
  _currentCategoryRuleValue: any;
  _rules: any;
  _points: any;
  event: any;
  newCategoriesArray: any = [];
  _showLoader: boolean = false;
  @Output() tabIndex = new EventEmitter<number>();
  _showUpdatedValues: boolean = false;

  @Input() _tabIndex: any;
  _getResponseValue: any = '';
  _index: any;
  _showStandard: boolean = false;
  azureLoggerConversion: any = new Error();

  constructor(private formBuilder: FormBuilder,
    private rulesService: EventsService, private messageService: MessageService, private eventsService: EventsService, private azureLoggerService: MyMonitoringService,
    private rulesSetting: RulesSettingService, private jsonDataCallingService: JsonDataCallingService,
    private encyptDecryptService: EncyptDecryptService, private router: Router) {
    this._ruleSettingForm = this.formBuilder.group({
      scoreCard: new FormControl('5', Validators.required),
      pointSystem: new FormControl('1', Validators.required),
      reassignPoints: new FormControl('Standard Point', Validators.required),
      reassignScoreCard: new FormControl('5', Validators.required),
      ruleType: new FormControl(''),
      teamMatches: new FormControl(3)
    });

  }



  ngOnInit(): void {
    this.event = this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    );
    this.getEvents(this.event);
  }

  ngOnChanges() {
    this.event = this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    );
    //this.getEvents(this.event);
  }

  selectRuleType(event: any) {
    if (event.value.name === 'Event') {
      this._eventFlag = true;
    }
    else {
      this._eventFlag = false;
      this.selectcategoryClass();
    }

  }

  selectRule(event: any) {
    if (event === 'Event') {
      this._eventFlag = true;
    }
    else {
      this._eventFlag = false;
      //this.selectcategoryClass();
    }

  }
  selectcategoryClass() {
    this._showLoader = true;
    this._categoryClassList = []
    this._rulesCategory = []
    this.rulesSetting.getRulesCategory(this.event).subscribe({
      next: (data: any) => {
        this._showLoader = false;
        this._categoryClassList = data.body[0].categories.filter((is: any) => is.is_active == true);
        // this._categories = this._categoryClassList.map((cat: any) => cat.categories);
        // this._categoriesObject = this._categories[0].map((cat: any) => cat.category);
        // this._genderValue = this._gender.filter((x: any) => x.id == this._categoriesObject[0].gender_id)[0].name
        // this._participantValue = this._eventParticipantType.filter((x: any) => x.id == this._categoriesObject[0].participant_type_id)[0].name
        // this._rules = this._categories[0].map((rule: any) => rule.rule_set) === null ? this._categories[0].map((rule: any) => rule.rule_set) : 5
        // this._points = this._categories[0].map((rule: any) => rule.rule_point) === null ? this._categories[0].map((rule: any) => rule.rule_set) : 'Standard Point'

        for (let i = 0; i < this._categoryClassList.length; i++) {
          const dataExisting = {
            category_description: this._categoryClassList[i].category.category_description,
            participant_type_id: this._categoryClassList[i].category.participant_type_id,
            gender_id: this._categoryClassList[i].category.gender_id,
            rule_set: this._categoryClassList[i].rule_set,
            rule_point: this._categoryClassList[i].rule_point === 1 ? 'Standard Point' : 'Golden Point',
            category_id: this._categoryClassList[i].category_id,


          }
          if (dataExisting.gender_id === 1) {
            dataExisting.gender_id = 'Male'
          }
          else if (dataExisting.gender_id === 1) {
            dataExisting.gender_id = 'Female'
          }
          else {
            dataExisting.gender_id = 'Others'
          }
          if (dataExisting.participant_type_id === 1) {
            dataExisting.participant_type_id = 'Single'
          }
          else if (dataExisting.participant_type_id === 2) {
            dataExisting.participant_type_id = 'Teams'
          }
          else if (dataExisting.participant_type_id === 3) {
            dataExisting.participant_type_id = 'Doubles'
          }
          else {
            dataExisting.participant_type_id = 'Mixed-Doubles'
          }

          this._rulesCategory.push(dataExisting);

        }
      },
      error: (result: any) => {
        this._showLoader = false;
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
        this.messageService.add({
          key: 'bc',
          severity: 'error',
          summary: 'Error',
          detail: 'Some Error Occured',
          life: 3000,
        });
      },
      complete: () => {

      }
    })

  }
  updateRules() {
    this._showLoader = true;
    const rule_point = this._ruleSettingForm.controls['pointSystem'].value;
    const rule_set = this._currentRuleValue === "" ? 5 : this._currentRuleValue;
    const team_matches = this._ruleSettingForm.controls['teamMatches'].value;
    this.rulesSetting.updateRules(this.event, rule_set, rule_point,team_matches).subscribe({

      next: (result: any) => {
        this._showLoader = false;
        this.messageService.add({
          key: 'bc',
          severity: 'success',
          summary: 'Success',
          detail: result.body.msg,
          life: 3000,
        });
        this.getEvents(this.event)
      },
      error: (result) => {
        this._showLoader = false;
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion )
        this.messageService.add({
          key: 'bc',
          severity: 'error',
          summary: 'Error',
          detail: result.body != undefined? result.body.msg : result.error.msg,
          life: 3000,
        });
      },
      complete: () => { },
    })
  }

  reassignCard(index: any) {
    this._ruleSettingForm.controls['reassignPoints'].setValue('Standard Point')
    for (let i = 0; i < this._rulesCategory.length; i++) {
      if (index == i) {
        this._rulesCategory[i].addCategoryList = true;

      } else {
        this._rulesCategory[i].addCategoryList = false;
      }

    }
    this._rulesCard = true;
    this._showValues = true;
    // this._reAssignedValue = this._ruleSettingForm.controls['reassignPoints'].value;
    // this._reAssignedScore = this._ruleSettingForm.controls['reassignScoreCard'].value;

  }

  updateScoreCard(index: any) {
    this._showLoader = true;
    this.rulesService.addCategoryClass().subscribe({
      next: (result: any) => {
        this._showLoader = false;
        this._categoryClassList = result;
        result[index].addCategoryList = true;
      },
      error: (result) => {
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
        this._showLoader = false;
      },
      complete: () => { },

    });

  }

  closeCard(index: any) {

    this._reAssignedValue = this._ruleSettingForm.controls['reassignPoints'].value;
    this._reAssignedScore = this._ruleSettingForm.controls['reassignScoreCard'].value;
    this._rulesCard = false;
    this._categoriesObject[index].addCategoryList = false;
  }
  currentRule(data: any, index: any) {
    this._currentRuleValue = data.name;
    for (let i = 0; i < this._ruleItems.length; i++) {

      if (index == i) {
        this._ruleItems[i].isActive = true;
      } else {
        this._ruleItems[i].isActive = false;
      }
    }

  }

  currentCategoryRule(data: any, index: any) {
    this._currentCategoryRuleValue = data.name;
    for (let i = 0; i < this._ruleItems.length; i++) {
      if (index == i) {
        this._ruleItems[i].isActive = true;
      } else {
        this._ruleItems[i].isActive = false;
      }
    }
  }
  updateCard(index: any, item: any) {
    this._rulesCard = false;
    this._showUpdatedValues = true;
    for (let i = 0; i < this._rulesCategory.length; i++) {
      if (index == i) {
        this._rulesCategory[i].updatedCardValue = true;
        this._rulesCategory[i].rule_point = this._ruleSettingForm.controls['reassignPoints'].value;
        this._rulesCategory[i].rule_set = this._currentCategoryRuleValue;
      } else {
        this._rulesCategory[i].updatedCardValue = false;
        this._rulesCategory[i].rule_point = this._rulesCategory[i].rule_point
        this._rulesCategory[i].rule_set = this._rulesCategory[i].rule_set
      }

    }
    const updatedCategoryRules =
    {
      categories: [{
        category_id: item.category_id,
        rule_point: this._ruleSettingForm.controls['reassignPoints'].value === "Golden Point" ? 2 : 1,
        rule_set: this._currentCategoryRuleValue === undefined ? 5 : parseInt(this._currentCategoryRuleValue),
      }]

    }
    this.newCategoriesArray.push(updatedCategoryRules);
    this.rulesSetting.updateCategoryRules(this.event, updatedCategoryRules).subscribe({
      next: (result: any) => {
        this._ruleSettingForm.markAsPristine()
        this.messageService.add({
          key: 'bc',
          severity: 'success',
          summary: 'Success',
          detail: 'Category updated successfully',
          life: 3000,
        });
      },
      error: (result) => {
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
        this.messageService.add({
          key: 'bc',
          severity: 'error',
          summary: 'Error',
          detail: 'Some Error occured',
          life: 3000,
        });
      },
      complete: () => { },
    })
    this._rulesCard = false;
    this._showValues = false;

    setTimeout(() => {
      this.getEvents(this.event)
    }, 2000);
    
  }


  eventClicked() {
    this.tabIndex.emit();
  }
  reset() {
    // this._ruleSettingForm.controls['pointSystem'].setValue("1");
    // this._ruleItems[2].isActive = true;
    // this._ruleItems[0].isActive = false;
    // this._ruleItems[1].isActive = false;
    // this._ruleItems[3].isActive = false;
    this.getEvents(this.event)
  }
  resetCategory() {
    this._categoryClassList = []
    this.selectcategoryClass();
  }

  getEvents(event: any) {
    if(event!=null){

    this._showLoader = true
    this._showStandard = true;
    this._categoryClassList = []
    this._rulesCategory = []
    this.eventsService.getDetailsByEventId(this.event).subscribe({
      next: (data: any) => {
        this._showLoader = false
        var currentData = data.body.filter((x: any) => x.event_id == event)[0];
        if(currentData.rule_type!=null){ 
        if (currentData.rule_type === 'event') {
          this._eventFlag = true
          
          this._getResponseValue = currentData.categories[0].rule_set;

          if (this._getResponseValue === 1) {
            this._index = 0
          }
          else if (this._getResponseValue === 3) {
            this._index = 1
          }
          else if (this._getResponseValue === 5) {
            this._index = 2
          }
          else {
            this._index = 3
          }

          for (let i = 0; i < this._ruleItems.length; i++) {

            if (this._index == i) {
              this._ruleItems[i].isActive = true;
            } else {
              this._ruleItems[i].isActive = false;
            }
          }
          const pointValue = currentData.categories[0].rule_point;
          if(pointValue===1){
            this._ruleSettingForm.controls['pointSystem'].setValue('1')
          }
          else{
            this._ruleSettingForm.controls['pointSystem'].setValue('2')
          }
         const teamMatchValue =  currentData.categories[0].category.team_matches;
         this._ruleSettingForm.controls['teamMatches'].setValue(currentData.categories[0].team_matches);
        }
        // else {
        //   // this.selectRule('Category');
        //   this._eventFlag = false;
        //   this._categoryClassList=[]
        //   this._categoryClassList = data.body[0].categories.filter((is: any) => is.is_active == true);
        // // this._categories = this._categoryClassList.map((cat: any) => cat.categories);
        // // this._categoriesObject = this._categories[0].map((cat: any) => cat.category);
        // // this._genderValue = this._gender.filter((x: any) => x.id == this._categoriesObject[0].gender_id)[0].name
        // // this._participantValue = this._eventParticipantType.filter((x: any) => x.id == this._categoriesObject[0].participant_type_id)[0].name
        // // this._rules = this._categories[0].map((rule: any) => rule.rule_set) === null ? this._categories[0].map((rule: any) => rule.rule_set) : 5
        // // this._points = this._categories[0].map((rule: any) => rule.rule_point) === null ? this._categories[0].map((rule: any) => rule.rule_set) : 'Standard Point'

        // for (let i = 0; i < this._categoryClassList.length; i++) {
        //   const dataExisting = {
        //     category_description: this._categoryClassList[i].category.category_description,
        //     participant_type_id: this._categoryClassList[i].category.participant_type_id,
        //     gender_id: this._categoryClassList[i].category.gender_id,
        //     rule_set: this._categoryClassList[i].rule_set,
        //     rule_point: this._categoryClassList[i].rule_point === 1 ? 'Standard Point' : 'Golden Point',
        //     category_id: this._categoryClassList[i].category_id,


        //   }
        //   if (dataExisting.gender_id === 1) {
        //     dataExisting.gender_id = 'Male'
        //   }
        //   else if (dataExisting.gender_id === 1) {
        //     dataExisting.gender_id = 'Female'
        //   }
        //   else {
        //     dataExisting.gender_id = 'Others'
        //   }
        //   if (dataExisting.participant_type_id === 1) {
        //     dataExisting.participant_type_id = 'Single'
        //   }
        //   else if (dataExisting.participant_type_id === 2) {
        //     dataExisting.participant_type_id = 'Teams'
        //   }
        //   else if (dataExisting.participant_type_id === 3) {
        //     dataExisting.participant_type_id = 'Doubles'
        //   }
        //   else {
        //     dataExisting.participant_type_id = 'Mixed-Doubles'
        //   }

        //   this._rulesCategory.push(dataExisting);
        // }
        // }
      }
      else{
        this._eventFlag  = true
      }
      
      },
      error: (data: any) => {
        this._showLoader = false;
        this.azureLoggerConversion = data.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => {

      },
    })
  }
}
}