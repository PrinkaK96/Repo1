import { Component, HostListener } from '@angular/core';
import { CommonService } from '../common.service';

@Component({
  selector: 'stupa-utt-layout',
  templateUrl: './utt-layout.component.html',
  styleUrls: ['./utt-layout.component.scss']
})
export class UttLayoutComponent {
  _selectedTab: any = 'player'
  maleList: any = []
  femaleList: any = []
  innerWidth: any
  _sidebarVisible: boolean = false
  _selectedGender: any = ''
  malePlayers: any = []
  femalePlayers: any = []
  maleTab: boolean = true
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
  }
  grpBoardList: any = []
  rallyList: any = []
  constructor(private commonService: CommonService) {
    this.innerWidth = window.innerWidth;
  }
  ngOnInit() {
    this.getForhandMaterMale()
    this.getForhandMaterFemale()
    this.getBackhandMaterMale()
    this.getBackhandMaterFemale()
    this.getUltimateServeMale()
    this.getUltimateServeFemale()
    this.getGrpLeaderboard()
    this.getMaxRally()
    this.getMalePlayers()
    this.getFemalePlayers()
    this._selectedGender = 'male'
  }
  setTab(data: any) {
    this._selectedTab = data

  }
  getForhandMaterMale() {
    // this.commonService.getForehandMaster('Male').subscribe({
    //   next: (res: any) => {
    //     this.maleList = res
    //   },
    //   error: (result: any) => {

    //   },
    //   complete: () => {}
    // })
    this.commonService.getForehandMaster('Male').subscribe((res: any) => {
      this.maleList = res
    })
  }
  getForhandMaterFemale() {
    
    this.commonService.getForehandMaster('Female').subscribe((res: any) => {
      this.femaleList = res
    })
  }
  getBackhandMaterMale() {
    this.commonService.getBackhandMaster('Male').subscribe((res: any) => {
      this.maleList = res
    })
  }
  getBackhandMaterFemale() {
    this.commonService.getBackhandMaster('Female').subscribe((res: any) => {
      this.femaleList = res
    })
  }
  getUltimateServeMale() {
    this.commonService.getUltimateServe('Male').subscribe((res: any) => {
      this.maleList = res
    })
  }
  getUltimateServeFemale() {
    this.commonService.getUltimateServe('Female').subscribe((res: any) => {
      this.femaleList = res
    })
  }
  showSidebar() {
    this._sidebarVisible = true
  }
  getGrpLeaderboard() {
    this.commonService.getGrpLeaderboard().subscribe((res: any) => {
      this.grpBoardList = res
    })
  }
  getMaxRally() {
    this.commonService.getMaxRally().subscribe((res: any) => {
      this.rallyList = res
    })
  }
  setGender(data: any) {
    this._selectedGender = data
    if (data === 'male') {
      this.maleTab = true
    }
    else {
      this.maleTab = false
    }
  }
  getMalePlayers() {
    this.commonService.getPLayers('Male').subscribe((res: any) => {
      this.malePlayers = res
    })
  }
  getFemalePlayers() {
    this.commonService.getPLayers('Female').subscribe((res: any) => {
      this.femalePlayers = res
    })
  }
}
