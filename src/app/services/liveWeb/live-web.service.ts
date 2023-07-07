import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class LiveWebService {
  token: any;
  constructor(private readonly httpClient: HttpClient) {
    this.token = localStorage.getItem('reqToken');
   }

   searchMatches(searchedString:string , data: any) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.httpClient.post(environment.global_url + 'tms/search_global_matches?search='+ searchedString+ '&page_num='+ data,
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

  getGlobalAllMatches(){
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    })
    return this.httpClient.get(environment.global_url + 'tms/get_global_all_matches', {
      headers: reqHeader,
      params: {},
      observe: 'response',
    }).pipe(map((response: any) => {
      return response;
    })
    );
  }
}
