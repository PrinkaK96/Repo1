import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as AOS from 'aos';
import { MyMonitoringService } from './services/AzureLogging/logging.service';
import { MessageService } from 'primeng/api';
import { ToastService } from './shared/toast/toast.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MyMonitoringService, MessageService, ToastService]
})
export class AppComponent implements OnInit {
  title = 'Stupa';
  supportLanguages = ['English', 'Portuguese'];
  favIcon: any = document.querySelector('#appIcon');
  _themes: any = ['Normal', 'Dark']
  element: any
  _selectedTheme: any
  checked: boolean = true;
  darkTheme: any
  lightTheme: any
  getTheme: any
  constructor(private translateService: TranslateService, private myMonitoringService: MyMonitoringService, private toastService: ToastService) {
    this.translateService.addLangs(this.supportLanguages);
    this.translateService.setDefaultLang('English');
    this.changeIcon();
    this.toastService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded with Auto Mode' });
    // document.addEventListener('contextmenu', event => event.preventDefault());
  }
  ngOnInit(): void {
    AOS.init();
    localStorage.setItem('theme', JSON.stringify(this._themes))
    this.checked = localStorage.getItem('isChecked') == 'true' ? true : false;
    this.changeColor()
  }
  changeIcon() {
    document.title = this.title;

  }
  selectLang(lang: string) {
    this.translateService.use(lang);
  }
  // onRightClick() {
  //   return false;
  // }
  changeColor() {

    // this.checked = localStorage.getItem('isChecked') == 'true' ? true : false;
    if (this.checked) {
      localStorage.setItem('isChecked', JSON.stringify(this.checked))
      this.getTheme = localStorage.getItem('theme')
      this.darkTheme = JSON.parse(this.getTheme)[1]
      this.element = document.querySelector(':root');
      var rs = getComputedStyle(this.element)
      // Get the native element
      // here we set our new color 
      var color = 'white'
      var bg = '#1e1e1e'
      var mainColor = '#ffffff'
      var boxBg = '#262626'
      var sidebarBg = '#1a1b1c'
      var btnBg = '#1E92CA'
      var secondaryColor = '#9d9d9d'
      var secondaryDarkColor = '#959595'
      var btnHover = '#045B85'
      // var mainLight = '#262626'
      var combinatingColor = '#1E92CA'
      var stroke = '#6b6b6b'
      var theme = 'dark'
      var radioBg = '#3d3d3d'
      var normalAvatar = '#555555'

      // here we replace our new color  for dark theme
      const forColor = this.element.style.setProperty('--text-color', color); // Set the color property to 'red'
      const forBg = this.element.style.setProperty('--bg-color', bg);
      const formainColor = this.element.style.setProperty('--main-color', mainColor);
      const forBoxBg = this.element.style.setProperty('--box-bg', boxBg);
      const forSidebarBg = this.element.style.setProperty('--sidebarBg', sidebarBg);
      const forBtnBg = this.element.style.setProperty('--main-bg', btnBg);
      const forSecondColor = this.element.style.setProperty('--secondary-color', secondaryColor);
      const forSecondaryDarkColor = this.element.style.setProperty('--secondar_dark-color', secondaryColor);
      const forBtnHover = this.element.style.setProperty('--btn-hover', btnHover);
      // const forMainLight = this.element.style.setProperty('--main-color-light', mainLight);
      const forCombinatingColor = this.element.style.setProperty('--combinating-color', combinatingColor);
      this.element.style.setProperty('--stroke', stroke)
      this.element.style.setProperty('--theme', theme)
      this.element.style.setProperty('--radio-bg', radioBg)
      this.element.style.setProperty('--normal-avatar', normalAvatar)
      this._selectedTheme = this.darkTheme
    }
    else {
      localStorage.setItem('isChecked', JSON.stringify(this.checked))
      this.getTheme = localStorage.getItem('theme')
      this.lightTheme = JSON.parse(this.getTheme)[0]

      this.element = document.querySelector(':root');
      var rs = getComputedStyle(this.element)
      // Get the native element
      var color = '#000000'
      var bg = '#ffffff'
      var mainColor = '#1b403a'
      var boxBg = '#ffffff'
      var sidebarBg = '#1b403a'
      var btnBg = '#1b403a'
      var secondaryColor = '#929292'
      var secondaryDarkColor = '#555555'
      var btnHover = '#1b403a'
      // var mainLight = '#262626'
      var combinatingColor = '#ff783e'
      var stroke = '#CECECE'
      var theme = 'light'
      var radioBg = '#ced4da'
      var normalAvatar = '#dee2e6'


      const forColor = this.element.style.setProperty('--text-color', color); // Set the color property to 'red'
      const forBg = this.element.style.setProperty('--bg-color', bg);
      const formainColor = this.element.style.setProperty('--main-color', mainColor);
      const forBoxBg = this.element.style.setProperty('--box-bg', boxBg);
      const forsidebarBg = this.element.style.setProperty('--sidebarBg', sidebarBg);
      const forBtnBg = this.element.style.setProperty('--main-bg', btnBg);
      const forSecondColor = this.element.style.setProperty('--secondary-color', secondaryColor);
      const forSecondaryDarkColor = this.element.style.setProperty('--secondar_dark-color', secondaryDarkColor);
      const forBtnHover = this.element.style.setProperty('--btn-hover', btnHover);
      // const forMainLight = this.element.style.setProperty('--main-color-light', mainLight);
      const forCombinatingColor = this.element.style.setProperty('--combinating-color', combinatingColor);
      this.element.style.setProperty('--stroke', stroke)
      this.element.style.setProperty('--theme', theme)
      this.element.style.setProperty('--radio-bg', radioBg)
      this.element.style.setProperty('--normal-avatar', normalAvatar)

      this._selectedTheme = this.lightTheme
    }

    // Set the color property to 'red'
  }
}
