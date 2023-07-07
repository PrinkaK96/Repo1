import { Component } from '@angular/core';
import { Router } from "@angular/router"

@Component({
  selector: 'stupa-event-management',
  templateUrl: './event-management.component.html',
  styleUrls: ['./event-management.component.scss']
})
export class EventManagementComponent {
  CreateCategory: boolean = false;
  eventRequest: boolean=false;
  worldRank: boolean=false;

  constructor(private router: Router) { }
  createCategory(event_request:any) {
    if(event_request=='category'){
      this.CreateCategory = true;
      this.eventRequest = false;
      this.worldRank = false;

    }
    else if(event_request=="add-world-rank"){
      this.CreateCategory = false;
      this.eventRequest = false;
      this.worldRank = true;
    }
    else{
      this.eventRequest = true;
      this.CreateCategory = false;
      this.worldRank = false;
    }
    
  }
  goBack(){
    this.CreateCategory = false;
    this.eventRequest = false;
    this.worldRank = false;
  }
}
