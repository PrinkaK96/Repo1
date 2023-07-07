import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AdminFooterService {

  token: any;
  constructor(private readonly httpClient: HttpClient) {
    this.token = localStorage.getItem('reqToken');
  }
  updateFooter(formData: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('admToken')
    });
    return this.httpClient.post(environment.global_url + 'asset/update_footers', formData, {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map(
      (response: any) => {
        return response;
      })
      ,);
  }
  getFooter() {
    if(localStorage.getItem('reqToken') == null){
      var reqHeader = new HttpHeaders({
          'Content-Type': 'application/json',
          'tenant': environment.tenant_Name,
        });
      }
      else{
      var reqHeader = new HttpHeaders({
        'Content-Type': 'application/json',
        'tenant': environment.tenant_Name,
        'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
      });
    }
    return this.httpClient.get(environment.global_url + 'asset/get_footers', {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map(
      (response: any) => {
        return response;
      })
      ,);
  }
  verifyOTPAdminFooter(data: any, token: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + token
    })
    return this.httpClient.post(environment.global_url + "auth/verify_otp", data, {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map((response: any) => {
      return response;
    })
    );
  }
}
