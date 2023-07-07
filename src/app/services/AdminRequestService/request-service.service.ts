import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class RequestServiceService {
  token: any = '';

  constructor(private readonly httpClient: HttpClient) {
    if (localStorage.getItem('admToken') != null) {
      this.token = localStorage.getItem('admToken');
    }
    else {
      this.token = localStorage.getItem('reqToken');
    }

  }

  getRequests(user_Id: any, type: any, pageNumber: any) {
    var token: string | null = ''
    if (localStorage.getItem('admToken') != null) {
      token = localStorage.getItem('admToken');
    }
    else {
      token = localStorage.getItem('reqToken');
    }
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + token,
      'Accept-Language': 'en',
    });
    return this.httpClient.get(environment.global_url + "user/get_user_verification_requests?type=" + type + "&page_num=" + pageNumber, {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map(
      (response: any) => {
        return response;
      })
      ,);
  }
  getRequestsByRoleId(user_Id: any, type: any, pageNumber: any) {
    var token: string | null = ''
    if (localStorage.getItem('admToken') != null) {
      token = localStorage.getItem('admToken');
    }
    else {
      token = localStorage.getItem('reqToken');
    }
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + token,
      'Accept-Language': 'en',
    });
    return this.httpClient.get(environment.global_url + "user/get_user_verification_requests?type=" + type + "&page_num=" + pageNumber+"&role_id=7", {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map(
      (response: any) => {
        return response;
      })
      ,);
  }
  getRequestsWithSearch(user_Id: any, type: any, pageNumber: any, searchText: any) {
    var token: string | null = ''
    if (localStorage.getItem('admToken') != null) {
      token = localStorage.getItem('admToken');
    }
    else {
      token = localStorage.getItem('reqToken');
    }
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + token,
    });
    return this.httpClient.get(environment.global_url +"user/get_user_verification_requests?type=" + type + "&page_num=" + pageNumber +
      "&search=" + searchText, {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map(
      (response: any) => {
        return response;
      })
      ,);
  }
  // updateRequests(data: any) {
  //   const reqHeader = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Authorization': 'Bearer ' + this.token,
  // 'tenant': environment.tenant_Name,
  //   });
  //   return this.httpClient.post(environment.global_url +"user/update_verification_user_request?user_id=" + 23 + "&role_id=" + 7 + "&verified=" + true, data, {
  //     headers: reqHeader,
  //     params: {},
  //     observe: 'response',
  //   }).pipe(map(
  //     (response: any) => {
  //       return response;
  //     })
  //     ,);
  // }
  updateRequests(user_id: any, role_id: any, verified: any,msg:any) {
    const data = {}
    var token: string | null = ''
    if (localStorage.getItem('admToken') != null) {
      token = localStorage.getItem('admToken');
    }
    else {
      token = localStorage.getItem('reqToken');
    }
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + token
    });
    return this.httpClient.put(environment.global_url +"user/update_verification_user_request?user_id=" + user_id + "&role_id=" + role_id + "&verified=" + verified +"&accept_msg=" + msg, data, {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map(
      (response: any) => {
        return response;
      })
      ,);
  }
  rejectWithMessage(user_id: any, role_id: any, is_verified: any, msg: any) {

    const data = {}
    var token: string | null = ''
    if (localStorage.getItem('admToken') != null) {
      token = localStorage.getItem('admToken');
    }
    else {
      token = localStorage.getItem('reqToken');
    }
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + token
    });
    return this.httpClient.put(environment.global_url +"user/update_verification_user_request?user_id=" + user_id + "&role_id=" + role_id + "&verified=" + is_verified + "&rejection_msg=" + msg, data, {
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
