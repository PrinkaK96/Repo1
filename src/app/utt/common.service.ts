import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  baseUrl: any = 'http://20.235.240.3:8008';
  tName: any = 'utt'
  constructor(private http: HttpClient) { }

  getSquads() {
    return this.http.get(this.baseUrl + '/get_squads?tenant=' + this.tName);
  }
  getTie() {
    return this.http.get(this.baseUrl + '/get_ties?tenant=' + this.tName);
  }
  createTie(data: any) {
    return this.http.post(this.baseUrl + '/create_tie?tenant=' + this.tName, data)
  }
  createMatch(data: any) {
    return this.http.post(this.baseUrl + '/create_match?tenant=' + this.tName, data)
  }
  getForehandMaster(data: any) {
    return this.http.get(this.baseUrl + '/get_forehand_master?tenant=' + this.tName + '&gender=' + data);
  }
  getBackhandMaster(data: any) {
    return this.http.get(this.baseUrl + '/get_backand_master?tenant=' + this.tName + '&gender=' + data);
  }
  getUltimateServe(data: any) {
    return this.http.get(this.baseUrl + '/get_ulimate_servers?tenant=' + this.tName + '&gender=' + data);
  }
  getGrpLeaderboard() {
    return this.http.get(this.baseUrl + '/get_group_stage_leaderboard?tenant=' + this.tName);
  }
  getMaxRally() {
    return this.http.get(this.baseUrl + '/get_max_rally?tenant=' + this.tName);
  }
  getPLayers(data: any) {
    return this.http.get(this.baseUrl + '/get_players?tenant=' + this.tName + '&gender=' + data);
  }
}
