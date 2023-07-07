import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
// import { OwlOptions } from 'ngx-owl-carousel-o';
import { MessageService } from 'primeng/api';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { PlayerServiceService } from 'src/app/services/player/player-service.service';
import { ProfileLettersService } from 'src/app/services/ProfileLetters/profile-letters.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';

@Component({
  selector: 'stupa-registered',
  templateUrl: './registered.component.html',
  styleUrls: ['./registered.component.scss'],
})
export class RegisteredComponent implements OnInit {
  @Input() _showDetailsonIcon: any = []
  _players: any = [
  ];
  _eventSlider = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    margin: 5,
    autoWidth: true,
    navSpeed: 700,
    navText: [
      '<i class="pi pi-chevron-left"></i>',
      '<i class="pi pi-chevron-right"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
      180: {
        items: 2,
      },
      360: {
        items: 3,
      },
      540: {
        items: 4,
      },
      720: {
        items: 5,
      },
      900: {
        items: 6,
      }
    },
    nav: true,
  };
  constructor(
    private eventService: EventsService, private profileLettersService: ProfileLettersService,
    private encyptDecryptService: EncyptDecryptService,
    public router: Router, private playerService: PlayerServiceService, private messageService: MessageService
  ) {

  }
  ngOnInit() {

  }
  ngOnChanges(changes: SimpleChanges): void {
    this._showDetailsonIcon = changes['_showDetailsonIcon'].currentValue;
    //this._players = this._showDetailsonIcon.map((p:any)=>p.players)
  }
  profileLetterService(data: any) {
    return this.profileLettersService.getFirstLetters(data);
  }
}
