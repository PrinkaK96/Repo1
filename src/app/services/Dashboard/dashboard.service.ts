import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EncyptDecryptService } from '../EncryptDecrypt/encypt-decrypt.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService implements OnInit {
  token: any = '';
  constructor(private readonly httpClient: HttpClient, private encyptDecryptService: EncyptDecryptService) {

  }
  ngOnInit(): void {
    this.token = localStorage.getItem('reqToken');
  }
  getTeams() {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    })
    return this.httpClient.get(environment.global_url + "tms/get_teams", {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map((response: any) => {
      return response;
    })
    );
  }

  deleteTeams(deletedTeamId: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    })
    return this.httpClient.delete(environment.global_url + "tms/delete_team?team_id=" + deletedTeamId, {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map((response: any) => {
      return response;
    })
    );
  }

  updateTeam(data: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.patch(environment.global_url + 'tms/update_team', data,
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
  getTeamsByParticipantID(participantId: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    })
    return this.httpClient.get(environment.global_url + "tms/get_teams?participant_type_id=" + participantId, {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map((response: any) => {
      return response;
    })
    );
  }
  duplicateTeamName(teamName: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    })
    return this.httpClient.get(environment.global_url + "tms/check_duplicate_team_name?name=" + teamName, {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map((response: any) => {
      return response;
    })
    );
  }
  duplicatePair(teamName: any, cat_id: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    })
    return this.httpClient.get(environment.global_url + 'tms/check_duplicate_team?category_id=' + cat_id + '&user_ids=' + teamName, {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map((response: any) => {
      return response;
    })
    );
  }
  getTeamsByParticipantIDAndEventId(participantId: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    })
    return this.httpClient.get(environment.global_url + "tms/get_teams?participant_type_id=" + participantId + '&event_id=' + this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    ), {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map((response: any) => {
      return response;
    })
    );
  }
  getAllPlayersForTeams(searchedString: any, CatDOBCap:any, gender_id:any , rating:any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    })
    let params = new HttpParams();
    
    if (searchedString !== '') {
      params = params.append('user_name', searchedString);
    }
    if (CatDOBCap !== null) {
      params = params.append('dob', CatDOBCap);
    }
    if (rating !== null) {
      params = params.append('rating', rating);
    }
    if (gender_id !== null) {
      params = params.append('gender_id', gender_id);
    }
    return this.httpClient.get(environment.global_url + 'user/get_user_by_role', {
      headers: reqHeader,
      params: params,
      observe: 'response',
    }).pipe(map((response: any) => {
      return response;
    })
    );
  
  }

  getQueuedPlayers(event_id: any, category_id: any, p_id: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    })
    return this.httpClient.get(environment.global_url + 'tms/get_event_registered_participants?event_id=' + event_id + '&participant_type_id=' + p_id + '&category_id=' + category_id + '&is_active=false&is_queued=true', {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map((response: any) => {
      return response;
    })
    );
  }

  updateQueuedPlayers(participant_id: any) {
    var data = {}
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.put(environment.global_url + 'tms/update_event_category_queued_player?participant_id=' + participant_id, data, {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map(
      (response: any) => {
        return response;
      })
      ,);
  }
  getAllPlayersinDashboard(searchedString: any, gender_id: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    })
    if (searchedString !== '' && gender_id !== '' && gender_id !== null) {
      return this.httpClient.get(environment.global_url + 'user/get_user_by_role?user_name=' + searchedString + '&gender_id=' + gender_id, {
        headers: reqHeader,
        params: {},
        observe: 'response',
      }).pipe(map((response: any) => {
        return response;
      })
      );
    } else {
      return this.httpClient.get(environment.global_url + 'user/get_user_by_role?gender_id=' + gender_id, {
        headers: reqHeader,
        params: {},
        observe: 'response',
      }).pipe(map((response: any) => {
        return response;
      })
      );
    }
  }
  getAllPlayersForDashboard(searchedString: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    })
    return this.httpClient.get(environment.global_url + 'user/get_user_by_role?user_name=' + searchedString, {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map((response: any) => {
      return response;
    })
    );

  }
  getUsersByRole(roleId: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('admToken')
    })
    return this.httpClient.get(environment.global_url + 'user/get_users_by_role?role_ids=' + roleId, {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map((response: any) => {
      return response;
    })
    );

  }
  getAllPlayersAdmin(page_num:any,search:any,role_id:any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('admToken')
    })
    let params = new HttpParams();
    
    if (page_num !== null) {
      params = params.append('page_num', page_num);
    }
    if (search != '') {
      params = params.append('user_name', search);
    }
    if (role_id != '') {
      params = params.append('role_id', role_id);
    }
    return this.httpClient.get(environment.global_url + 'user/get_user_by_role', {
      headers: reqHeader,
      params: params,
      observe: 'response',
    }).pipe(map((response: any) => {
      return response;
    })
    );

  }
}
