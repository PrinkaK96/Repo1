import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class RoleService {
  token: any;
  constructor(private readonly httpClient: HttpClient) {
    this.token = localStorage.getItem('admToken');
  }
  
  getAdminRoles() {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('admToken'),
     
    })
    return this.httpClient.get(environment.global_url+"role/get_roles",
      {
        headers: reqHeader,
        params: {},
        observe: 'response',
        withCredentials: true
      }
    ).pipe(
      map((response: any) => {
        return response;
      })
    );
    // return this.httpClient.get("http://20.83.52.157:8000/role/get_roles/");

    //return this.httpClient.get("assets/DummyJsonData/UserRoles.json");
  }
  getRoleWiseFields(roleId: number) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('admToken')
    })
    return this.httpClient.get(environment.global_url+"role/get_signup_fields?role_id=" + roleId,
      {
        headers: reqHeader,
        params: {

        },
        observe: 'response',
        withCredentials: true
      }
    ).pipe(
      map((response: any) => {
        return response;
      })
    );
    // return this.httpClient.get("http://20.83.52.157:8000/role/get_signup_fields?role_id=" + roleId,{ headers: reqHeader }
    // );
  }
  // getPreDefinedFields() {
  //   const reqHeader = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Authorization': 'Bearer ' + this.token
  //   })
  //   return this.httpClient.get(environment.global_url+"role/get_signup_fields?role_id=",
  //     {
  //       headers: reqHeader,
  //       params: {

  //       },
  //       observe: 'response',
  //     }
  //   ).pipe(
  //     map((response: any) => {
  //       return response;
  //     })
  //   );
  // }
  getAdminfields() {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('admToken')
    })
    return this.httpClient.get(environment.global_url+"role/get_fields",
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
  getPreviousFields(){
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('admToken')
    })
    return this.httpClient.get(environment.global_url+"role/get_previous_fields",
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
  assignFieldsToRole(data: any) {

    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('admToken')
    });
    return this.httpClient.put(environment.global_url+"role/assign_role_field/", data,
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
  createRole(data: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('admToken')
    })
    return this.httpClient.post(environment.global_url+"role/create_role/", data, {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map((response: any) => {
      return response;
    })
    );
  }
  updateRole(data: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('admToken')
    })
    return this.httpClient.put(environment.global_url+"role/update_role/", data, {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map((response: any) => {
      return response;
    })
    );
  }
  createRoleField(data: any) {

    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('admToken')
    });
    return this.httpClient.post(environment.global_url+"role/create_role_fields/", data, {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map((response: any) => {
      return response;
    })
    );
  }
  getRoles() {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('admToken')
    })
    return this.httpClient.get(environment.global_url+"role/get_roles",
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
    // return this.httpClient.get("http://20.83.52.157:8000/role/get_roles/");

    //return this.httpClient.get("assets/DummyJsonData/UserRoles.json");
  }
  getRolesForWeb() {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
    })
    return this.httpClient.get(environment.global_url + "role/get_roles",
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
    // return this.httpClient.get("http://20.83.52.157:8000/role/get_roles/");

    //return this.httpClient.get("assets/DummyJsonData/UserRoles.json");
  }
  getAccessPermissions() {

    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
    });
    return this.httpClient.get(environment.global_url+"role/get_permissions");
  }
  getFieldsRolesWise(role_id: any) {

    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('admToken')
    });
    // return this.httpClient.get("https://6443-103-48-197-42.in.ngrok.io/role/get_roles/");

    return this.httpClient.get(environment.global_url+"role/get_signup_fields?role_id=" + role_id,
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
  getFieldsForWeb(role_id: any) {

    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
    });
    // return this.httpClient.get("https://6443-103-48-197-42.in.ngrok.io/role/get_roles/");

    return this.httpClient.get(environment.global_url +"role/get_signup_fields?role_id=" + role_id,
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
  assignRoleField(data: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('admToken')
    })
    return this.httpClient.put(environment.global_url+"role/assign_role_field", data, {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map((response: any) => {
      return response;
    })
    );
  }
  deleteRoleField(data: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'tenant': environment.tenant_Name,
      'Authorization': 'Bearer ' + localStorage.getItem('admToken')
    })
    return this.httpClient.delete(environment.global_url+"role/delete_role_field", {
      headers: reqHeader,
      body:data,
      params: {},
      observe: 'response',
    }).pipe(map((response: any) => {
      return response;
    })
    );
  }
}
