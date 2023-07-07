import { formatDate } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { AccountService } from '../services/Account/account.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { TranslateService } from '@ngx-translate/core';
import { BannerManagementService } from '../admin/banner-management/banner-management.service';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
@Component({
  selector: 'app-landpage',
  templateUrl: './landpage.component.html',
  styleUrls: ['./landpage.component.scss'],
})
export class LandpageComponent implements OnInit {
  _ongoingMatchList: any = [];
  leftCarouselBtn: boolean = false;
  rightCarouselBtn: boolean = false;
  customArray: any;
  _upcomingMatchList: any = [];
  _recentMatchList: any = [];
  innerWidth: any;
  noofpages: number = 0;
  date = new Date();
  noofpages2: number = 0;
  slides: number = 3;
  supportLanguages=['English','Portuguese'];
  staticImage = '../../../assets/landpage/ongoingevent/slide1.png';
  imagePublished: any;
  azureLoggerConversion: any = new Error();
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
  }
  ngOnInit() {
    this.customArray = [
      '<i class="pi pi-chevron-left"></i>',
      '<i class="pi pi-chevron-right"></i>',
    ];
    this.getTournaments();
    this.getPublish();
  }
  getPassedData(data: any) {
    this.noofpages = data.startPosition;
  }
  getPassedData2(data: any) {
    this.noofpages2 = data.startPosition;
  }
  headerImageSlider: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    autoplay:true,
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 1,
      },
      740: {
        items: 1,
      },
      940: {
        items: 1,
      },
    },
    nav: false,
  };
  registrationOpen_slider: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
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
        items: 1,
      },
      740: {
        items: 1,
      },
      940: {
        items: 1,
      },
    },
    nav: true,
  };
  recentLive_slider: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    margin: 15,
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
    nav: true,
  };

  cValue = formatDate(this.date, 'dd-MM-yyyy', 'en-US');
  constructor(private accountService: AccountService, private translateService: TranslateService,private bannerService: BannerManagementService,private azureLoggerService: MyMonitoringService,) {
    this.translateService.addLangs(this.supportLanguages);
    this.translateService.setDefaultLang('English');

    // const browserLang= this.translateService.getBrowserLang();
    // this.translateService.use(browserLang);
    
    this.innerWidth = window.innerWidth;
    this.getTournaments();
  }
  setStyle() {
    if (this.noofpages > 0 || this.innerWidth < 700) {
      return { width: '100%' };
    } else {
      return { width: '45%' };
    }
  }
  setStyle2() {
    if (this.noofpages2 > 0 || this.innerWidth < 700) {
      return { width: '100%' };
    } else {
      return { width: '45%' };
    }
  }

  selectLang(lang:string){
    this.translateService.use(lang);
  }

  // images = [
  //   '../../../assets/landpage/imageSlider/slide1.png',
  //   '../../../assets/landpage/imageSlider/slide2.png',
  //   '../../../assets/landpage/imageSlider/slide3.png',
  //   '../../../assets/landpage/imageSlider/slide4.png',
  // ];
  getPublish(){
  this.bannerService.getPublish().subscribe
  ({
    next: (res: any) => {
      this.imagePublished = res.body.map((urlImg: any) => urlImg.url);
    },
    error: (result: any) => {
      this.azureLoggerConversion = result.error.msg
      this.azureLoggerService.logException(this.azureLoggerConversion )
    },
    complete: () => { },
  });
}
  events = [
    {
      name: 'Brazil Open table tennis tournament',
      thumb_video: '../../../assets/landpage/ongoingevent/slide1.png',
      start_date: this.cValue,
    },
    {
      name: 'Brazil Open table tennis tournament',
      thumb_video: '../../../assets/landpage/ongoingevent/slide1.png',
      start_date: this.cValue,
    },
    {
      name: 'Brazil Open table tennis tournament',
      thumb_video: '../../../assets/landpage/ongoingevent/slide1.png',
      start_date: this.cValue,
    },
    {
      name: 'Brazil Open table tennis tournament',
      thumb_video: '../../../assets/landpage/ongoingevent/slide1.png',
      start_date: this.cValue,
    },
    {
      name: 'Brazil Open table tennis tournament',
      thumb_video: '../../../assets/landpage/ongoingevent/slide1.png',
      start_date: this.cValue,
    },
  ];
  recentevents = [
    {
      name: 'Brazil Open table tennis tournament',
      thumb_video: '../../../assets/landpage/recentevent/slide1.png',
      start_date: this.cValue,
    },
    {
      name: 'Brazil Open table tennis tournament',
      thumb_video: '../../../assets/landpage/recentevent/slide1.png',
      start_date: this.cValue,
    },
    {
      name: 'Brazil Open table tennis tournament',
      thumb_video: '../../../assets/landpage/recentevent/slide1.png',
      start_date: this.cValue,
    },
    {
      name: 'Brazil Open table tennis tournament',
      thumb_video: '/assets/landpage/recentevent/slide1.png',
      start_date: this.cValue,
    },
    {
      name: 'Brazil Open table tennis tournament',
      thumb_video: '../../../assets/landpage/recentevent/slide1.png',
      start_date: this.cValue,
    },
  ];
  registrationOpen = [
    {
      name: 'Master cup at kaderpur village gurugram',
      image: '../../../assets/landpage/registrationopen/slide1.png',
      categories: [
        { name: "Men's" },
        { name: "Women's" },
        { name: 'Under 12' },
        { name: 'Under 15' },
        { name: 'Under 19' },
      ],
    },
    {
      name: 'Brazil Open table tennis tournament',
      image: '../../../assets/landpage/registrationopen/slide1.png',
      categories: [
        { name: "Men's" },
        { name: "Women's" },
        { name: 'Under 12' },
        { name: 'Under 15' },
        { name: 'Under 19' },
      ],
    },
    {
      name: 'Brazil Open table tennis tournament',
      image: '../../../assets/landpage/registrationopen/slide1.png',
      categories: [
        { name: "Men's" },
        { name: "Women's" },
        { name: 'Under 12' },
        { name: 'Under 15' },
        { name: 'Under 19' },
      ],
    },
    {
      name: 'Brazil Open table tennis tournament',
      image: '../../../assets/landpage/registrationopen/slide1.png',
      categories: [
        { name: "Men's" },
        { name: "Women's" },
        { name: 'Under 12' },
        { name: 'Under 15' },
        { name: 'Under 19' },
      ],
    },
    {
      name: 'Brazil Open table tennis tournament',
      image: '../../../assets/landpage/registrationopen/slide1.png',
      categories: [
        { name: "Men's" },
        { name: "Women's" },
        { name: 'Under 12' },
        { name: 'Under 15' },
        { name: 'Under 19' },
      ],
    },
  ];
  upcommingevent = [
    {
      name: 'Master cup at kaderpur village gurugram',
      image: '../../../assets/landpage/upcommingevent/slide1.png',
      categories: [
        { name: "Men's" },
        { name: "Women's" },
        { name: 'Under 12' },
        { name: 'Under 15' },
        { name: 'Under 19' },
      ],
    },
    {
      name: 'Brazil Open table tennis tournament',
      image: '../../../assets/landpage/upcommingevent/slide1.png',
      categories: [
        { name: "Men's" },
        { name: "Women's" },
        { name: 'Under 12' },
        { name: 'Under 15' },
        { name: 'Under 19' },
      ],
    },
    {
      name: 'Brazil Open table tennis tournament',
      image: '../../../assets/landpage/upcommingevent/slide1.png',
      categories: [
        { name: "Men's" },
        { name: "Women's" },
        { name: 'Under 12' },
        { name: 'Under 15' },
        { name: 'Under 19' },
      ],
    },
    {
      name: 'Brazil Open table tennis tournament',
      image: '../../../assets/landpage/upcommingevent/slide1.png',
      categories: [
        { name: "Men's" },
        { name: "Women's" },
        { name: 'Under 12' },
        { name: 'Under 15' },
        { name: 'Under 19' },
      ],
    },
    {
      name: 'Brazil Open table tennis tournament',
      image: '../../../assets/landpage/upcommingevent/slide1.png',
      categories: [
        { name: "Men's" },
        { name: "Women's" },
        { name: 'Under 12' },
        { name: 'Under 15' },
        { name: 'Under 19' },
      ],
    },
  ];
  // recentvideos = [
  //   { URL: 'https://www.youtube.com/embed/AeTUH5gc9J0' },
  //   { URL: 'https://www.youtube.com/embed/jW_vvLakIZ8' },
  //   { URL: 'https://www.youtube.com/embed/3uPkcRroNoQ' },
  //   { URL: 'https://www.youtube.com/embed/jW_vvLakIZ8' },
  //   { URL: 'https://www.youtube.com/embed/AeTUH5gc9J0' },
  //   { URL: 'https://www.youtube.com/embed/3uPkcRroNoQ' },
  // ];
  showcharacter2(events: any) {
    this.noofpages2 = events.page;
  }
  // slideVisible() {
  //   if (this.noofpages > 0) {
  //     return this.slides;
  //   }
  // }
  withInterval(get: any) {
    setInterval(get, 3000);
    return (get += 2);
  }
  ResponsiveItems = {
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
  };
  nonResponsiveItems = {
    0: {
      items: 1,
    },
    400: {
      items: 1,
    },
    740: {
      items: 1,
    },
    940: {
      items: 1,
    },
  };

  setItems() {
    if (this.noofpages > 0) {
      return this.ResponsiveItems;
    } else {
      return this.nonResponsiveItems;
    }
  }
  setItems2() {
    if (this.noofpages2 > 0) {
      return 3;
    } else {
      return 1;
    }
  }
  getTournaments() {
    this.accountService.getTournaments(-1).subscribe({
      next: (data: any) => {
        this._ongoingMatchList = data.data.ongoing;
        this._recentMatchList = data.data.recent;
        this._upcomingMatchList = data.data.upcoming;
        this.leftCarouselBtn = true;
        this.rightCarouselBtn = true;

      },
      error: (result: any) => {
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException( this.azureLoggerConversion)
      },
      complete: () => { },
    });
  }
}
