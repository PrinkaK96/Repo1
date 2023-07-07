import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  token: any = ""

  constructor(private readonly httpClient: HttpClient) {
    this.token = localStorage.getItem('admToken');
  }

  getRoleFields(roleId: number) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
    });

    return this.httpClient.get("http://20.83.52.157:8000/role/get_role_fields?role_id=" + roleId);
  }
  sendOTP(email: any) {
    return this.httpClient.get(environment.global_url + "auth/signup/send_otp?email=" + email,
      {
        headers: {
          'Content-Type': 'application/json',
          'tenant': environment.tenant_Name,
        },
        params: {
        },
        observe: 'response',
      }
    ).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  verifyOTP(data: any): Observable<any> {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('tokenForVerify')
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
  signUp(data: any) {
    const data1 = {}
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
    })
    // return this.httpClient.post("http://20.83.52.157:8001/auth/signup/", data);
    return this.httpClient.get(environment.global_url + "auth/check_existing_user?email=" + data, {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map((response: any) => {
      return response;
    })
    );
  }
  signUpSubmit(data: any) {

    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('tokenForSignUp')
    })
    // return this.httpClient.post("http://20.83.52.157:8001/auth/signup/", data);
    return this.httpClient.post(environment.global_url + "auth/signup", data, {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map((response: any) => {
      return response;
    })
    );
  }
  // login(data: any) {
  //   
  //   const reqHeader = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //   });
  //   const dd=this.httpClient.post("http://api.stupaevents.com:8001/auth/login/", data);
  //   return dd
  // }
  changePassword(data: any): Observable<any> {

    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('tokenForChangePassword')
    })
    return this.httpClient.post(environment.global_url + "auth/password_reset", data, {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map((response: any) => {
      return response;
    })
    );
  }
  login(data: any): Observable<any> {
    return this.httpClient.post(environment.global_url + "auth/login", data, {
      headers: {
        'Content-Type': 'application/json',
        'tenant': environment.tenant_Name,
      },

      withCredentials: true,
      params: {},
      observe: 'response',

    }).pipe(map(
      (response: any) => {
        return response;
      })
      ,);
  }
  getTournaments(organiser_id: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.httpClient.get("http://20.83.52.157:8002/get_tournaments?organiser_id=" + organiser_id);

  }
  forgotPassword(email: any) {
    return this.httpClient.get(environment.global_url + "auth/forgot/send_otp?email=" + email,
      {
        headers: {
          'Content-Type': 'application/json',
          'tenant': environment.tenant_Name,
        },
        params: {

        },
        observe: 'response',
      }
    ).pipe(
      map((response: any) => {
        return response;
      })
    );
  }


}