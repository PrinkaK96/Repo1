import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RulesSettingService {

  constructor(private readonly httpClient: HttpClient) { }

  updateRules(id:any, rules_set:any , rules_point:any,team_matches:any){
    const body = ''   
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    
    return this.httpClient.patch(environment.global_url + 'tms/update_event_rule?event_id='+id+'&rule_set=' +rules_set + '&rule_point='+rules_point+ '&team_matches='+team_matches,body,
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

  getRulesCategory(event:any){
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    
    return this.httpClient.get(environment.global_url + 'tms/get_events?event_id='+event,
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
  updateCategoryRules(id:any,data:any){
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    
    return this.httpClient.patch(environment.global_url + 'tms/update_category_rule?event_id='+id , data,
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
