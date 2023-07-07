import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { DashboardService } from 'src/app/services/Dashboard/dashboard.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { ProfileLettersService } from 'src/app/services/ProfileLetters/profile-letters.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';

@Component({
  selector: 'stupa-admin-player-dashboard',
  templateUrl: './admin-player-dashboard.component.html',
  styleUrls: ['./admin-player-dashboard.component.scss']
})

export class AdminPlayerDashboardComponent implements OnInit {
  azureLoggerConversion: any = new Error();
  first = 0;
  _currenAcceptedPage: number = 1;
  _totalPlayers: any=[];
  _playerrank: any=[];
  search: any='';
  constructor(private messageService: MessageService, private profileLettersService: ProfileLettersService, private dashboardService :DashboardService, private router:Router,
    private eventsService: EventsService, private azureLoggerService: MyMonitoringService, private encyptDecryptService: EncyptDecryptService,) {
    

  }
  ngOnInit(): void {
   
    this.getRanking();
  }
 
   //#region method to navigate to create-event screen if no event has been created initially
  eventClicked() {
    this.router.navigateByUrl('/event/create-event');
  }
   //#endregion method to navigate to create-event screen if no event has been created initially
  
  //#region API call to get players rank acccording too its category
  getRanking() {
    this.dashboardService.getAllPlayersAdmin(this._currenAcceptedPage,'',7).subscribe({
      next: (result: any) => {
        this._totalPlayers=result.body[0]
        this._playerrank = result.body[1]
        
      },
      error: (result: any) => {
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => { },
    });
  }

profileLetterService(data: any) {
  return this.profileLettersService.getFirstLetters(data);
}
  
  paginate(event: any) {
    this.first = event.first;
    this._currenAcceptedPage = event.page + 1;
    if (this.search != '') {
      this.searchPlayers()
    }
    else {
      this.getRanking()
    }
    
   
  }
  searchPlayers(){
    this.dashboardService.getAllPlayersAdmin(this._currenAcceptedPage, this.search,7).subscribe({
      next: (data: any) => {
        this._totalPlayers=data.body[0];
        this._playerrank = data.body[1];
       
      },
      error: (error:any) => {
      },
      complete: () => { },
    })
  }
  
}