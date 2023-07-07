import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'stupa-social-share',
  templateUrl: './social-share.component.html',
  styleUrls: ['./social-share.component.scss']
})
export class SocialShareComponent {
  url: any;
  fullDescription: any;
  baseUrl: any;
  constructor(private route: ActivatedRoute) {
    this.baseUrl = environment.global_url;
  }

  ngOnInit(): void {
  }

}
