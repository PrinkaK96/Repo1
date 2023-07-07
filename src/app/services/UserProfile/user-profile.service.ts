import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  constructor(private httpClient: HttpClient) { }
  getUserProfile() {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.get(environment.global_url + 'user/get_user_field_data',
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
  uploadProfileImage(event_id: any, image: any,) {
    
    const reqHeader = new HttpHeaders({
      'enctype': 'multipart/form-data',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken'),
    });
    return this.httpClient.post(environment.global_url + 'file_upload?path=UserProfile/' + event_id + '/', image,
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
  updateUserProfile(data: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    return this.httpClient.patch(environment.global_url + 'user/update_user_field_data', data,
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
  getUserRole() {
    
  const nodata = {}
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    })
    return this.httpClient.patch(environment.global_url+'user/get_user_roles',nodata, {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map((response: any) => {
      return response;
    })
    );
  }
}
