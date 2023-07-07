import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlayerServiceService {

  constructor(private readonly httpClient: HttpClient) { }

  updateFixtureFormat(eventId: any, fixtureId: any, categoryId: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.get(environment.global_url + 'tms/update_fixture_format?event_id=' + eventId + '&category_id=' + categoryId + '&fixture_format_id=' + fixtureId,
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
  mergeCategory(event_id: any, from_cat_id: any, to_cat_id: any) {
    const data = {}
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.patch(environment.global_url + 'tms/merge_category?event_id=' + event_id + '&from_cat_id=' + from_cat_id + '&to_cat_id=' + to_cat_id, data,
      {
        headers: reqHeader,
        params: {},
        observe: 'response',
      }
    ).pipe(
      map((response: any) => {
        return response;
      }));
  }
  updateParticipantCategory(participant_id: any, category_id: any, event_id: any) {
    const data = {}
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.patch(environment.global_url + 'tms/update_participant_category?participant_id=' + participant_id + '&category_id=' + category_id + '&event_id=' + event_id, data,
      {
        headers: reqHeader,
        params: {},
        observe: 'response',
      }
    ).pipe(
      map((response: any) => {
        return response;
      }));
  }
  getOrderHistory(page_num:any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.get(environment.global_url + 'tms/get_order_history_details?page_num='+ page_num,
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
  deleteFixtureFormat(eventId: any, categoryId: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.delete(environment.global_url + 'tms/delete_fixture_format?event_id=' + eventId + '&category_id=' + categoryId ,
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
  
  createSubClasses(data:any, event_id:any){
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer '+localStorage.getItem('reqToken')
    });
    return this.httpClient.put(environment.global_url + 'tms/create_sub_category?event_id='+ event_id,data, {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map(
      (response: any) => {
        return response;
      })
      ,);
  }
}
