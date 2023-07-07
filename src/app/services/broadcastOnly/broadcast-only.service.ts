import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BroadcastOnlyService {
  token: any = '';
  constructor(private readonly httpClient: HttpClient,) {
    this.token = localStorage.getItem('reqToken');
  }

  createTournament(data: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.post(environment.global_url + 'tms/create_broadcast_event', data,
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

  updateTournament(data: any){
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.put(environment.global_url + 'tms/update_broadcast_event', data,
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

  getTournamentDetails(data: any){
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.post(environment.global_url + 'tms/create_event', data,
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

  updateEventImage(formData: any) {
    const reqHeader = new HttpHeaders({
      'enctype': 'multipart/form-data',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + this.token
    });
    return this.httpClient.post(environment.global_url+'file_upload?path=event/',formData,
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

  saveMatchDetail(data: any,event_id:any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.post(environment.global_url + 'tms/create_broadcast_matches?event_id='+ event_id, data,
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
  getMatchDetails(event_id:any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.get(environment.global_url + 'tms/get_broadcast_matches?event_id='+ event_id,
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

  getEventOfficial() {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.get(environment.global_url + "user/get_officials",
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
  editMatches(data: any,event_id:any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.patch(environment.global_url + 'tms/update_broadcast_matches?event_id='+ event_id, data,
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
  deleteMatchDetail(event_id:any,match_id:any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.delete(environment.global_url + 'tms/delete_broadcast_matches?event_id='+ event_id + '&match_id='+match_id,
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

  uploadBroadcastMatchImage(event_id:any,formData: any) {
    const reqHeader = new HttpHeaders({
      'enctype': 'multipart/form-data',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + this.token
    });
    return this.httpClient.post(environment.global_url+'tms/upload_broadcast_matches?event_id='+ event_id , formData,
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

  getBroadCastLiveMatches(event_id:any,flag:boolean) {
    if (this.token == null) {
      var reqHeader = new HttpHeaders({
        'Content-Type': 'application/json',
        'tenant': environment.tenant_Name,
      });
    }
    else {
      var reqHeader = new HttpHeaders({
        'Content-Type': 'application/json',
        'tenant': environment.tenant_Name,
        'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
      });
    }
    return this.httpClient.get(environment.global_url + 'tms/get_broadcast_matches?event_id='+ event_id+ '&live='+ flag,
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
