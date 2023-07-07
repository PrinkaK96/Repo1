import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { DateService } from 'src/app/services/DateChange/date.service';
import { VideosService } from 'src/app/services/Videos/videos.service';
import { LiveWebService } from 'src/app/services/liveWeb/live-web.service';

@Component({
  selector: 'stupa-live-matches',
  templateUrl: './live-matches.component.html',
  styleUrls: ['./live-matches.component.scss'],
})
export class LiveMatchesComponent implements OnInit {
  //#region Variavles
  _commonOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    autoplay: false,
    touchDrag: false,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    autoWidth:true, 
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
  @Output() isNoLive = new EventEmitter<any>();
  azureLoggerConversion: any= new Error();
  //#endregion
  constructor(public router: Router, private liveWeb : LiveWebService,
    private videosService: VideosService, private azureLoggerService:MyMonitoringService,
    private dateService: DateService) { }

  ngOnInit(): void {
    this.getGlobalTrendingMatches();
  }
  //#region This method is used for Get Live Matches list
  getGlobalTrendingMatches() {
    this._showLoader = true;
    this.liveWeb.getGlobalAllMatches().subscribe({
      next: (result: any) => {
        this._showLoader = false;
        this._liveMatchesList = [];
        this._liveMatchesList = result.body.live_matches;
        this.isMatchesExist();
      },
      error: (result: any) => {
        this._liveMatchesList = [];
        this._showLoader = false;
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
        this.isMatchesExist();
      },
      complete: () => { },
    })
  }
  //#endregion'
  //#region This method will redirect you view live videos page.
  viewLive(matchDetails: any) {
    this.router.navigate(['live-matches/live/view/' + matchDetails.playback_id])
  }
  //#endregion
  //#region With This method we are able to Emit
  isMatchesExist() {
    if (this._liveMatchesList.length == 0) {
      this.isNoLive.emit(true)
    } else {
      this.isNoLive.emit(false)
    }

  }
  getStreamStats(playBackId: any) {
    this._showLoader = true;
    this.videosService.getStreamStats(playBackId).subscribe({
      next: (result: any) => {
        this._showLoader = false;
        return result.body.data[0].views
      },
      error: (result: any) => {
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
        return 0;

      },
    })
  }
  //#endregion

 
}
