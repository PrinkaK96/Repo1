import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MembershipService {
  _token: any;
  token_id: any
  _responseData: any = [];
  constructor(private readonly httpClient: HttpClient) {
    this._token = localStorage.getItem('admToken');
  }

  getMemships() {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    })
    this.token_id = localStorage.getItem('reqToken')
    const responseData = JSON.parse(
      atob(this.token_id.split('.')[1])
    );
    this._responseData.push(responseData);
    return this.httpClient.get(environment.global_url + "role/get_role_memberships?role_id=" + this._responseData[0].role_id + "&type_id=1",
      {
        headers: reqHeader,
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
  getLoginMemships(role_id: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    })

    return this.httpClient.get(environment.global_url + "role/get_role_memberships?role_id=" + role_id,
      {
        headers: reqHeader,
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
  getMemberShipRoleWise(role_id: any, type_id: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('admToken')
    })
    return this.httpClient.get(environment.global_url + "role/get_role_memberships?role_id=" + role_id + '&type_id=' + type_id,
      {
        headers: reqHeader,
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
  createMemberShip(data: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('admToken')
    })
    return this.httpClient.post(environment.global_url + "role/create_membership/", data, {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map((response: any) => {
      return response;
    })
    );
  }
  updateMemberShip(data: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('admToken')
    })
    return this.httpClient.post(environment.global_url + "role/update_membership/", data, {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map((response: any) => {
      return response;
    })
    );
  }
  buyMemberShip(data: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('admToken')
    })
    return this.httpClient.post(environment.global_url + "role/assign_user_membership/", data, {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map((response: any) => {
      return response;
    })
    );
  }
  patchMembership(data: any, paymentId: any) {
    const nodata = {}
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    })
    return this.httpClient.patch(environment.global_url + 'user/user_membership_order?membership_id=' + data + '&payment_id=' + paymentId, nodata, {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map((response: any) => {
      return response;
    })
    );
  }
  getUserMembership() {
    const nodata = {}
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    })
    return this.httpClient.patch(environment.global_url + 'user/get_user_membership_details', nodata, {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map((response: any) => {
      return response;
    })
    );
  }

  checkUserMembershipStatus() {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    })
    return this.httpClient.get(environment.global_url + 'user/check_membership_order',
      {
        headers: reqHeader,
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
