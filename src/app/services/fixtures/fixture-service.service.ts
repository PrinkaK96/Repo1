import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, shareReplay } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FixtureServiceService {
  players: any
  constructor(private readonly httpClient: HttpClient) { }
  generateFirstRoundKnockout(event: any, category: any) {
    if (localStorage.getItem('reqToken') == null) {
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
    return this.httpClient.get(environment.global_url + 'tms/get_ko_first_round?event_id=' + event + '&category_id=' + category,
      {
        headers: reqHeader,
        params: {},
        observe: 'response',
      }
    ).pipe(shareReplay(),
      map((response: any) => {
        return response;
      }));
  }

  generateCustomizedKnockout(data: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.post(environment.global_url + 'tms/create_custom_ko', data,
      {
        headers: reqHeader,
        params: {},
        observe: 'response',
      }
    ).pipe(shareReplay(),
      map((response: any) => {
        return response;
      }));
  }

  getKnockoutTournament(event: any, category: any, type = 'fixture') {
    if (localStorage.getItem('reqToken') == null) {
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
    return this.httpClient.get(environment.global_url + 'tms/get_ko_tournament?event_id=' + event + '&category_id=' + category + '&type=' + type,
      {
        headers: reqHeader,
        params: {},
        observe: 'response',
      }
    ).pipe(shareReplay(),
      map((response: any) => {
        return response;
      }));
  }

  deleteKnockout(event: any, category: any, group_type: number) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    })
    return this.httpClient.delete(environment.global_url + 'tms/delete_ko_tournament?event_id=' + event + '&category_id=' + category + '&group_type=' + group_type, {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(shareReplay(), map((response: any) => {
      return response;
    })
    );
  }
  //http://api.stupaevents.com:8005/tms/regenerate_ko_first_round_tournament?event_id=1&category_id=23
  regenerateKoFirstRoundTournament(event_id: any, category_id: any) {
    const data = {}
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.post(environment.global_url + 'tms/regenerate_ko_first_round_tournament?event_id=' + event_id + '&category_id=' + category_id, data,
      {
        headers: reqHeader,
        params: {},
        observe: 'response',
      }
    ).pipe(shareReplay(),
      map((response: any) => {
        return response;
      }));
  }

  getEventRoundRules(event_id: any, category_id: any) {
    if (localStorage.getItem('reqToken') == null) {
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
    return this.httpClient.get(environment.global_url + 'tms/get_event_round_rules?event_id=' + event_id + '&category_id=' + category_id,
      {
        headers: reqHeader,
        params: {},
        observe: 'response',
      }
    ).pipe(shareReplay(),
      map((response: any) => {
        return response;
      }));
  }

  updateEventCategoryRoundSettings(data: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.patch(environment.global_url + 'tms/update_event_category_round_setting', data,
      {
        headers: reqHeader,
        params: {

        },
        observe: 'response',
      }
    ).pipe(shareReplay(),
      map((response: any) => {
        return response;
      }));
  }
  getConsolationTournament(event: any, category: any, type = 'fixture') {
    if (localStorage.getItem('reqToken') == null) {
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
    return this.httpClient.get(environment.global_url + 'tms/get_ko_tournament?event_id=' + event + '&category_id=' + category + '&type=' + type + '&group_type=3',
      {
        headers: reqHeader,
        params: {},
        observe: 'response',
      }
    ).pipe(shareReplay(),
      map((response: any) => {
        return response;
      }));
  }
  generateFirstRoundConsolation(event: any, category: any) {
    if (localStorage.getItem('reqToken') == null) {
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
    return this.httpClient.get(environment.global_url + 'tms/get_ko_first_round?event_id=' + event + '&category_id=' + category + '&group_type=3',
      {
        headers: reqHeader,
        params: {},
        observe: 'response',
      }
    ).pipe(shareReplay(),
      map((response: any) => {
        return response;
      }));
  }
  getConsolationResult(event: any, category: any, type = 'fixture') {
    if (localStorage.getItem('reqToken') == null) {
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
    return this.httpClient.get(environment.global_url + 'tms/get_ko_tournament?event_id=' + event + '&category_id=' + category + '&group_type=' + 3 + '&type=' + type,
      {
        headers: reqHeader,
        params: {},
        observe: 'response',
      }
    ).pipe(shareReplay(),
      map((response: any) => {
        return response;
      }));
  }
}
