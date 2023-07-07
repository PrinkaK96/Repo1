import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SeeAllEventsService {
  token: any;
  getData:any
  date=new Date()
  constructor(private readonly httpClient: HttpClient) { 
     this.token = localStorage.getItem('admToken');
    
  }

  sellAllOngoing(type:any){
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.get(environment.global_url + 'tms/get_events?type='+type+'&utc_time=' + this.date.toISOString(),
      {
        headers: reqHeader,
        params: {

        },
        observe: 'response',
      }
    ).pipe(
      map((response: any) => {
        return response;
      }));
  }

  getPlayerParticipatedEvents(){
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.get(environment.global_url + 'tms/get_my_events',
      {
        headers: reqHeader,
        params: {

        },
        observe: 'response',
      }
    ).pipe(
      map((response: any) => {
        return response;
      }));
  }

  sellAllOngoingAtHome(type:any){
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
    });
    return this.httpClient.get(environment.global_url + 'tms/get_events?type='+type+'&utc_time=' + this.date.toISOString(),
      {
        headers: reqHeader,
        params: {

        },
        observe: 'response',
      }
    ).pipe(
      map((response: any) => {
        return response;
      }));
  }

  searchMatches(searchedString:string){
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
    });
    return this.httpClient.get(environment.global_url + 'tms/get_events?search='+searchedString,
      {
        headers: reqHeader,
        params: {

        },
        observe: 'response',
      }
    ).pipe(
      map((response: any) => {
        return response;
      }));
  }

  getProspectus(){
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
    });
    return this.httpClient.get(environment.global_url + 'tms/get_events?published=true',
      {
        headers: reqHeader,
        params: {

        },
        observe: 'response',
      }
    ).pipe(
      map((response: any) => {
        return response;
      }));
  }
  updateCategoryRegistrationByLastDate(event_id:any){
    const dd = {}
    const reqHeader = new HttpHeaders({
      'enctype': 'multipart/form-data',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.patch(environment.global_url + 'tms/update_category_registration_status_by_last_date?event_id=' + event_id +'&current_time_utc=' + this.date.toISOString(), dd,
      {
        headers: reqHeader,
        params: {

        },
        observe: 'response',
      }
    ).pipe(
      map((response: any) => {
        return response;
      }));
  }
}
