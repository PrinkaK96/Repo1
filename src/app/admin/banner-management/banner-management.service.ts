import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class BannerManagementService {
  token: string | null;

  constructor(private readonly httpClient: HttpClient) { this.token = localStorage.getItem('reqToken'); }
  getPublish() {
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
        'Authorization': 'Bearer ' + localStorage.getItem('admToken')
      });
    }
    return this.httpClient.get(environment.global_url + "asset/get_banners", {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map(
      (response: any) => {
        return response;
      })
      ,);
  }
  publishBanner(formData: any, publishUnpublishImage: any) {
    const reqHeader = new HttpHeaders({
      'enctype': 'multipart/form-data',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('admToken')
    });
    return this.httpClient.post(environment.global_url +'asset/create_banner?published=' + publishUnpublishImage, formData, {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map(
      (response: any) => {
        return response;
      })
      ,);
  }
  updateBanner(updatedArrangeView: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('admToken')
    });
    return this.httpClient.post(environment.global_url +'asset/update_banner', updatedArrangeView, {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map(
      (response: any) => {
        return response;
      })
      ,);
  }
  deleteBanner(banner_id: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('admToken')
    });
    return this.httpClient.post(environment.global_url +'asset/delete_banner', banner_id, {
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
