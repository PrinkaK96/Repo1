import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';

@Component({
  selector: 'app-add-official',
  templateUrl: './add-official.component.html',
  styleUrls: ['./add-official.component.scss']
})
export class AddOfficialComponent implements OnInit {
  event: any;
  @Input() _tabIndex: any
  @Output() tabIndex = new EventEmitter<number>();
  constructor(public encyptDecryptService: EncyptDecryptService, public router: Router) { }

  ngOnInit(): void {
    this.event = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'))
  }
  eventClicked() {
    this.tabIndex.emit();

  }
}
