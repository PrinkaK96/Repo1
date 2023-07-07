import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ProfileMenuService implements OnInit{
  token: any;
  constructor(private httpClient: HttpClient) {
   
  }
  ngOnInit() {
    this.token = localStorage.getItem('admToken');
  }
  getMasterCategories() {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer '
    });
    return this.httpClient.get(environment.global_url + 'tms/get_master_categories',
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

  getMasterCategoriesAdmin(unique_category=false) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer '
    });
    return this.httpClient.get(environment.global_url + 'tms/get_master_categories?unique_category='+ unique_category,
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

  getEventByVerificationStatus(status: any,page_num:any){
      const reqHeader = new HttpHeaders({
        'Content-Type': 'application/json',
        'tenant': environment.tenant_Name,
        
      });
      return this.httpClient.get(environment.global_url + 'tms/get_events?verify_type='+ status+'&page_num='+ page_num,
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

    updateVerificationStatusEvent(event_id:any,updatedData:any ,msg:any){
      const data ={}
      const reqHeader = new HttpHeaders({
        'Content-Type': 'application/json',
        'tenant': environment.tenant_Name,
        'Authorization': 'Bearer '+ localStorage.getItem('admToken')
      });
      return this.httpClient.put(environment.global_url + 'tms/update_event?event_id=' + event_id+'&message='+msg,updatedData,
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

    getEventsonSearcch(search:any , status:boolean , page_num:any){
      const reqHeader = new HttpHeaders({
        'Content-Type': 'application/json',
        'tenant': environment.tenant_Name
      });
      return this.httpClient.get(environment.global_url + 'tms/get_events?search='+ search +'&verify_type=' + status + '&page_num='+ 1,
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
//#region  Admin Category 
createAdminCategory(data:any){
  const reqHeader = new HttpHeaders({
    'Content-Type': 'application/json',
    'tenant': environment.tenant_Name,
    'Authorization': 'Bearer ' + localStorage.getItem('admToken')
  });
  return this.httpClient.post(environment.global_url + 'tms/create_master_category', data,
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
deleteAdminCategory(category_id:any){
  const reqHeader = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('admToken'),
    'tenant': environment.tenant_Name
  });
  return this.httpClient.delete(environment.global_url + 'tms/delete_master_category?category_id='+category_id,
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
updateCategory(data: any,category_id:any){
  const reqHeader = new HttpHeaders({
    'Content-Type': 'application/json',
    'tenant': environment.tenant_Name,
    'Authorization': 'Bearer ' + localStorage.getItem('admToken')
  });
  return this.httpClient.put(environment.global_url + 'tms/update_master_category?category_id='+ category_id, data,
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
//#endregion Admin Category 
  getMasterCategoriesByPartcipantTypeAndGenderId(unique_category = false, gender_id:any , participant_type_id:any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer '
    });
    return this.httpClient.get(environment.global_url + 'tms/get_master_categories?unique_category=' + unique_category+ '&gender_id=' + gender_id +  '&participant_type_id='+participant_type_id,
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
  myEvents(status: any,page_num:any,search:any){
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('reqToken')
    });
    let params = new HttpParams();
    if (status !== '') {
      params = params.append('verify_type', status);
    }
    if (page_num !== '') {
      params = params.append('page_num', page_num);
    }
    if (search !== '') {
      params = params.append('search', search);
    }
    return this.httpClient.get(environment.global_url + 'tms/get_events',
      {
        headers: reqHeader,
        params: params,
        observe: 'response',
      }
    ).pipe(
      map((response: any) => {
        return response;
      }));
  }

}
