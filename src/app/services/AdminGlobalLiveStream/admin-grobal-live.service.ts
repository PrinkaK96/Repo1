import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminGrobalLiveService {

  token: any;
  constructor(private readonly httpClient: HttpClient) {
    this.token = localStorage.getItem('reqToken');
  }

  getTenantAllEvents(tenantName: any) {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': tenantName,
      'Authorization': 'Bearer ' + localStorage.getItem('admToken')
    });
    return this.httpClient.get(environment.global_url + 'tms/get_tenant_all_events', {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map(
      (response: any) => {
        return response;
      })
      ,);
  }
  getGlobalEventMatches(event_id: any, tenantName: any) {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': tenantName,
      'Authorization': 'Bearer ' + localStorage.getItem('admToken')
    });
    return this.httpClient.get(environment.global_url + 'tms/get_global_event_matches?event_id=' + event_id, {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map(
      (response: any) => {
        return response;
      })
      ,);
  }
  getGlobalTrendingMatches() {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('admToken')
    });
    return this.httpClient.get(environment.global_url + 'tms/get_global_trending_matches', {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map(
      (response: any) => {
        return response;
      })
      ,);
  }
  createTrendingMatches(data: any) {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('admToken')
    });
    return this.httpClient.post(environment.global_url + 'tms/create_trending_matches', data, {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map(
      (response: any) => {
        return response;
      })
      ,);
  }
  updateTrendingMatches(data: any) {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('admToken')
    });
    return this.httpClient.put(environment.global_url + 'tms/update_trending_matches', data, {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map(
      (response: any) => {
        return response;
      })
      ,);
  }
  getGlobalRecentEventMatches() {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('admToken')
    });
    return this.httpClient.get(environment.global_url + 'tms/get_global_recent_event_matches', {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map(
      (response: any) => {
        return response;
      })
      ,);
  }

  createRecentEvents(data: any) {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('admToken')
    });
    return this.httpClient.post(environment.global_url + 'tms/create_global_recent_event_all_matches', data, {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map(
      (response: any) => {
        return response;
      })
      ,);
  }
  updateRecentEvent(data: any) {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('admToken')
    });
    return this.httpClient.post(environment.global_url + 'tms/create_update_global_recent_event_all_matches', data, {
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
