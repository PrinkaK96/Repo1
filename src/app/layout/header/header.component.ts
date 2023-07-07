import {
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isSigned: boolean = false;
  innerWidth: any;
  containerMenu: any;
  show_languages2: any;
  _activeIndex: any = '';
  // hover: boolean = false;
  click: boolean = false;

  event: any;
  @Output() tabIndex = new EventEmitter<number>();
  _router: any;
  // supportLanguages: any;
  value1: string = 'En';
  supportLanguages = ['English', 'Portuguese'];
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
  }
  __change_image = 'pi pi-angle-down iconColor';
  __image1 = 'pi pi-angle-up iconColor';
  __image2 = 'pi pi-angle-down iconColor';
  english: any = '';
  Portuguese: any = '';
  _token: any;
  token_id: any
  _responseData: any = [];
  _isPlayer: boolean = false;
  _themes: any = ['Normal', 'Dark']
  element: any
  _selectedTheme: any
  checked: boolean = true;
  darkTheme: any
  lightTheme: any
  getTheme: any;
  @Output() refreshFooter = new EventEmitter<any>();

  constructor(
    private router: Router,
    private translateService: TranslateService,
    public encyptDecryptService: EncyptDecryptService,

  ) {
    this.checked = localStorage.getItem('isChecked') == 'true' ? true : false;
    this.changeColor()
    this.translateService.addLangs(['English', 'Portuguese']);
    this.translateService.setDefaultLang('English');
    if (
      localStorage.getItem('reqToken') !== 'undefined' &&
      localStorage.getItem('reqToken') !== null
    ) {
      this.isSigned = true;
    } else {
      this.isSigned = false;
    }
    const role = localStorage.getItem('rl')
    if (role != null && role == '7') {
      this._isPlayer = true;
    }
    else {
      this._isPlayer = false;
    }
    this.innerWidth = window.innerWidth;
    this._activeIndex = 'home';
    this._router = router;
  }

  ngOnInit(): void {

    this.event = this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    );
    localStorage.setItem('theme', JSON.stringify(this._themes))
    this.checked = localStorage.getItem('isChecked') == 'true' ? true : false;
  }

  changeIcon(event: any) {
    if (event.type == 'click' && this.__change_image === this.__image2) {
      this.__change_image = this.__image1;
    } else if (event.type == 'click' && this.__change_image === this.__image1) {
      this.__change_image = this.__image2;
    }
  }
  requestVerification() {
    this.router.navigate(['requests']);
  }
  toggleFunction() {
    this.containerMenu = document.getElementById('containerMenu');
    this.containerMenu?.classList.toggle('openMenu');

    //changes ends here
  }

  logout() {
    localStorage.removeItem('reqToken');
    localStorage.clear();
    localStorage.setItem('isChecked', JSON.stringify(this.checked));
    this.router.navigate(['/account/login']);
  }
  selectLang(lang: string) {
    this.translateService.use(lang);
  }


  UseLanguage(getlang: any, op: any) {
    this.translateService.use(getlang);
    op.hide();
  }
  hide(menuPopup: any) {
    menuPopup.hide();
  }

  activeNav(data: any, name: any) {
    this._activeIndex = name;
  }
  eventClicked() {
    this.tabIndex.emit();
  }
  isPlayer() {
    this.token_id = localStorage.getItem('reqToken')
    if (this.token_id !== undefined && this.token_id !== null) {
      const responseData = JSON.parse(
        atob(this.token_id.split('.')[1])
      );
      this._responseData.push(responseData);
    }
    if (this._responseData[0].role_id == 7) {
      return false
    } else {
      return true;
    }
  }

  isAdmin() {
    if (localStorage.getItem('isAdmin') == 'true') {
      return true;
    } else {
      return false;
    }
  }
  changeColor() {

    // this.checked = localStorage.getItem('isChecked') == 'true' ? true : false;
    if (this.checked) {
      localStorage.setItem('isChecked', JSON.stringify(this.checked))
      this.getTheme = localStorage.getItem('theme')
      // if (this.getTheme.length > 0) {
      //   this.darkTheme = JSON.parse(this.getTheme)[1]
      // }

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
      var normalAvatar = '#555555';


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
      this.element.style.setProperty('--profileSidebar', sidebarBg)
      this.element.style.setProperty('--profileDetails', boxBg)
      this._selectedTheme = this.darkTheme
    }
    else {
      localStorage.setItem('isChecked', JSON.stringify(this.checked))
      this.getTheme = localStorage.getItem('theme')
      // if (this.getTheme.length > 0) {
      //   // this.lightTheme = JSON.parse(this.getTheme)[0]
      // }


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
      var profileDetailsBg = '#f7f7f7'


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
      this.element.style.setProperty('--profileSidebar', bg);
      this.element.style.setProperty('--profileDetails', profileDetailsBg)
      this._selectedTheme = this.lightTheme
    }
    this.refreshFooter.emit(this.checked);
    // Set the color property to 'red'
  }
}
