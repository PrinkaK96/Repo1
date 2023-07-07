import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { DateService } from 'src/app/services/DateChange/date.service';
import { VideosService } from 'src/app/services/Videos/videos.service';
import { LiveWebService } from 'src/app/services/liveWeb/live-web.service';

@Component({
  selector: 'stupa-live-matches-list',
  templateUrl: './live-matches-list.component.html',
  styleUrls: ['./live-matches-list.component.scss']
})
export class LiveMatchesListComponent {
  //#region Variables
  _commonOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    autoplay: false,
    touchDrag: false,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    margin: 25,
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
        items: 4,
      },
    },
    nav: false,
  };
  _liveMatchesList: any = [];
  _showLoader: boolean = false;
  azureLoggerConversion: any= new Error();
  _liveMatchesListCopy: any=[];
  searchedString: any='';
  //#endregion
  constructor(public router: Router, private liveWeb:LiveWebService,
    private videosService: VideosService, private dateService: DateService,
    private azureLoggerService : MyMonitoringService) { }

  ngOnInit(): void {
    this.getLiveMatches();
  }
  //#region This will redirect you for view videos.
  viewMatches(match_details: any) {
    this.router.navigate(['live-matches/live/view/' + match_details.playback_id])
  }
  //#endregion
  //#region With this method we are able to get live videos
  getLiveMatches() {
    this._showLoader = true;
    this.liveWeb.getGlobalAllMatches().subscribe({
      next: (result: any) => {
        this._showLoader = false;
        this._liveMatchesList = [];
        this._liveMatchesList =  result.body.live_matches;
        this._liveMatchesListCopy =  result.body.live_matches;
      },
      error: (result: any) => {
        this._showLoader = false;
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => { },
    })
  }
  //#endregion

  searchMatches(){
    this._liveMatchesList = this._liveMatchesListCopy.filter((item: any) => {
      return (
        item.playerA.toLowerCase().includes(this.searchedString.toLowerCase()) ||
        item.playerB.toLowerCase().includes(this.searchedString.toLowerCase()) ||
        item.event_name.toLowerCase().includes(this.searchedString.toLowerCase())
        );
    });
  }
}
